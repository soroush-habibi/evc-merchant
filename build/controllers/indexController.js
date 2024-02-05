import { User } from "../models/user.model.js";
import { redis } from "../utils/redis.js";
import { generateRandomNumber } from "../utils/generators.js";
import { CustomErrorClass } from "../utils/customError.js";
const ENV = process.env.PRODUCTION;
export default class indexController {
    static async preRegister(req, res, next) {
        const { phoneNumber } = req.body;
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
        res.json({
            response: "otp sent!"
        });
    }
}
