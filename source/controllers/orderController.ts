import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";
import { addToCartDtoType } from "../dtos/order.dto.js";
import { Inventory } from "../models/inventory.model.js";
import { Order } from "../models/order.model.js";
import { orderStatusEnum } from "../enum/orderStatus.enum.js";

const ENV = process.env.PRODUCTION

export default class orderController {
    static async addToCart(req: Request, res: Response, next: NextFunction) {
        const body = req.body as addToCartDtoType;

        try {
            const inventory = await Inventory.findById(body.inventoryId);

            if (!inventory) return next(CustomErrorClass.inventoryNotFound());

            if (inventory.count < body.count) return next(CustomErrorClass.insufficientInventory());

            const existingCart = await Order.findOne({
                userId: body.userId,
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
}