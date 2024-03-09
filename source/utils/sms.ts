import axios from "axios";

export async function sendSms(to: string, message: string) {
    if (!process.env.OTP_URL || !process.env.OTP_USERNAME || !process.env.OTP_PASSWORD) return false;
    const result = await axios.post(process.env.OTP_URL, {
        data: {
            username: process.env.OTP_USERNAME,
            password: process.env.OTP_PASSWORD,
            to: to,
            msg: message
        }
    });

    return result;
}