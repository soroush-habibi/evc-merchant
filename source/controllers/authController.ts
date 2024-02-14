import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";
import { Address } from "../models/address.model.js";
import { createTokens, generateRandomNumber } from "../utils/generators.js";
import { CustomErrorClass } from "../utils/customError.js";
import { registerDtoType, preRegisterDtoType, loginDtoType, preRegisterEmailDtoType, registerEmailDtoType, registerAddressDtoType, getUserAddressesDtoType, registerStoreDtoType } from "../dtos/auth.dto.js";
import bcrypt from 'bcrypt';
import { Store } from "../models/store.model.js";

const ENV = process.env.PRODUCTION

export default class authController {
    static async preRegister(req: Request, res: Response, next: NextFunction) {
        const { phoneNumber } = req.body as preRegisterDtoType;

        try {
            let user = await User.findOne({ phoneNumber });
            if (!user) user = await User.create({ phoneNumber });

            const existedOtp = await req.redis.get(`OTP_${phoneNumber as string}`);
            if (existedOtp) return next(CustomErrorClass.activeOtp());

            const newOtp = ENV === "production" ? generateRandomNumber(6) : '123456';
            //todo:where is sendSMS service?
            // const sms = ENV === "production" ? await sendSms(phoneNumber as string, newOtp) : { code: 200, msg: "testing" };

            await req.redis.set(`OTP_${phoneNumber as string}`, newOtp, 'EX', process.env.REDIS_TTL || "60");

            res.status(201).json({
                message: "otp sent!"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async register(req: Request, res: Response, next: NextFunction) {
        const { phoneNumber, otp, fullName, password, bankNumber, nationalCode } = req.body as registerDtoType;
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

            user.fullName = fullName;
            user.password = bcrypt.hashSync(password, 10);
            [accessToken, refreshToken] = createTokens({
                phoneNumber: phoneNumber,
                id: user.id
            });
            user.refreshToken = refreshToken;
            user.bankNumber = bankNumber;                                   //todo:bank number should be assigned with national code - bank api needed
            user.nationalCode = nationalCode;
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

    static async preRegisterEmail(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body as preRegisterEmailDtoType;

        try {
            let user = await User.findOne({ phoneNumber: req.user?.phoneNumber });
            if (!user || !user.password) return next(CustomErrorClass.userNotFound());
            if (user.email) return next(CustomErrorClass.emailRegisteredAlready());

            const newOtp = ENV === "production" ? generateRandomNumber(6) : '123456';
            //todo:where is send email service?
            // const sms = ENV === "production" ? await sendSms(phoneNumber as string, newOtp) : { code: 200, msg: "testing" };

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
        const { address, city, longitude, latitude, postCode, state, number } = req.body as registerAddressDtoType;

        try {
            const addressDoc = new Address({
                phoneNumber: req.user?.phoneNumber,
                longitude,
                latitude,
                city,
                state,
                postCode,
                number,
                address
            });

            await addressDoc.save();

            res.status(201).json({
                message: "address saved!"
            })
        } catch (e) {
            next(e)
        }
    }

    static async getUserAddresses(req: Request, res: Response, next: NextFunction) {
        let { page } = req.query as getUserAddressesDtoType;

        if (!page) page = String(0)

        try {
            const addresses = await Address.find({ phoneNumber: req.user?.phoneNumber }, undefined, { limit: 5, skip: (Number(page) - 1) * 5 });

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
            const user = await User.findById(req.user?.id);

            if (!user) return next(CustomErrorClass.userNotFound());

            res.status(200).json({
                message: "user info",
                data: {
                    id: user.id,
                    phoneNumber: user.phoneNumber,
                    fullName: user.fullName,
                    email: user.email,
                    bankNumber: user.bankNumber,
                    nationalCode: user.nationalCode
                }
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
}