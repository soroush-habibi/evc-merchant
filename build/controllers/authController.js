import { User } from "../models/user.model.js";
import { Address } from "../models/address.model.js";
import { createTokens, generateRandomNumber } from "../utils/generators.js";
import { CustomErrorClass } from "../utils/customError.js";
import bcrypt from 'bcrypt';
import { Store } from "../models/store.model.js";
import crypto from "crypto";
import fsExtra from 'fs-extra';
import path from 'path';
import { Wallet } from "../models/wallet.model.js";
const ENV = process.env.PRODUCTION;
export default class authController {
    static async preRegister(req, res, next) {
        const { phoneNumber } = req.body;
        try {
            let user = await User.findOne({ phoneNumber });
            if (!user)
                user = await User.create({ phoneNumber });
            const existedOtp = await req.redis.get(`OTP_${phoneNumber}`);
            if (existedOtp)
                return next(CustomErrorClass.activeOtp());
            const newOtp = ENV === "production" ? generateRandomNumber(6) : '123456';
            //todo:where is sendSMS service?
            // const sms = ENV === "production" ? await sendSms(phoneNumber as string, newOtp) : { code: 200, msg: "testing" };
            await req.redis.set(`OTP_${phoneNumber}`, newOtp, 'EX', process.env.REDIS_TTL || "60");
            res.status(201).json({
                message: "otp sent!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async register(req, res, next) {
        const { phoneNumber, otp, password } = req.body;
        let accessToken, refreshToken;
        try {
            let user = await User.findOne({ phoneNumber });
            if (!user)
                return next(CustomErrorClass.userNotFound());
            if (user.password)
                return next(CustomErrorClass.alreadyRegistered());
            const existedOtp = await req.redis.get(`OTP_${phoneNumber}`);
            if (!existedOtp)
                return next(CustomErrorClass.noOtp());
            if (existedOtp !== otp) {
                await req.redis.del(`OTP_${phoneNumber}`);
                return next(CustomErrorClass.wrongOtp());
            }
            user.password = bcrypt.hashSync(password, 10);
            [accessToken, refreshToken] = createTokens({
                phoneNumber: phoneNumber,
                id: user.id
            });
            user.refreshToken = refreshToken;
            await user.save();
            await req.redis.del(`OTP_${phoneNumber}`);
            res.status(201).json({
                message: "saved!",
                data: { accessToken, refreshToken }
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async editProfile(req, res, next) {
        const body = req.body;
        try {
            const user = await User.findOne({ phoneNumber: req.user?.phoneNumber });
            if (!user)
                return next(CustomErrorClass.userNotFound());
            if (body.fullName)
                user.fullName = body.fullName;
            if (body.bankNumber)
                user.bankNumber = body.bankNumber;
            if (body.nationalCode)
                user.nationalCode = body.nationalCode;
            await user.save();
            res.status(201).json({
                message: "user saved!",
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async login(req, res, next) {
        const { phoneNumber, otp, password } = req.query;
        try {
            let user = await User.findOne({ phoneNumber });
            if (!user || !user.password)
                return next(CustomErrorClass.userNotFound());
            if (otp) {
                const existedOtp = await req.redis.get(`OTP_${phoneNumber}`);
                if (!existedOtp)
                    return next(CustomErrorClass.noOtp());
                if (existedOtp !== otp) {
                    await req.redis.del(`OTP_${phoneNumber}`);
                    return next(CustomErrorClass.wrongOtp());
                }
                let accessToken, refreshToken;
                [accessToken, refreshToken] = createTokens({
                    phoneNumber: phoneNumber,
                    id: user.id
                });
                user.refreshToken = refreshToken;
                await user.save();
                await req.redis.del(`OTP_${phoneNumber}`);
                res.json({
                    message: "logged in!",
                    data: { accessToken, refreshToken }
                });
            }
            else if (password) {
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
        }
        catch (e) {
            return next(e);
        }
    }
    static async changePassword(req, res, next) {
        const body = req.body;
        try {
            const user = await User.findOne({ phoneNumber: body.phoneNumber });
            if (!user || !user.password)
                return next(CustomErrorClass.userNotFound());
            const existedOtp = await req.redis.get(`OTP_${body.phoneNumber}`);
            if (!existedOtp)
                return next(CustomErrorClass.noOtp());
            if (existedOtp !== body.otp) {
                await req.redis.del(`OTP_${body.phoneNumber}`);
                return next(CustomErrorClass.wrongOtp());
            }
            user.password = user.password = bcrypt.hashSync(body.password, 10);
            ;
            user.refreshToken = undefined;
            await user.save();
            await req.redis.del(`OTP_${body.phoneNumber}`);
            res.status(201).json({
                message: "password changed!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async preRegisterEmail(req, res, next) {
        const { email } = req.body;
        try {
            let user = await User.findOne({ phoneNumber: req.user?.phoneNumber });
            if (!user || !user.password)
                return next(CustomErrorClass.userNotFound());
            if (user.email)
                return next(CustomErrorClass.emailRegisteredAlready());
            const newOtp = ENV === "production" ? generateRandomNumber(6) : '123456';
            //todo:where is send email service?
            // const sms = ENV === "production" ? await sendSms(phoneNumber as string, newOtp) : { code: 200, msg: "testing" };
            await req.redis.set(`EOTP_${email}`, newOtp, 'EX', process.env.REDIS_EMAIL_TTL || "120");
            res.status(201).json({
                message: "otp sent!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async registerEmail(req, res, next) {
        const { email, otp } = req.body;
        try {
            const existedOtp = await req.redis.get(`EOTP_${email}`);
            if (!existedOtp)
                return next(CustomErrorClass.noOtp());
            if (existedOtp !== otp) {
                await req.redis.del(`EOTP_${email}`);
                return next(CustomErrorClass.wrongOtp());
            }
            let user = await User.findOne({ phoneNumber: req.user?.phoneNumber });
            if (!user)
                return next(CustomErrorClass.userNotFound());
            user.email = email;
            await user.save();
            await req.redis.del(`EOTP_${email}`);
            res.status(201).json({
                message: "email saved!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async registerAddress(req, res, next) {
        const { address, city, longitude, latitude, postCode, state, number, publicMode } = req.body;
        try {
            if (!req.user)
                return next(CustomErrorClass.userNotFound());
            let addressDoc = await Address.findOne({ postCode: postCode, phoneNumber: req.user.phoneNumber });
            if (!addressDoc)
                addressDoc = new Address();
            addressDoc.phoneNumber = req.user.phoneNumber;
            addressDoc.city = city;
            addressDoc.state = state;
            addressDoc.postCode = postCode;
            addressDoc.number = number;
            addressDoc.address = address;
            if (longitude)
                addressDoc.longitude = longitude;
            if (latitude)
                addressDoc.latitude = latitude;
            if (publicMode !== undefined)
                addressDoc.public = publicMode;
            await addressDoc.save();
            res.status(201).json({
                message: "address saved!"
            });
        }
        catch (e) {
            next(e);
        }
    }
    static async deleteAddress(req, res, next) {
        const query = req.query;
        try {
            if (!req.user)
                return next(CustomErrorClass.userNotFound());
            let addressDoc = await Address.findOne({ postCode: query.postCode, phoneNumber: req.user.phoneNumber });
            if (!addressDoc)
                return next(CustomErrorClass.addressNotFound());
            const result = await addressDoc.deleteOne();
            if (!result.acknowledged)
                return next(CustomErrorClass.internalError());
            res.status(200).json({
                message: "address removed!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async getUserAddresses(req, res, next) {
        let { page, postCode } = req.query;
        if (!page)
            page = String(0);
        try {
            const filter = {
                phoneNumber: req.user?.phoneNumber
            };
            if (postCode)
                filter.postCode = postCode;
            const addresses = await Address.find(filter, undefined, { limit: 5, skip: (Number(page) - 1) * 5 });
            res.status(200).json({
                message: "ok",
                data: addresses
            });
        }
        catch (e) {
            next(e);
        }
    }
    static async getUserInfo(req, res, next) {
        try {
            const user = await User.findById(req.user?.id, {
                password: 0,
                refreshToken: 0
            });
            if (!user)
                return next(CustomErrorClass.userNotFound());
            res.status(200).json({
                message: "user info",
                data: user
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async registerStore(req, res, next) {
        const body = req.body;
        try {
            const user = await User.findById(req.user?.id);
            if (!user)
                return next(CustomErrorClass.userNotFound());
            let store = await Store.findOne({ merchantId: req.user?.id });
            if (!store) {
                store = await Store.create({
                    name: body.name,
                    merchantId: req.user?.id,
                    about: body.about,
                    phoneNumber: body.phoneNumber,
                    website: body.website
                });
            }
            else {
                store.name = body.name;
                if (body.about)
                    store.about = body.about;
                if (body.phoneNumber)
                    store.phoneNumber = body.phoneNumber;
                if (body.website)
                    store.website = body.website;
                await store.save();
            }
            res.status(201).json({
                message: "store saved!",
                data: store
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async getStoreInfo(req, res, next) {
        try {
            const store = await Store.findOne({
                merchantId: req.user?.id
            });
            if (!store)
                return next(CustomErrorClass.storeNotFound());
            res.status(200).json({
                message: "store info",
                data: store
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async registerStoreLogo(req, res, next) {
        const form = req.form;
        try {
            const uuid = crypto.randomUUID();
            if (!fsExtra.existsSync(String(process.env.PRODUCT_PHOTO_FOLDER))) {
                fsExtra.mkdirSync(String(process.env.PRODUCT_PHOTO_FOLDER));
            }
            fsExtra.copyFileSync(form.logo[0].filepath, path.join(String(process.env.PRODUCT_PHOTO_FOLDER), uuid));
            await Store.updateOne({
                phoneNumber: form.phoneNumber
            }, {
                logo: path.join(String(process.env.PRODUCT_PHOTO_FOLDER), uuid)
            });
            res.status(201).json({
                message: "logo saved!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async preRegisterNotifPhone(req, res, next) {
        const body = req.body;
        try {
            const user = await User.findById(req.user?.id);
            if (!user)
                return next(CustomErrorClass.userNotFound());
            if (body.phoneNumber === user.phoneNumber)
                return next(CustomErrorClass.duplicateNotifPhone());
            const existedOtp = await req.redis.get(`NOTP_${body.phoneNumber}`);
            if (existedOtp)
                return next(CustomErrorClass.activeOtp());
            const newOtp = ENV === "production" ? generateRandomNumber(6) : '123456';
            //todo:where is sendSMS service?
            // const sms = ENV === "production" ? await sendSms(phoneNumber as string, newOtp) : { code: 200, msg: "testing" };
            await req.redis.set(`NOTP_${body.phoneNumber}`, newOtp, 'EX', process.env.REDIS_TTL || "60");
            res.status(201).json({
                message: "otp sent!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async registerNotifPhone(req, res, next) {
        const body = req.body;
        try {
            let user = await User.findById(req.user?.id);
            if (!user)
                return next(CustomErrorClass.userNotFound());
            const existedOtp = await req.redis.get(`NOTP_${body.phoneNumber}`);
            if (!existedOtp)
                return next(CustomErrorClass.noOtp());
            if (existedOtp !== body.otp) {
                await req.redis.del(`NOTP_${body.phoneNumber}`);
                return next(CustomErrorClass.wrongOtp());
            }
            user.notifPhone = body.phoneNumber;
            await user.save();
            await req.redis.del(`NOTP_${body.phoneNumber}`);
            res.status(201).json({
                message: "saved!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async getWallet(req, res, next) {
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
        }
        catch (e) {
            return next(e);
        }
    }
}
