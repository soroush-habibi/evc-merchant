import Joi from "joi";
import { documentTypeEnum } from "../enum/documentType.enum.js";
import { documentStatusEnum } from "../enum/documentStatus.enum.js";
//*sendDocument
const sendDocumentDto = Joi.object({
    type: Joi.string().valid(...Object.values(documentTypeEnum)).required(),
    docUrl: Joi.string().uri().required()
});
export { sendDocumentDto };
//*getDocuments
const getDocumentsDto = Joi.object({
    page: Joi.number().integer().min(1),
    type: Joi.string().valid(...Object.values(documentTypeEnum)),
    status: Joi.string().valid(...Object.values(documentStatusEnum))
});
export { getDocumentsDto };
