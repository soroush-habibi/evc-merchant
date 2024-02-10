import { CustomErrorClass } from "../utils/customError.js";
import { Product } from "../models/product.model.js";
import fsExtra from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
const ENV = process.env.PRODUCTION;
export default class productController {
    static async addProduct(req, res, next) {
        const form = req.form;
        try {
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
                original: form.original,
                size: form.size,
                title: form.title,
                verified: false,
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
            const product = await Product.findById(body.productId);
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
}
