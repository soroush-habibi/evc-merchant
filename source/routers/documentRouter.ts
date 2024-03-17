import express from "express";
import userJwt from "../middlewares/userJwt.js";
import { FieldType, genericValidator } from "../utils/requestChecker.js";
import documentController from "../controllers/documentController.js";
import { getDocumentsDto, sendDocumentDto, verifyDocumentUrlDto } from "../dtos/document.dto.js";

const documentRouter = express.Router();

documentRouter.post("/", userJwt, genericValidator(sendDocumentDto), documentController.sendDocument);

documentRouter.get("/", userJwt, genericValidator(getDocumentsDto, FieldType.QUERY), documentController.getDocuments);

documentRouter.get("/url", userJwt, genericValidator(verifyDocumentUrlDto, FieldType.QUERY), documentController.verifyDocumentUrl);

export default documentRouter;