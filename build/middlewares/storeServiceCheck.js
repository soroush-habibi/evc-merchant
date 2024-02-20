import { CustomErrorClass } from "../utils/customError.js";
export default async (req, res, next) => {
    if (!req.ip?.includes("127.0.0.1") || req.headers["user-agent"] !== "store")
        return next(CustomErrorClass.authError());
    next();
};
