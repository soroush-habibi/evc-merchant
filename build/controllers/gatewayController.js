import { CustomErrorClass } from "../utils/customError.js";
import { User } from "../models/user.model.js";
import { Gateway } from "../models/gateway.model.js";
import { userStatusEnum } from "../enum/userStatus.enum.js";
import { Store } from "../models/store.model.js";
import { storeStatusEnum } from "../enum/storeStatus.enum.js";
import { gatewayStatusEnum } from "../enum/gatewayStatus.enum.js";
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
    static async getGateway(req, res, next) {
        const query = req.query;
        try {
            const gateway = await Gateway.findById(query.gatewayId).select(["-createdAt", "-updatedAt"]);
            if (!gateway)
                return next(CustomErrorClass.gatewayNotFound());
            const merchant = await User.findById(gateway.merchantId);
            if (!merchant)
                return next(CustomErrorClass.userNotFound());
            if (merchant.status !== userStatusEnum.VERIFIED)
                return next(CustomErrorClass.userNotVerified());
            const store = await Store.findOne({ merchantId: merchant.id }).select(["-createdAt", "-updatedAt"]);
            ;
            if (!store)
                return next(CustomErrorClass.storeNotFound());
            if (store.status !== storeStatusEnum.VERIFIED)
                return next(CustomErrorClass.storeNotVerified());
            res.status(200).json({
                message: "gateway",
                data: { gateway, store }
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async startPayment(req, res, next) {
        const body = req.body;
        try {
            const gateway = await Gateway.findById(body.gatewayId);
            if (!gateway)
                return next(CustomErrorClass.gatewayNotFound());
            if (gateway.status !== gatewayStatusEnum.INIT)
                return next(CustomErrorClass.gatewayFinished());
            await Gateway.updateOne({
                _id: body.gatewayId
            }, {
                paymentId: body.paymentId,
                status: gatewayStatusEnum.PAYMENT
            });
            res.status(201).json({
                message: "payment started"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async verifyPayment(req, res, next) {
        const body = req.body;
        try {
            const gateway = await Gateway.findById(body.gatewayId);
            if (!gateway)
                return next(CustomErrorClass.gatewayNotFound());
            if (gateway.status !== gatewayStatusEnum.PAYMENT)
                return next(CustomErrorClass.gatewayPaymentNotFound());
            await Gateway.updateOne({
                _id: body.gatewayId
            }, {
                status: body.status
            });
            res.status(201).json({
                message: "payment updated"
            });
        }
        catch (e) {
            return next(e);
        }
    }
}
