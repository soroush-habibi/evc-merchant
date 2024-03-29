import express from "express";
import storeServiceCheck from "../middlewares/storeServiceCheck.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
import { addToCartDto, confirmOrderDto, getCartsDto, confirmCallbackDto, getUserOrdersDto, getUserOrderDto } from "../dtos/order.dto.js";
import orderController from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.put("/cart", storeServiceCheck, genericValidator(addToCartDto), orderController.addToCart);

orderRouter.get("/cart", storeServiceCheck, genericValidator(getCartsDto, FieldType.QUERY), orderController.getCarts);

orderRouter.post("/confirm", storeServiceCheck, genericValidator(confirmOrderDto), orderController.confirmOrder);

orderRouter.get("/confirm/callback", storeServiceCheck, genericValidator(confirmCallbackDto, FieldType.QUERY), orderController.confirmCallback);

orderRouter.get("/:userId/:orderId", storeServiceCheck, genericValidator(getUserOrderDto, FieldType.PARAMS), orderController.getUserOrder);

orderRouter.get("/", storeServiceCheck, genericValidator(getUserOrdersDto, FieldType.QUERY), orderController.getUserOrders);

export default orderRouter;