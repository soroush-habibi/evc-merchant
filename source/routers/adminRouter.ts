import express from "express";
import adminController from "../controllers/adminController.js";
import { getAdminProductsDto, getUsersDto, updateProductStatusDto, checkDocumentDto, verifyUserDto, verifyStoreDto, getOrdersDto, verifyDocumentUrlDto } from "../dtos/admin.dto.js";
import adminCheck from "../middlewares/adminCheck.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";

const adminRouter = express.Router();

adminRouter.get("/product", adminCheck, genericValidator(getAdminProductsDto, FieldType.QUERY), adminController.getAdminProducts);

adminRouter.patch("/product", adminCheck, genericValidator(updateProductStatusDto, FieldType.QUERY), adminController.updateProductStatus);

adminRouter.get("/user", adminCheck, genericValidator(getUsersDto, FieldType.QUERY), adminController.getUsers);

adminRouter.put("/user/store", adminCheck, genericValidator(verifyStoreDto), adminController.verifyStore)

adminRouter.put("/user", adminCheck, genericValidator(verifyUserDto), adminController.verifyUser);

adminRouter.put("/document", adminCheck, genericValidator(checkDocumentDto, FieldType.QUERY), adminController.checkDocument);

adminRouter.get("/order", adminCheck, genericValidator(getOrdersDto, FieldType.QUERY), adminController.getOrders);

adminRouter.get("/document/url", adminCheck, genericValidator(verifyDocumentUrlDto, FieldType.QUERY), adminController.verifyDocumentUrl);

export default adminRouter;