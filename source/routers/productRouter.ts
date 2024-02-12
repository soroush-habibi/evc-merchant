import express from "express";
import productController from "../controllers/productController.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
import { addPhotoDto, addProductDto, deletePhotoDto } from "../dtos/product.dto.js";
import userJwt from "../middlewares/userJwt.js";

const productRouter = express.Router();

productRouter.post("/", userJwt, genericValidator(addProductDto, FieldType.FORM), productController.addProduct);

productRouter.delete("/photo", userJwt, genericValidator(deletePhotoDto), productController.deletePhoto);

productRouter.put("/photo", userJwt, genericValidator(addPhotoDto, FieldType.FORM), productController.addPhoto);

export default productRouter;