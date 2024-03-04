import { CustomErrorClass } from "../utils/customError.js";
import { Product } from "../models/product.model.js";
import fsExtra from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import { productStatusEnum } from "../enum/productStatus.enum.js";
import { User } from "../models/user.model.js";
import { userStatusEnum } from "../enum/userStatus.enum.js";
import { Store } from "../models/store.model.js";
import { Category } from "../models/category.model.js";
import { storeStatusEnum } from "../enum/storeStatus.enum.js";
const ENV = process.env.PRODUCTION;
export default class productController {
    static async addProduct(req, res, next) {
        const form = req.form;
        try {
            const user = await User.findOne({ phoneNumber: req.user?.phoneNumber });
            if (!user)
                return next(CustomErrorClass.userNotFound());
            if (user.status !== userStatusEnum.VERIFIED)
                return next(CustomErrorClass.userNotVerified());
            const store = await Store.findOne({ merchantId: user.id });
            if (!store)
                return next(CustomErrorClass.storeNotFound());
            if (store.status !== storeStatusEnum.VERIFIED)
                return next(CustomErrorClass.storeNotVerified());
            let photo = [];
            if (form.photo)
                for (let p = 0; p < form.photo.length; p++) {
                    const uuid = crypto.randomUUID();
                    if (!fsExtra.existsSync(String(process.env.PRODUCT_PHOTO_FOLDER))) {
                        fsExtra.mkdirSync(String(process.env.PRODUCT_PHOTO_FOLDER));
                    }
                    fsExtra.copyFileSync(form.photo[p].filepath, path.join(String(process.env.PRODUCT_PHOTO_FOLDER), uuid));
                    photo.push(path.join(String(process.env.PRODUCT_PHOTO_FOLDER), uuid));
                }
            const product = new Product({
                creator: req.user?.id,
                category: form.category,
                sub: form.sub,
                original: form.original,
                size: form.size,
                title: form.title,
                weight: form.weight,
                addData: form.addData,
                photo: form.photo ? [...photo] : undefined
            });
            await product.save();
            res.status(201).json({
                message: "product saved!",
                data: {
                    id: product.id
                }
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async deletePhoto(req, res, next) {
        const body = req.body;
        try {
            const product = await Product.findOne({ _id: body.productId, creator: req.user?.id });
            if (!product)
                return next(CustomErrorClass.productNotFound());
            if (!product.photo?.includes(path.join(String(process.env.PRODUCT_PHOTO_FOLDER), body.uuid)))
                return next(CustomErrorClass.productPhotoNotFound());
            await product.updateOne({ $pull: { photo: path.join(String(process.env.PRODUCT_PHOTO_FOLDER), body.uuid) } });
            fsExtra.removeSync(path.join(String(process.env.PRODUCT_PHOTO_FOLDER), body.uuid));
            res.status(201).json({
                message: "photo removed!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async addPhoto(req, res, next) {
        const body = req.form;
        try {
            const product = await Product.findOne({ _id: body.productId, creator: req.user?.id });
            if (!product)
                return next(CustomErrorClass.productNotFound());
            if ((product.photo ? product.photo.length : 0) + body.photo.length > 20)
                return next(CustomErrorClass.productMaxPhoto());
            for (let p = 0; p < body.photo.length; p++) {
                const uuid = crypto.randomUUID();
                if (!fsExtra.existsSync(String(process.env.PRODUCT_PHOTO_FOLDER))) {
                    fsExtra.mkdirSync(String(process.env.PRODUCT_PHOTO_FOLDER));
                }
                fsExtra.copyFileSync(body.photo[p].filepath, path.join(String(process.env.PRODUCT_PHOTO_FOLDER), uuid));
                await product.updateOne({ $push: { photo: path.join(String(process.env.PRODUCT_PHOTO_FOLDER), uuid) } });
            }
            res.status(201).json({
                message: "product updated!"
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async getMerchantProducts(req, res, next) {
        const query = req.query;
        if (!query.mode)
            query.mode = 1;
        try {
            const filter = {
                title: {
                    $regex: query.title ? new RegExp(query.title, "i") : ""
                }
            };
            if (query.category)
                filter.category = query.category;
            if (query.sub)
                filter.sub = query.sub;
            if (query.category && query.sub) {
                const category = await Category.findOne({
                    category: query.category,
                    sub: query.sub
                });
                if (!category)
                    return next(CustomErrorClass.categoryNotFound());
            }
            if (query.mode == 1) {
                filter.creator = req.user?.id;
            }
            else if (query.mode == 2) {
                filter.status = productStatusEnum.VERIFIED;
            }
            const results = await Product.find(filter, {}, { limit: 20, skip: query.page ? (query.page - 1) * 20 : 0 });
            res.status(200).json({
                message: "user products list",
                data: results
            });
        }
        catch (e) {
            return next(e);
        }
    }
}
