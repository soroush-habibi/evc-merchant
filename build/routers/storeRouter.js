import express from "express";
import storeServiceCheck from "../middlewares/storeServiceCheck.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
import { getProductDto, searchProductDto } from "../dtos/store.dto.js";
import storeController from "../controllers/storeController.js";
const storeRouter = express.Router();
storeRouter.get("/product", storeServiceCheck, genericValidator(searchProductDto, FieldType.QUERY), storeController.searchProduct);
storeRouter.get("/product/:productId", storeServiceCheck, genericValidator(getProductDto, FieldType.PARAMS), storeController.getProduct);
export default storeRouter;
