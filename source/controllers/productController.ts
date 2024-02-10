import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";
import { addProductDtoType } from "../dtos/product.dto.js";
import { Product } from "../models/product.model.js";
import fsExtra from 'fs-extra';
import path from 'path';
import crypto from 'crypto';

const ENV = process.env.PRODUCTION

export default class productController {
    static async addProduct(req: Request, res: Response, next: NextFunction) {
        const form = req.form as addProductDtoType;

        try {
            let photo: string[] = [];
            if (form.photo)
                for (let p = 0; p < form.photo.length; p++) {
                    if (!fsExtra.existsSync(String(process.env.PRODUCT_PHOTO_FOLDER))) {
                        fsExtra.mkdirSync(String(process.env.PRODUCT_PHOTO_FOLDER));
                    }
                    fsExtra.copyFileSync((form.photo[p] as any).filepath, path.join(String(process.env.PRODUCT_PHOTO_FOLDER), crypto.randomUUID()));
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
            })
        } catch (e) {
            return next(e);
        }
    }
}