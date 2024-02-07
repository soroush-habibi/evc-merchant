import { User } from "../models/user.model.js";
import { redis } from "../utils/redis.js";
import { createTokens, generateRandomNumber } from "../utils/generators.js";
import { CustomErrorClass } from "../utils/customError.js";
import bcrypt from 'bcrypt';
const ENV = process.env.PRODUCTION;
export default class authController {
    static async preRegister(req, res, next) {
        const { phoneNumber } = req.body;
        try {
            let user = await User.findOne({ phoneNumber });
            if (!user)
                user = await User.create({ phoneNumber });
            const existedOtp = await redis.get(`OTP_${phoneNumber}`);
            if (existedOtp)
                return next(CustomErrorClass.activeOtp());
            const newOtp = ENV === "production" ? generateRandomNumber(6) : '123456';
            //todo:where is sendSMS service?
            // const sms = ENV === "production" ? await sendSms(phoneNumber as string, newOtp) : { code: 200, msg: "testing" };
            await redis.set(`OTP_${phoneNumber}`, newOtp, 'EX', process.env.REDIS_TTL || "60");
            res.status(201).json({
                message: "otp sent!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async register(req, res, next) {
        const { phoneNumber, otp, fullName, password } = req.body;
        let accessToken, refreshToken;
        try {
            let user = await User.findOne({ phoneNumber });
            if (!user)
                return next(CustomErrorClass.userNotFound());
            if (user.password)
                return next(CustomErrorClass.alreadyRegistered());
            const existedOtp = await redis.get(`OTP_${phoneNumber}`);
            if (!existedOtp)
                return next(CustomErrorClass.noOtp());
            if (existedOtp !== otp) {
                await redis.del(`OTP_${phoneNumber}`);
                return next(CustomErrorClass.wrongOtp());
            }
            user.fullName = fullName;
            user.password = bcrypt.hashSync(password, 10);
            [accessToken, refreshToken] = createTokens({
                phoneNumber: phoneNumber
            });
            user.refreshToken = refreshToken;
            await user.save();
            await redis.del(`OTP_${phoneNumber}`);
            res.status(201).json({
                message: "saved!",
                data: { accessToken, refreshToken }
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
                const existedOtp = await redis.get(`OTP_${phoneNumber}`);
                if (!existedOtp)
                    return next(CustomErrorClass.noOtp());
                if (existedOtp !== otp) {
                    await redis.del(`OTP_${phoneNumber}`);
                    return next(CustomErrorClass.wrongOtp());
                }
                let accessToken, refreshToken;
                [accessToken, refreshToken] = createTokens({
                    phoneNumber: phoneNumber
                });
                user.refreshToken = refreshToken;
                await user.save();
                await redis.del(`OTP_${phoneNumber}`);
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
                    phoneNumber: phoneNumber
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
    static async preRegisterEmail(req, res, next) {
        const { email } = req.body;
        try {
            const newOtp = ENV === "production" ? generateRandomNumber(6) : '123456';
            //todo:where is send email service?
            // const sms = ENV === "production" ? await sendSms(phoneNumber as string, newOtp) : { code: 200, msg: "testing" };
            await redis.set(`EOTP_${email}`, newOtp, 'EX', process.env.REDIS_EMAIL_TTL || "120");
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
            const existedOtp = await redis.get(`EOTP_${email}`);
            if (!existedOtp)
                return next(CustomErrorClass.noOtp());
            if (existedOtp !== otp) {
                await redis.del(`EOTP_${email}`);
                return next(CustomErrorClass.wrongOtp());
            }
            let user = await User.findOne({ phoneNumber: req.user?.phoneNumber });
            if (!user)
                return next(CustomErrorClass.userNotFound());
            user.email = email;
            await user.save();
            await redis.del(`EOTP_${email}`);
            res.status(201).json({
                message: "email saved!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
}
