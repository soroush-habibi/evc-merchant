import { CustomErrorClass } from "../utils/customError.js";
import { Product } from "../models/product.model.js";
const ENV = process.env.PRODUCTION;
export default class adminController {
    static async getAdminProducts(req, res, next) {
        const query = req.query;
        try {
            const filter = {
                title: {
                    $regex: query.title ? new RegExp(query.title, "i") : ""
                }, category: {
                    $regex: query.category ? new RegExp(query.category, "i") : ""
                }
            };
            if (query.status !== undefined)
                filter.status = query.status;
            const results = await Product.find(filter, {}, { limit: 20, skip: query.page ? (query.page - 1) * 20 : 0 });
            res.status(200).json({
                message: "products list",
                data: results
            });
        }
        catch (e) {
            next(e);
        }
    }
    static async updateProductStatus(req, res, next) {
        const query = req.query;
        try {
            const product = await Product.findById(query.productId);
            if (!product)
                return next(CustomErrorClass.productNotFound());
            await product.updateOne({ status: query.newStatus });
            res.status(201).json({
                message: "status updated"
            });
        }
        catch (e) {
            return next(e);
        }
    }
}
