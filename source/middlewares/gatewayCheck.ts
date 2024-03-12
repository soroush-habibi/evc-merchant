import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";
import { User } from "../models/user.model.js";
import { userStatusEnum } from "../enum/userStatus.enum.js";
import { Store } from "../models/store.model.js";
import { storeStatusEnum } from "../enum/storeStatus.enum.js";

export default async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    const merchantId = req.headers['x-merchant-id'];

    if (!apiKey || !merchantId) return next(CustomErrorClass.authError());

    const user = await User.findOne({
        _id: merchantId,
        apiKey: apiKey
    });

    if (!user || apiKey !== user.apiKey) return next(CustomErrorClass.authError());
    if (user.status !== userStatusEnum.VERIFIED) return next(CustomErrorClass.userNotVerified());

    const store = await Store.findOne({
        merchantId: merchantId
    });

    if (!store) return next(CustomErrorClass.storeNotFound());
    if (store.status !== storeStatusEnum.VERIFIED) return next(CustomErrorClass.storeNotVerified());

    next();
}
