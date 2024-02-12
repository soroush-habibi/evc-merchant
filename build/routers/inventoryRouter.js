import express from "express";
import userJwt from "../middlewares/userJwt.js";
import { genericValidator } from "../utils/requestChecker.js";
import inventoryController from "../controllers/inventoryController.js";
import { addInventoryDto } from "../dtos/inventory.dto.js";
const inventoryRouter = express.Router();
inventoryRouter.post("/", userJwt, genericValidator(addInventoryDto), inventoryController.addInventory);
export default inventoryRouter;
