import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";
import { Address } from "../models/address.model.js";
import { createTokens, generateRandomNumber } from "../utils/generators.js";
import { CustomErrorClass } from "../utils/customError.js";
import { registerDtoType, preRegisterDtoType, loginDtoType, preRegisterEmailDtoType, registerEmailDtoType, registerAddressDtoType, getUserAddressesDtoType, registerStoreDtoType, preRegisterNotifPhoneDtoType, registerNotifPhoneDtoType, registerStoreLogoDtoType, deleteAddressDtoType, editProfileDtoType, changePasswordDtoType, refreshTokenDtoType } from "../dtos/auth.dto.js";
import bcrypt from 'bcrypt';
import { Store } from "../models/store.model.js";
import crypto from "crypto";
import fsExtra from 'fs-extra';
import path from 'path';
import { Wallet } from "../models/wallet.model.js";
import { userStatusEnum } from "../enum/userStatus.enum.js";
import { merchantTypeEnum } from "../enum/merchantType.enum.js";
import { storeStatusEnum } from "../enum/storeStatus.enum.js";
import { sendSms } from "../utils/sms.js";
import JWT, { JwtPayload } from "jsonwebtoken";
import axios from "axios";

const ENV = process.env.PRODUCTION

export default class authController {
    static async preRegister(req: Request, res: Response, next: NextFunction) {
        const { phoneNumber } = req.body as preRegisterDtoType;

        try {
            const evcUser = await axios.get(`https://api.test.evipclub.org/user/admin/exist/${phoneNumber}`,
                {
                    headers: {
                        "x-api-key": process.env.EVC_ADMIN_API_KEY
                    }
                });
            if (evcUser.data.statusCode !== 200) return next(CustomErrorClass.evcAuthError());
            let user = await User.findOne({ phoneNumber });
            if (!user) user = await User.create({ phoneNumber });

            const existedOtp = await req.redis.get(`OTP_${phoneNumber as string}`);
            if (existedOtp) return next(CustomErrorClass.activeOtp());

            const newOtp = ENV === "production" ? generateRandomNumber(6) : '123456';
            if (ENV === "production") await sendSms(phoneNumber as string, newOtp);

            await req.redis.set(`OTP_${phoneNumber as string}`, newOtp, 'EX', process.env.REDIS_TTL || "60");

            res.status(201).json({
                message: "otp sent!"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async register(req: Request, res: Response, next: NextFunction) {
        const { phoneNumber, otp, password } = req.body as registerDtoType;
        let accessToken, refreshToken;

        try {
            let user = await User.findOne({ phoneNumber });
            if (!user) return next(CustomErrorClass.userNotFound());

            if (user.password) return next(CustomErrorClass.alreadyRegistered());

            const existedOtp = await req.redis.get(`OTP_${phoneNumber as string}`);
            if (!existedOtp) return next(CustomErrorClass.noOtp());

            if (existedOtp !== otp) {
                await req.redis.del(`OTP_${phoneNumber as string}`);
                return next(CustomErrorClass.wrongOtp());
            }

            user.password = bcrypt.hashSync(password, 10);
            [accessToken, refreshToken] = createTokens({
                phoneNumber: phoneNumber,
                id: user.id
            });
            user.refreshToken = refreshToken;
            await user.save();
            await req.redis.del(`OTP_${phoneNumber as string}`);

            res.status(201).json({
                message: "saved!",
                data: { accessToken, refreshToken }
            });
        } catch (e) {
            return next(e);
        }
    }

    static async editProfile(req: Request, res: Response, next: NextFunction) {
        const body = req.body as editProfileDtoType;

        try {
            const user = await User.findOne({ phoneNumber: req.user?.phoneNumber });
            if (!user) return next(CustomErrorClass.userNotFound());
            if (user.type && user.type !== body.type) return next(CustomErrorClass.badRequest());

            if (body.type === merchantTypeEnum.NATURAL) {
                if (body.fullName) user.fullName = body.fullName;
                if (body.bankNumber) user.bankNumber = body.bankNumber;
                if (body.nationalCode) user.nationalCode = body.nationalCode;
            } else if (body.type === merchantTypeEnum.JURIDICAL) {
                if (body.companyCode) user.companyCode = body.companyCode;
                if (body.nationalId) user.nationalId = body.nationalId;
                if (body.economicCode) user.economicCode = body.economicCode;
            }
            user.status = userStatusEnum.UNVERIFIED;

            await user.save();

            res.status(201).json({
                message: "user saved!",
            });
        } catch (e) {
            return next(e);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        const { phoneNumber, otp, password } = req.query as loginDtoType;

        try {
            let user = await User.findOne({ phoneNumber });
            if (!user || !user.password) return next(CustomErrorClass.userNotFound());

            if (otp) {
                const existedOtp = await req.redis.get(`OTP_${phoneNumber as string}`);
                if (!existedOtp) return next(CustomErrorClass.noOtp());

                if (existedOtp !== otp) {
                    await req.redis.del(`OTP_${phoneNumber as string}`);
                    return next(CustomErrorClass.wrongOtp());
                }

                let accessToken, refreshToken;
                [accessToken, refreshToken] = createTokens({
                    phoneNumber: phoneNumber,
                    id: user.id
                });
                user.refreshToken = refreshToken;
                await user.save();
                await req.redis.del(`OTP_${phoneNumber as string}`);

                res.json({
                    message: "logged in!",
                    data: { accessToken, refreshToken }
                });
            } else if (password) {
                if (!bcrypt.compareSync(password, user.password)) {
                    return next(CustomErrorClass.wrongPassword());
                }

                let accessToken, refreshToken;
                [accessToken, refreshToken] = createTokens({
                    phoneNumber: phoneNumber,
                    id: user.id
                });
                user.refreshToken = refreshToken;
                await user.save();

                res.json({
                    message: "logged in!",
                    data: { accessToken, refreshToken }
                });
            }
        } catch (e) {
            return next(e);
        }
    }

    static async refreshToken(req: Request, res: Response, next: NextFunction) {
        const body = req.body as refreshTokenDtoType;

        try {
            const data = JWT.verify(body.accessToken, process.env.JWT_SECRET!);

            const user = await User.findById((data as JwtPayload).payload.id);
            if (!user) return next(CustomErrorClass.userNotFound());

            return res.json({
                message: "token is valid"
            });

        } catch (e: any) {
            if (e.name === "TokenExpiredError") {
                try {
                    const data = JWT.verify(body.refreshToken, process.env.JWT_REFRESH_SECRET!);

                    const user = await User.findById((data as JwtPayload).payload.id);
                    if (!user) return next(CustomErrorClass.userNotFound());

                    if (user.refreshToken !== body.refreshToken) {
                        user.refreshToken = "";
                        await user.save();
                        return next(CustomErrorClass.authError());
                    }

                    const [accessToken, refreshToken] = createTokens({
                        phoneNumber: user.phoneNumber,
                        id: user.id
                    });
                    user.refreshToken = refreshToken;
                    await user.save();
                    return res.json({
                        message: "token refreshed!",
                        data: { accessToken, refreshToken }
                    });
                } catch (e) {
                    return next(CustomErrorClass.authError());
                }
            }
            return next(CustomErrorClass.authError());
        }
    }

    static async changePassword(req: Request, res: Response, next: NextFunction) {
        const body = req.body as changePasswordDtoType;

        try {
            const user = await User.findOne({ phoneNumber: body.phoneNumber });
            if (!user || !user.password) return next(CustomErrorClass.userNotFound());

            const existedOtp = await req.redis.get(`OTP_${body.phoneNumber as string}`);
            if (!existedOtp) return next(CustomErrorClass.noOtp());

            if (existedOtp !== body.otp) {
                await req.redis.del(`OTP_${body.phoneNumber as string}`);
                return next(CustomErrorClass.wrongOtp());
            }

            user.password = user.password = bcrypt.hashSync(body.password, 10);;
            user.refreshToken = undefined;
            await user.save();
            await req.redis.del(`OTP_${body.phoneNumber as string}`);

            res.status(201).json({
                message: "password changed!"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async preRegisterEmail(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body as preRegisterEmailDtoType;

        try {
            let user = await User.findOne({ phoneNumber: req.user?.phoneNumber });
            if (!user || !user.password) return next(CustomErrorClass.userNotFound());
            if (user.email) return next(CustomErrorClass.emailRegisteredAlready());

            const newOtp = ENV === "production" ? generateRandomNumber(6) : '123456';
            if (ENV === "production") await sendSms(req.user?.phoneNumber as string, newOtp);

            await req.redis.set(`EOTP_${email as string}`, newOtp, 'EX', process.env.REDIS_EMAIL_TTL || "120");

            res.status(201).json({
                message: "otp sent!"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async registerEmail(req: Request, res: Response, next: NextFunction) {
        const { email, otp } = req.body as registerEmailDtoType;

        try {
            const existedOtp = await req.redis.get(`EOTP_${email as string}`);
            if (!existedOtp) return next(CustomErrorClass.noOtp());

            if (existedOtp !== otp) {
                await req.redis.del(`EOTP_${email as string}`);
                return next(CustomErrorClass.wrongOtp());
            }

            let user = await User.findOne({ phoneNumber: req.user?.phoneNumber });
            if (!user) return next(CustomErrorClass.userNotFound());

            user.email = email;
            await user.save();
            await req.redis.del(`EOTP_${email as string}`);

            res.status(201).json({
                message: "email saved!"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async registerAddress(req: Request, res: Response, next: NextFunction) {
        const { address, city, longitude, latitude, postCode, state, number, publicMode } = req.body as registerAddressDtoType;

        try {
            if (!req.user) return next(CustomErrorClass.userNotFound());
            let addressDoc = await Address.findOne({ postCode: postCode, phoneNumber: req.user.phoneNumber });
            if (!addressDoc) addressDoc = new Address();
            addressDoc.phoneNumber = req.user.phoneNumber;
            addressDoc.city = city;
            addressDoc.state = state;
            addressDoc.postCode = postCode;
            addressDoc.number = number;
            addressDoc.address = address;
            if (longitude) addressDoc.longitude = longitude;
            if (latitude) addressDoc.latitude = latitude;
            if (publicMode !== undefined) addressDoc.public = publicMode;

            await addressDoc.save();

            res.status(201).json({
                message: "address saved!"
            })
        } catch (e) {
            next(e)
        }
    }

    static async deleteAddress(req: Request, res: Response, next: NextFunction) {
        const query = req.query as deleteAddressDtoType;

        try {
            if (!req.user) return next(CustomErrorClass.userNotFound());
            let addressDoc = await Address.findOne({ postCode: query.postCode, phoneNumber: req.user.phoneNumber });
            if (!addressDoc) return next(CustomErrorClass.addressNotFound());

            const result = await addressDoc.deleteOne();
            if (!result.acknowledged) return next(CustomErrorClass.internalError());

            res.status(200).json({
                message: "address removed!"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async getUserAddresses(req: Request, res: Response, next: NextFunction) {
        let { page, postCode } = req.query as getUserAddressesDtoType;

        if (!page) page = String(0)

        try {
            const filter: any = {
                phoneNumber: req.user?.phoneNumber
            }
            if (postCode) filter.postCode = postCode;
            const addresses = await Address.find(filter, undefined, { limit: 5, skip: (Number(page) - 1) * 5 });

            res.status(200).json({
                message: "ok",
                data: addresses
            });
        } catch (e) {
            next(e)
        }
    }

    static async getUserInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await User.findById(req.user?.id, {
                password: 0,
                refreshToken: 0
            });

            if (!user) return next(CustomErrorClass.userNotFound());

            res.status(200).json({
                message: "user info",
                data: user
            });
        } catch (e) {
            return next(e);
        }
    }

    static async registerStore(req: Request, res: Response, next: NextFunction) {
        const body = req.body as registerStoreDtoType;

        try {
            const user = await User.findById(req.user?.id);

            if (!user) return next(CustomErrorClass.userNotFound());

            let store = await Store.findOne({ merchantId: req.user?.id });

            if (!store) {
                store = await Store.create({
                    name: body.name,
                    merchantId: req.user?.id,
                    about: body.about,
                    phoneNumber: body.phoneNumber,
                    website: body.website
                });
            } else {
                store.name = body.name;
                if (body.about) store.about = body.about;
                if (body.phoneNumber) store.phoneNumber = body.phoneNumber;
                if (body.website) store.website = body.website;
                store.status = storeStatusEnum.UNVERIFIED;
                await store.save();
            }

            res.status(201).json({
                message: "store saved!",
                data: store
            });
        } catch (e) {
            return next(e)
        }
    }

    static async getStoreInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const store = await Store.findOne({
                merchantId: req.user?.id
            });

            if (!store) return next(CustomErrorClass.storeNotFound());

            res.status(200).json({
                message: "store info",
                data: store
            });
        } catch (e) {
            return next(e)
        }
    }

    static async registerStoreLogo(req: Request, res: Response, next: NextFunction) {
        const body = req.body as registerStoreLogoDtoType;

        try {
            await Store.updateOne({
                merchantId: req.user?.id
            }, {
                $set: {
                    logo: body.logoUrl,
                    status: storeStatusEnum.UNVERIFIED
                }
            });


            res.status(201).json({
                message: "logo saved!"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async preRegisterNotifPhone(req: Request, res: Response, next: NextFunction) {
        const body = req.body as preRegisterNotifPhoneDtoType;

        try {
            const user = await User.findById(req.user?.id);

            if (!user) return next(CustomErrorClass.userNotFound());

            if (body.phoneNumber === user.phoneNumber) return next(CustomErrorClass.duplicateNotifPhone());

            const existedOtp = await req.redis.get(`NOTP_${body.phoneNumber}`);
            if (existedOtp) return next(CustomErrorClass.activeOtp());

            const newOtp = ENV === "production" ? generateRandomNumber(6) : '123456';
            if (ENV === "production") await sendSms(body.phoneNumber, newOtp);

            await req.redis.set(`NOTP_${body.phoneNumber}`, newOtp, 'EX', process.env.REDIS_TTL || "60");

            res.status(201).json({
                message: "otp sent!"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async registerNotifPhone(req: Request, res: Response, next: NextFunction) {
        const body = req.body as registerNotifPhoneDtoType;

        try {
            let user = await User.findById(req.user?.id)
            if (!user) return next(CustomErrorClass.userNotFound());

            const existedOtp = await req.redis.get(`NOTP_${body.phoneNumber as string}`);
            if (!existedOtp) return next(CustomErrorClass.noOtp());

            if (existedOtp !== body.otp) {
                await req.redis.del(`NOTP_${body.phoneNumber as string}`);
                return next(CustomErrorClass.wrongOtp());
            }

            user.notifPhone = body.phoneNumber;
            await user.save();
            await req.redis.del(`NOTP_${body.phoneNumber as string}`);

            res.status(201).json({
                message: "saved!"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async getWallet(req: Request, res: Response, next: NextFunction) {
        try {
            let wallet = await Wallet.findOne({ userId: req.user?.id });

            if (!wallet) {
                wallet = await Wallet.create({
                    userId: req.user?.id
                });
            }

            res.status(200).json({
                message: "wallet info",
                data: wallet
            });
        } catch (e) {
            return next(e);
        }
    }
}