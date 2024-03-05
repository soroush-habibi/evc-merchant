import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";
import { addToCartDtoType, confirmCallbackDtoType, confirmOrderDtoType, getCartsDtoType, getUserOrderDtoType, getUserOrdersDtoType } from "../dtos/order.dto.js";
import { Inventory } from "../models/inventory.model.js";
import { Order } from "../models/order.model.js";
import { orderStatusEnum } from "../enum/orderStatus.enum.js";
import { inventoryStatusEnum } from "../enum/inventoryStatus.enum.js";
import { Payment } from "../models/payment.model.js";
import { paymentTypeEnum } from "../enum/payment.enum.js";
import crypto from "crypto";
import { Wallet } from "../models/wallet.model.js";
import mongoose from "mongoose";
import { OrderLog } from "../models/orderLog.model.js";
import { Product } from "../models/product.model.js";

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

        let session;

        try {
            session = await mongoose.startSession();
            session.startTransaction();
        } catch (e) {
            return next(e);
        }

        try {
            if (!ENV) {
                const ordersAggregate = await Order.aggregate([
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(body.orderId),
                            status: orderStatusEnum.CART,
                            userId: new mongoose.Types.ObjectId(body.userId)
                        }
                    },
                    {
                        $unwind: '$items'
                    },
                    {
                        $lookup: {
                            from: 'inventories',
                            localField: 'items.inventoryId',
                            foreignField: '_id',
                            as: 'inventory'
                        }
                    },
                    {
                        $unwind: '$inventory'
                    },
                    {
                        $set: {
                            totalPrice: {
                                $multiply: ['$inventory.price', '$items.count']
                            }
                        }
                    }
                ], { session });
                if (ordersAggregate.length === 0) throw CustomErrorClass.orderNotFound();
                let amount = 0;
                for (let o of ordersAggregate) {
                    amount += o.totalPrice;
                    await Inventory.updateOne({
                        _id: o.items.inventoryId
                    }, {
                        $inc: {
                            count: -(o.items.count)
                        }
                    }, { session });
                }
                const transData = {
                    timestamp: Date.now(),
                    token: crypto.randomUUID(),
                    amount: amount
                }

                await Order.updateOne({
                    _id: body.orderId
                }, {
                    $set: {
                        status: orderStatusEnum.PAYMENT
                    }
                }, { session });

                const payment = new Payment({
                    userId: body.userId,
                    type: paymentTypeEnum.ORDER,
                    exId: body.orderId,
                    timestamp: transData.timestamp,
                    amount: amount,
                    token: transData.token
                });

                await payment.save({ session });

                const log = new OrderLog({
                    orderId: body.orderId,
                    from: orderStatusEnum.CART,
                    to: orderStatusEnum.PAYMENT
                });

                await log.save({ session });

                await session.commitTransaction();

                res.status(201).json({
                    message: "payment created!",
                    data: transData
                });
            } else {
                //todo:i need payment api
            }
        } catch (e) {
            await session.abortTransaction();
            return next(e);
        }
    }

    static async confirmCallback(req: Request, res: Response, next: NextFunction) {
        const query = req.query as confirmCallbackDtoType;

        let session;

        try {
            session = await mongoose.startSession();
            session.startTransaction();
        } catch (e) {
            return next(e);
        }

        try {
            const payment = await Payment.findOne({
                timestamp: Number(query.timestamp)
            });

            if (!payment) return next(CustomErrorClass.paymentNotFound());

            if (payment.token !== query.token || payment.done || payment.type !== paymentTypeEnum.ORDER) return next(CustomErrorClass.badRequest());

            payment.done = true;
            await payment.save({ session });
            const order = await Order.findOne({ _id: payment.exId });
            if (!order) throw CustomErrorClass.badRequest();
            order.status = orderStatusEnum.PROCESSING;
            await order.save({ session });
            let wallet = await Wallet.findOne({
                userId: order.merchantId
            });

            if (!wallet) {
                wallet = new Wallet({
                    userId: order.merchantId
                });
            }

            wallet.pending = payment.amount;
            await wallet.save({ session });

            for (let i of order.items) {
                const inventory = await Inventory.findById(i.inventoryId);
                const product = await Product.findById(inventory?.productId);

                if (product)
                    product.sales += 1;

                await product?.save({ session });
            }

            const log = new OrderLog({
                orderId: payment.exId,
                from: orderStatusEnum.PAYMENT,
                to: orderStatusEnum.PROCESSING
            });

            await log.save({ session });

            await session.commitTransaction();

            res.status(201).json({
                message: "payment saved!",
                data: {
                    orderId: payment.exId
                }
            });
        } catch (e) {
            await session.abortTransaction();
            return next(e);
        }
    }

    static async getUserOrder(req: Request, res: Response, next: NextFunction) {
        const params = req.params as getUserOrderDtoType;

        try {
            const order = await Order.findOne({ _id: params.orderId, userId: params.userId });
            if (!order) return next(CustomErrorClass.orderNotFound());

            res.status(200).json({
                message: "order data",
                data: order
            });
        } catch (e) {
            return next(e);
        }
    }

    static async getUserOrders(req: Request, res: Response, next: NextFunction) {
        const query = req.query as getUserOrdersDtoType;

        try {
            const orders = await Order.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(query.userId)
                    }
                },
                {
                    $limit: 10
                },
                {
                    $skip: query.page ? (query.page - 1) * 10 : 0
                },
                {
                    $sort: {
                        updatedAt: -1
                    }
                }
            ]);

            res.status(200).json({
                message: "orders",
                data: orders
            });
        } catch (e) {
            return next(e);
        }
    }
}