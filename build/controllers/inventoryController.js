import { CustomErrorClass } from "../utils/customError.js";
import { Product } from "../models/product.model.js";
import { Inventory } from "../models/inventory.model.js";
import { inventoryStatusEnum } from "../enum/inventoryStatus.enum.js";
import { User } from "../models/user.model.js";
import { userStatusEnum } from "../enum/userStatus.enum.js";
import { Store } from "../models/store.model.js";
import { productStatusEnum } from "../enum/productStatus.enum.js";
const ENV = process.env.PRODUCTION;
export default class inventoryController {
    static async addInventory(req, res, next) {
        const body = req.body;
        try {
            const user = await User.findOne({ phoneNumber: req.user?.phoneNumber });
            if (!user)
                return next(CustomErrorClass.userNotFound());
            if (user.status !== userStatusEnum.VERIFIED)
                return next(CustomErrorClass.userNotVerified());
            const store = await Store.findOne({ merchantId: user.id });
            if (!store)
                return next(CustomErrorClass.storeNotFound());
            //todo:check store status
            const product = await Product.findOne({ _id: body.productId, status: productStatusEnum.VERIFIED });
            if (!product)
                return next(CustomErrorClass.productNotFound());
            let inventory = await Inventory.findOne({ productId: body.productId, merchantId: req.user?.id });
            if (!inventory && body.price) {
                inventory = await Inventory.create({
                    merchantId: req.user?.id,
                    productId: body.productId,
                    count: body.count,
                    price: body.price
                });
            }
            else if (!inventory && !body.price) {
                return next(CustomErrorClass.badRequest());
            }
            else if (inventory) {
                if (inventory.status === inventoryStatusEnum.SUSPENDED)
                    return next(CustomErrorClass.inventorySuspended());
                if (body.price)
                    inventory.price = body.price;
                inventory.count = body.count;
                inventory.status = inventoryStatusEnum.ACTIVE;
                await inventory.save();
            }
            res.status(201).json({
                message: "inventory updated!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async getProductInventory(req, res, next) {
        const query = req.query;
        try {
            const product = await Product.findById(query.productId);
            if (!product)
                return next(CustomErrorClass.productNotFound());
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
        }
        catch (e) {
            return next(e);
        }
    }
    static async getMerchantInventory(req, res, next) {
        const query = req.query;
        try {
            const result = await Inventory.find({
                merchantId: req.user?.id
            }, {}, {
                limit: 20,
                skip: query.page ? (query.page - 1) * 20 : 0
            });
            res.status(200).json({
                message: "list of inventories",
                data: result
            });
        }
        catch (e) {
            return next(e);
        }
    }
}
