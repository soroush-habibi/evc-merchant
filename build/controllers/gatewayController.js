import { CustomErrorClass } from "../utils/customError.js";
import { User } from "../models/user.model.js";
import { Gateway } from "../models/gateway.model.js";
export default class gatewayController {
    static async createGateway(req, res, next) {
        const body = req.body;
        const merchantId = req.headers['x-merchant-id'];
        try {
            const user = await User.findById(merchantId);
            if (!user)
                return next(CustomErrorClass.userNotFound());
            const gateway = new Gateway({
                merchantId: merchantId,
                amount: body.amount,
                callback: body.callback ? body.callback : undefined,
                timestamp: Date.now()
            });
            await gateway.save();
            res.status(201).json({
                message: "gateway created!",
                data: `https://evipclub.org/payment/${gateway.id}`
            });
        }
        catch (e) {
            return next(e);
        }
    }
}
