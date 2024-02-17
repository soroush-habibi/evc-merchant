import Joi from "joi";
import { documentTypeEnum } from "../enum/documentType.enum.js";
import { documentStatusEnum } from "../enum/documentStatus.enum.js";
//*sendDocument
const sendDocumentDto = Joi.object({
    type: Joi.string().valid(...Object.values(documentTypeEnum)).required(),
    doc: Joi.array().min(1).max(1).items(Joi.object({
        originalFilename: Joi.string().required(),
        mimetype: Joi.string().required(),
        size: Joi.number().max(1000 * 1000 * (Number(process.env.MAX_DOC_SIZE) || 20)).required(),
        filepath: Joi.string().required(),
    }).unknown(true)).required()
});
export { sendDocumentDto };
//*getDocuments
const getDocumentsDto = Joi.object({
    page: Joi.number().integer().min(1),
    type: Joi.string().valid(...Object.values(documentTypeEnum)),
    status: Joi.string().valid(...Object.values(documentStatusEnum))
});
export { getDocumentsDto };
