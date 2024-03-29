import express from "express";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
import { addCommentDto, deleteCommentDto, getMerchantStatsDto, getProductCommentsDto, getProductStatsDto } from "../dtos/stats.dto.js";
import statsController from "../controllers/statsController.js";
import storeServiceCheck from "../middlewares/storeServiceCheck.js";
const statsRouter = express.Router();
statsRouter.post("/comment", storeServiceCheck, genericValidator(addCommentDto), statsController.addComment);
statsRouter.delete("/comment", storeServiceCheck, genericValidator(deleteCommentDto, FieldType.QUERY), statsController.deleteComment);
statsRouter.get("/comment", storeServiceCheck, genericValidator(getProductCommentsDto, FieldType.QUERY), statsController.getProductComments);
statsRouter.get("/product", storeServiceCheck, genericValidator(getProductStatsDto, FieldType.QUERY), statsController.getProductStats);
statsRouter.get("/merchant", storeServiceCheck, genericValidator(getMerchantStatsDto, FieldType.QUERY), statsController.getMerchantStats);
export default statsRouter;
