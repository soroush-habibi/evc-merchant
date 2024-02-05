import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";
import { redis } from "../utils/redis.js";
import { createTokens, generateRandomNumber } from "../utils/generators.js";
import { CustomErrorClass } from "../utils/customError.js";
import { registerDtoType, preRegisterDtoType } from "../dtos/auth.dto.js";
import bcrypt from 'bcrypt';

const ENV = process.env.PRODUCTION

export default class authController {
    static async preRegister(req: Request, res: Response, next: NextFunction) {
        const { phoneNumber } = req.body as preRegisterDtoType;

        let user = await User.findOne({ phoneNumber });
        if (!user) user = await User.create({ phoneNumber });

        const existedOtp = await redis.get(`OTP_${phoneNumber as string}`);
        if (existedOtp) return next(CustomErrorClass.activeOtp());

        const newOtp = ENV === "production" ? generateRandomNumber(6) : '123456';
        //todo:where is sendSMS service?
        // const sms = ENV === "production" ? await sendSms(phoneNumber as string, newOtp) : { code: 200, msg: "testing" };

        await redis.set(`OTP_${phoneNumber as string}`, newOtp, 'EX', process.env.REDIS_TTL || "60");

        res.json({
            message: "otp sent!"
        });
    }

    static async register(req: Request, res: Response, next: NextFunction) {
        const { phoneNumber, otp, fullName, password } = req.body as registerDtoType;
        let accessToken, refreshToken;

        try {
            let user = await User.findOne({ phoneNumber });
            if (!user) return next(CustomErrorClass.userNotFound());

            const existedOtp = await redis.get(`OTP_${phoneNumber as string}`);
            if (!existedOtp) return next(CustomErrorClass.noOtp());

            if (existedOtp !== otp) {
                await redis.del(`OTP_${phoneNumber as string}`);
                return next(CustomErrorClass.wrongOtp());
            }

            user.fullName = fullName;
            user.password = bcrypt.hashSync(password, 10);
            [accessToken, refreshToken] = createTokens({
                phoneNumber: phoneNumber
            });
            user.refreshToken = refreshToken;
            await user.save();
            await redis.del(`OTP_${phoneNumber as string}`);

            res.json({
                message: "saved!",
                data: refreshToken
            });
        } catch (e) {
            return next(e);
        }
    }
}