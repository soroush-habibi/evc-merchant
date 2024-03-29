import express from "express";
import gatewayCheck from "../middlewares/gatewayCheck.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
import { createGatewayDto, getGatewayDto, startPaymentDto, verifyPaymentDto } from "../dtos/gateway.dto.js";
import gatewayController from "../controllers/gatewayController.js";

const gatewayRouter = express.Router();

gatewayRouter.post("/", gatewayCheck, genericValidator(createGatewayDto), gatewayController.createGateway);

gatewayRouter.get("/", genericValidator(getGatewayDto, FieldType.QUERY), gatewayController.getGateway);

gatewayRouter.post("/payment", genericValidator(startPaymentDto), gatewayController.startPayment);

gatewayRouter.put("/payment/verify", genericValidator(verifyPaymentDto), gatewayController.verifyPayment);

export default gatewayRouter;