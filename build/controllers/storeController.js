import { Product } from "../models/product.model.js";
import { productOrderEnum } from "../enum/productOrder.enum.js";
import { CustomErrorClass } from "../utils/customError.js";
import { productStatusEnum } from "../enum/productStatus.enum.js";
import { Inventory } from "../models/inventory.model.js";
import { inventoryStatusEnum } from "../enum/inventoryStatus.enum.js";
export default class storeController {
    static async searchProduct(req, res, next) {
        const query = req.query;
        try {
            const filter = {
                category: query.category
            };
            let sort;
            if (query.text)
                filter.$text = { $search: query.text };
            if (query.order === productOrderEnum.RELATED) {
                sort = { score: { $meta: "textScore" } };
            }
            else if (query.order === productOrderEnum.BEST_SELLER) {
                sort = { score: { $meta: "textScore" } }; //todo:change needed
            }
            else if (query.order === productOrderEnum.CHEAP) {
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
            }
            else if (query.order === productOrderEnum.EXPENSIVE) {
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
            }
            else if (query.order === productOrderEnum.NEW) {
                sort = { createdAt: -1 };
            }
            else if (query.order === productOrderEnum.POPULAR) {
                sort = { score: { $meta: "textScore" } }; //todo:change needed
            }
            const products = await Product.find(filter, { score: { $meta: "textScore" } }, { sort: sort, limit: 50, skip: query.page ? (query.page - 1) * 50 : 0 });
            res.status(200).json({
                message: "products list",
                data: products
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async getProduct(req, res, next) {
        const params = req.params;
        try {
            const product = await Product.findById(params.productId);
            if (!product || product.status !== productStatusEnum.VERIFIED)
                return next(CustomErrorClass.productNotFound());
            const inventory = await Inventory.find({
                productId: product._id,
                status: inventoryStatusEnum.ACTIVE
            });
            res.status(200).json({
                message: "product",
                data: { product, inventory }
            });
        }
        catch (e) {
            return next(e);
        }
    }
}
