import express from "express";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
import indexController from "../controllers/indexController.js";

const indexRouter = express.Router();

export default indexRouter;