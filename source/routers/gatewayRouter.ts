import express from "express";
import gatewayCheck from "../middlewares/gatewayCheck.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
import { createGatewayDto, getGatewayDto, startPaymentDto } from "../dtos/gateway.dto.js";
import gatewayController from "../controllers/gatewayController.js";

const gatewayRouter = express.Router();

gatewayRouter.post("/", gatewayCheck, genericValidator(createGatewayDto), gatewayController.createGateway);

gatewayRouter.get("/", genericValidator(getGatewayDto, FieldType.QUERY), gatewayController.getGateway);

gatewayRouter.post("/payment", genericValidator(startPaymentDto), gatewayController.startPayment);

export default gatewayRouter;