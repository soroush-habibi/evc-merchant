import express from "express";
import storeServiceCheck from "../middlewares/storeServiceCheck.js";
import { genericValidator } from "../utils/requestChecker.js";
import { addToCartDto } from "../dtos/order.dto.js";
import orderController from "../controllers/orderController.js";
const orderRouter = express.Router();
orderRouter.put("/cart", storeServiceCheck, genericValidator(addToCartDto), orderController.addToCart);
export default orderRouter;
