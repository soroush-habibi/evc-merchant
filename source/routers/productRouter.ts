import express from "express";
import productController from "../controllers/productController.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
import { addProductDto } from "../dtos/product.dto.js";
import userJwt from "../middlewares/userJwt.js";

const productRouter = express.Router();

productRouter.post("/", userJwt, genericValidator(addProductDto, FieldType.form), productController.addProduct);

export default productRouter;