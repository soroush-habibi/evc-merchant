import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";
import { addToCartDtoType, confirmOrderDtoType, getCartsDtoType } from "../dtos/order.dto.js";
import { Inventory } from "../models/inventory.model.js";
import { Order } from "../models/order.model.js";
import { orderStatusEnum } from "../enum/orderStatus.enum.js";
import { inventoryStatusEnum } from "../enum/inventoryStatus.enum.js";

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
            if (ENV) {

            } else {

            }
        } catch (e) {
            return next(e);
        }
    }
}