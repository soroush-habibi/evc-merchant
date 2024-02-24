import express from "express";
import storeServiceCheck from "../middlewares/storeServiceCheck.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
import { addToCartDto, getCartDto } from "../dtos/order.dto.js";
import orderController from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.put("/cart", storeServiceCheck, genericValidator(addToCartDto), orderController.addToCart);

orderRouter.get("/cart", storeServiceCheck, genericValidator(getCartDto, FieldType.QUERY), orderController.getCart);

export default orderRouter;