import { CustomErrorClass } from "../utils/customError.js";
export default async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.ADMIN_API_KEY)
        return next(CustomErrorClass.authError());
    next();
};
