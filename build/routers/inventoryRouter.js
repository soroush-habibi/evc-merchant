import express from "express";
import userJwt from "../middlewares/userJwt.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
import inventoryController from "../controllers/inventoryController.js";
import { addInventoryDto, getProductInventoryDto } from "../dtos/inventory.dto.js";
const inventoryRouter = express.Router();
inventoryRouter.post("/", userJwt, genericValidator(addInventoryDto), inventoryController.addInventory);
inventoryRouter.get("/product", userJwt, genericValidator(getProductInventoryDto, FieldType.QUERY), inventoryController.getProductInventory);
export default inventoryRouter;
