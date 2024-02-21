import { NextFunction, Request, Response } from "express";
import { getProductDtoType, searchProductDtoType } from "../dtos/store.dto.js";
import { Product } from "../models/product.model.js";
import { productOrderEnum } from "../enum/productOrder.enum.js";
import { CustomErrorClass } from "../utils/customError.js";
import { productStatusEnum } from "../enum/productStatus.enum.js";
import { Inventory } from "../models/inventory.model.js";
import { inventoryStatusEnum } from "../enum/inventoryStatus.enum.js";

export default class storeController {
    static async searchProduct(req: Request, res: Response, next: NextFunction) {
        const query = req.query as searchProductDtoType;

        try {
            const filter: any = {
                category: query.category
            }

            let sort: any;

            if (query.text) filter.$text = { $search: query.text }

            if (query.order === productOrderEnum.RELATED) {
                if (!query.text) return next(CustomErrorClass.badRequest());
                sort = { score: { $meta: "textScore" } }
            } else if (query.order === productOrderEnum.BEST_SELLER) {
                sort = { score: { $meta: "textScore" } }                //todo:change needed
            } else if (query.order === productOrderEnum.CHEAP) {
                const cheapestProducts = await Product.aggregate([
                    {
                        $match: {
                            $and: [
                                filter
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: 'inventories',
                            localField: '_id',
                            foreignField: 'productId',
                            as: 'inventory'
                        }
                    },
                    {
                        $unwind: '$inventory'
                    },
                    {
                        $group: {
                            _id: '$_id',
                            product: { $first: '$$ROOT' },
                            minPrice: { $min: '$inventory.price' }
                        }
                    },
                    {
                        $sort: { minPrice: 1 }
                    },
                    {
                        $limit: 50
                    },
                    {
                        $skip: query.page ? (query.page - 1) * 50 : 0
                    }
                ]);

                return res.status(200).json({
                    message: "products list",
                    data: cheapestProducts
                });
            } else if (query.order === productOrderEnum.EXPENSIVE) {
                const cheapestProducts = await Product.aggregate([
                    {
                        $match: {
                            $and: [
                                filter
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: 'inventories',
                            localField: '_id',
                            foreignField: 'productId',
                            as: 'inventory'
                        }
                    },
                    {
                        $unwind: '$inventory'
                    },
                    {
                        $group: {
                            _id: '$_id',
                            product: { $first: '$$ROOT' },
                            maxPrice: { $max: '$inventory.price' }
                        }
                    },
                    {
                        $sort: { minPrice: 1 }
                    },
                    {
                        $limit: 50
                    },
                    {
                        $skip: query.page ? (query.page - 1) * 50 : 0
                    }
                ]);

                return res.status(200).json({
                    message: "products list",
                    data: cheapestProducts
                });
            } else if (query.order === productOrderEnum.NEW) {
                sort = { createdAt: -1 }
            } else if (query.order === productOrderEnum.POPULAR) {
                sort = { views: -1 }
            }

            const products = await Product.find(filter, {}, { sort: sort, limit: 50, skip: query.page ? (query.page - 1) * 50 : 0 });

            res.status(200).json({
                message: "products list",
                data: products
            });
        } catch (e) {
            return next(e);
        }
    }

    static async getProduct(req: Request, res: Response, next: NextFunction) {
        const params = req.params as getProductDtoType;

        try {
            const product = await Product.findById(params.productId);

            if (!product || product.status !== productStatusEnum.VERIFIED) return next(CustomErrorClass.productNotFound());

            const inventory = await Inventory.aggregate([
                {
                    $match: {
                        productId: product._id,
                        status: inventoryStatusEnum.ACTIVE
                    }
                },
                {
                    $lookup: {
                        from: "stores",
                        localField: "merchantId",
                        foreignField: "merchantId",
                        as: "store"
                    }
                }
            ]);

            await product.updateOne({
                views: product.views + 1
            });

            res.status(200).json({
                message: "product",
                data: { product, inventory }
            })
        } catch (e) {
            return next(e);
        }
    }
}