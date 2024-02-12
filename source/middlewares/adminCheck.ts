import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";

export default async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) return next(CustomErrorClass.authError());

    next();
}
