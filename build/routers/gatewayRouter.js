import express from "express";
import gatewayCheck from "../middlewares/gatewayCheck.js";
import { genericValidator } from "../utils/requestChecker.js";
import { createGatewayDto } from "../dtos/gateway.dto.js";
import gatewayController from "../controllers/gatewayController.js";
const gatewayRouter = express.Router();
gatewayRouter.post("/", gatewayCheck, genericValidator(createGatewayDto), gatewayController.createGateway);
export default gatewayRouter;
