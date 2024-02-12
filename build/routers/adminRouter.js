import express from "express";
import adminController from "../controllers/adminController.js";
import { getAdminProductsDto, updateProductStatusDto } from "../dtos/admin.dto.js";
import adminCheck from "../middlewares/adminCheck.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
const adminRouter = express.Router();
adminRouter.get("/product", adminCheck, genericValidator(getAdminProductsDto, FieldType.QUERY), adminController.getAdminProducts);
adminRouter.patch("/product", adminCheck, genericValidator(updateProductStatusDto, FieldType.QUERY), adminController.updateProductStatus);
export default adminRouter;
