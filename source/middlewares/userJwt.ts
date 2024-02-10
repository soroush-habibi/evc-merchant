import { NextFunction, Request, Response } from "express";
import JWT, { JwtPayload } from 'jsonwebtoken';
import { CustomErrorClass } from "../utils/customError.js";
import { User } from "../models/user.model.js";

export default async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const tokenType = authHeader ? authHeader.split(" ")[0] : "";
    const tokenValue = authHeader ? authHeader.split(" ")[1] : "";
    if (!authHeader || tokenType !== "Bearer") return next(CustomErrorClass.authError());

    let data;
    try {
        data = JWT.verify(tokenValue, process.env.JWT_SECRET!);
    } catch (e) {
        return next(CustomErrorClass.authError());
    }

    const existedUser = await User.findOne({ phoneNumber: (data as JwtPayload).payload.phoneNumber });
    if (!existedUser?.refreshToken) return next(CustomErrorClass.authError());

    req.user = {
        phoneNumber: (data as JwtPayload).payload.phoneNumber,
        id: (data as JwtPayload).payload.id
    }

    next();
}