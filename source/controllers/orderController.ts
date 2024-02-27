import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";
import { addToCartDtoType, confirmCallbackDtoType, confirmOrderDtoType, getCartsDtoType } from "../dtos/order.dto.js";
import { Inventory } from "../models/inventory.model.js";
import { Order } from "../models/order.model.js";
import { orderStatusEnum } from "../enum/orderStatus.enum.js";
import { inventoryStatusEnum } from "../enum/inventoryStatus.enum.js";
import { Payment } from "../models/payment.model.js";
import { paymentTypeEnum } from "../enum/payment.enum.js";
import crypto from "crypto";

const ENV = process.env.PRODUCTION

export default class orderController {
    static async addToCart(req: Request, res: Response, next: NextFunction) {
        const body = req.body as addToCartDtoType;

        try {
            const inventory = await Inventory.findOne({ _id: body.inventoryId, status: inventoryStatusEnum.ACTIVE });

            if (!inventory) return next(CustomErrorClass.inventoryNotFound());

            if (inventory.count < body.count) return next(CustomErrorClass.insufficientInventory());

            const existingCart = await Order.findOne({
                userId: body.userId,
                merchantId: inventory.merchantId,
                status: orderStatusEnum.CART
            });

            if (existingCart) {
                if (body.count === 0) {
                    existingCart.items = existingCart.items.filter((value) => {
                        if (value.inventoryId.toString() === body.inventoryId.toString()) {
                            return false;
                        } else {
                            return true;
                        }
                    })
                } else {
                    let flag = true;
                    existingCart.items.map((value) => {
                        if (value.inventoryId.toString() === body.inventoryId.toString()) {
                            value.count = body.count;
                            flag = false;
                            return value;
                        } else {
                            return value
                        }
                    });

                    if (flag) {
                        existingCart.items.push({
                            inventoryId: body.inventoryId,
                            count: body.count
                        });
                    }
                }

                await existingCart.save();

                res.status(201).json({
                    message: "added to cart"
                });
            } else if (!existingCart && body.count > 0) {
                await Order.create({
                    userId: body.userId,
                    merchantId: inventory.merchantId,
                    items: [{
                        inventoryId: body.inventoryId,
                        count: body.count
                    }]
                });

                res.status(201).json({
                    message: "added to cart"
                });
            } else {
                return next(CustomErrorClass.badRequest());
            }
        } catch (e) {
            return next(e);
        }
    }

    static async getCarts(req: Request, res: Response, next: NextFunction) {
        const query = req.query as getCartsDtoType;

        try {
            const carts = await Order.find({
                userId: query.userId,
                status: orderStatusEnum.CART
            });

            if (!carts) return res.status(200).json({
                message: "cart:",
                data: []
            });

            for (let cart of carts) {
                for (let i = 0; i < cart.items.length; i++) {
                    const inventory = await Inventory.findById(cart.items[i].inventoryId);

                    if (!inventory || inventory.status !== inventoryStatusEnum.ACTIVE) {
                        cart.items.splice(i, 1);
                    } else if (inventory.count < cart.items[i].count) {
                        cart.items[i].count = inventory.count;
                    }
                }

                await cart.save()
            }

            res.status(200).json({
                message: "carts:",
                data: carts
            });
        } catch (e) {
            return next(e);
        }
    }

    static async confirmOrder(req: Request, res: Response, next: NextFunction) {
        const body = req.body as confirmOrderDtoType;

        try {
            if (!ENV) {
                //todo:these queries should be ACID transaction
                const transData = {
                    timestamp: Date.now(),
                    token: crypto.randomUUID()
                }
                const payment = await Payment.create({
                    userId: body.userId,
                    type: paymentTypeEnum.ORDER,
                    exId: body.orderId,
                    timestamp: transData.timestamp,
                    token: transData.token
                });

                await Order.updateOne({
                    _id: body.orderId
                }, {
                    $set: {
                        status: orderStatusEnum.PAYMENT
                    }
                });

                res.status(201).json({
                    message: "payment created!",
                    data: transData
                });
            } else {
                //todo:i need payment api
            }
        } catch (e) {
            return next(e);
        }
    }

    static async confirmCallback(req: Request, res: Response, next: NextFunction) {
        const query = req.query as confirmCallbackDtoType;

        try {
            const payment = await Payment.findOne({
                timestamp: Number(query.timestamp)
            });

            if (!payment) return next(CustomErrorClass.paymentNotFound());

            if (payment.token !== query.token || payment.done || payment.type !== paymentTypeEnum.ORDER) return next(CustomErrorClass.badRequest());

            //todo:ACID transaction
            payment.done = true;
            await payment.save();
            await Order.updateOne({ _id: payment.exId }, { status: orderStatusEnum.PROCESSING });

            res.status(201).json({
                message: "payment saved!",
                data: {
                    orderId: payment.exId
                }
            });
        } catch (e) {
            return next(e);
        }
    }
}