import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";

export default async (req: Request, res: Response, next: NextFunction) => {
    if (!req.ip?.includes("127.0.0.1") || req.headers["user-agent"] !== "evc") return next(CustomErrorClass.authError());

    next();
}