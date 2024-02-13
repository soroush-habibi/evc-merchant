import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";
import { addInventoryDtoType } from "../dtos/inventory.dto.js";
import { Product } from "../models/product.model.js";
import { Inventory } from "../models/inventory.model.js";

const ENV = process.env.PRODUCTION

export default class inventoryController {
    static async addInventory(req: Request, res: Response, next: NextFunction) {
        const body = req.body as addInventoryDtoType;

        try {
            const product = await Product.findById(body.productId);

            if (!product) return next(CustomErrorClass.productNotFound());

            let inventory = await Inventory.findOne({ productId: body.productId, merchantId: req.user?.id });

            if (!inventory) {
                inventory = await Inventory.create({
                    merchantId: req.user?.id,
                    productId: body.productId,
                    count: body.count,
                    price: body.price
                });
            } else {
                inventory.price = body.price;
                inventory.count = body.count;
                await inventory.save();
            }

            res.status(201).json({
                message: "inventory updated!"
            });
        } catch (e) {
            next(e);
        }
    }

    static async getProductInventory(req: Request, res: Response, next: NextFunction) {

    }
}