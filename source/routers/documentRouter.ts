import express from "express";
import userJwt from "../middlewares/userJwt.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
import documentController from "../controllers/documentController.js";
import { sendDocumentDto } from "../dtos/document.dto.js";

const documentRouter = express.Router();

documentRouter.post("/", userJwt, genericValidator(sendDocumentDto, FieldType.FORM), documentController.sendDocument);

export default documentRouter;