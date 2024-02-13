import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";
import { addInventoryDtoType, getProductInventoryDtoType } from "../dtos/inventory.dto.js";
import { Product } from "../models/product.model.js";
import { Inventory } from "../models/inventory.model.js";
import { inventoryStatusEnum } from "../enum/inventoryStatus.enum.js";

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
                if (inventory.status === inventoryStatusEnum.SUSPENDED) return next(CustomErrorClass.inventorySuspended());
                inventory.price = body.price;
                inventory.count = body.count;
                inventory.status = inventoryStatusEnum.ACTIVE
                await inventory.save();
            }

            res.status(201).json({
                message: "inventory updated!"
            });
        } catch (e) {
            return next(e);
        }
    }

    static async getProductInventory(req: Request, res: Response, next: NextFunction) {     //*this will return all active inventories of a product
        const query = req.query as getProductInventoryDtoType;

        try {
            const product = await Product.findById(query.productId);

            if (!product) return next(CustomErrorClass.productNotFound());

            const result = await Inventory.find({
                productId: query.productId,
                status: inventoryStatusEnum.ACTIVE
            }, {}, {
                limit: 20,
                skip: query.page ? (query.page - 1) * 20 : 0
            });

            res.status(200).json({
                message: "list of inventories",
                data: result
            });
        } catch (e) {
            return next(e)
        }
    }
}