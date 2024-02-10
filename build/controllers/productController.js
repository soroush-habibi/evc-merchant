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
                    if (!fsExtra.existsSync(String(process.env.PRODUCT_PHOTO_FOLDER))) {
                        fsExtra.mkdirSync(String(process.env.PRODUCT_PHOTO_FOLDER));
                    }
                    fsExtra.copyFileSync(form.photo[p].filepath, path.join(String(process.env.PRODUCT_PHOTO_FOLDER), crypto.randomUUID()));
                    photo.push(path.join(String(process.env.PRODUCT_PHOTO_FOLDER), crypto.randomUUID()));
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
}
