import Joi from "joi";
import { documentTypeEnum } from "../enum/documentType.enum.js";

//*sendDocument
const sendDocumentDto = Joi.object({
    type: Joi.string().valid(...Object.values(documentTypeEnum)).required(),
    doc: Joi.array().min(1).max(1).items(Joi.object({
        originalFilename: Joi.string().required(),
        mimetype: Joi.string().required(),
        size: Joi.number().max(1000 * 1000 * 10).required(),
        filepath: Joi.string().required(),
    }).unknown(true)).required()
});

type sendDocumentDtoType = {
    type: string,
    doc: object[]
}

export { sendDocumentDto, sendDocumentDtoType }