import express from "express";
import userJwt from "../middlewares/userJwt.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
import { addCommentDto } from "../dtos/stats.dto.js";
import statsController from "../controllers/statsController.js";
import storeServiceCheck from "../middlewares/storeServiceCheck.js";

const statsRouter = express.Router();

statsRouter.post("/comment", storeServiceCheck, genericValidator(addCommentDto), statsController.addComment);

export default statsRouter;