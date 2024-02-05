import { NextFunction, Request, Response } from "express";
import JWT, { JwtPayload } from 'jsonwebtoken';
import { CustomErrorClass } from "source/utils/customError.js";
import { User } from "../models/user.model.js";

export default async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const tokenType = authHeader ? authHeader.split(" ")[0] : "";
    const tokenValue = authHeader ? authHeader.split(" ")[1] : "";
    if (!authHeader || tokenType !== "Bearer") return next(CustomErrorClass.authError());

    const data = JWT.verify(tokenValue, process.env.JWT_SECRET!);

    const existedUser = await User.findOne((data as JwtPayload).payload.phoneNumber);
    if (!existedUser?.refreshToken) return next(CustomErrorClass.authError());

    req.user = {
        phoneNumber: (data as JwtPayload).payload.phoneNumber
    }

    next();
}