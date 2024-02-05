import JWT from 'jsonwebtoken';
import { CustomErrorClass } from "source/utils/customError.js";
import { User } from "../models/user.model.js";
export default async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const tokenType = authHeader ? authHeader.split(" ")[0] : "";
    const tokenValue = authHeader ? authHeader.split(" ")[1] : "";
    if (!authHeader || tokenType !== "Bearer")
        return next(CustomErrorClass.authError());
    const data = JWT.verify(tokenValue, process.env.JWT_SECRET);
    const existedUser = await User.findOne(data.payload.phoneNumber);
    if (!existedUser?.refreshToken)
        return next(CustomErrorClass.authError());
    req.user = {
        phoneNumber: data.payload.phoneNumber
    };
    next();
};
