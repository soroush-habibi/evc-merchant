import JWT from "jsonwebtoken";
export function generateRandomNumber(length) {
    const len = +length;
    const numberList = [..."0123456789"];
    const numberListLength = numberList.length;
    let otp = '';
    for (let i = 0; i < len; i++) {
        const randomNumber = numberList[Math.floor(Math.random() * numberListLength)];
        otp += randomNumber;
    }
    return otp;
}
export function createTokens(payload, opt = {}) {
    const accessSecret = opt.accessSecret || process.env.JWT_SECRET;
    const accessExpire = opt.accessExpire || +process.env.ACCESS_TOKEN_EXPIRATION || 3600;
    const refreshSecret = opt.refreshSecret || process.env.JWT_REFRESH_SECRET;
    const refreshExpire = opt.refreshExpire || +process.env.REFRESH_TOKEN_EXPIRATION || 7200;
    const accessToken = JWT.sign({
        payload,
        exp: Math.floor(Date.now() / 1000) + accessExpire
    }, accessSecret);
    const refreshToken = JWT.sign({
        payload,
        exp: Math.floor(Date.now() / 1000) + refreshExpire
    }, refreshSecret);
    return [accessToken, refreshToken];
}
