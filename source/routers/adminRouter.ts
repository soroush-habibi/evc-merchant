import express from "express";
import adminController from "../controllers/adminController.js";
import { getAdminProductsDto, getUsersDto, updateProductStatusDto, checkDocumentDto } from "../dtos/admin.dto.js";
import adminCheck from "../middlewares/adminCheck.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";

const adminRouter = express.Router();

adminRouter.get("/product", adminCheck, genericValidator(getAdminProductsDto, FieldType.QUERY), adminController.getAdminProducts);

adminRouter.patch("/product", adminCheck, genericValidator(updateProductStatusDto, FieldType.QUERY), adminController.updateProductStatus);

adminRouter.get("/user", adminCheck, genericValidator(getUsersDto, FieldType.QUERY), adminController.getUsers);

adminRouter.put("/document", adminCheck, genericValidator(checkDocumentDto, FieldType.QUERY), adminController.checkDocument);

export default adminRouter;