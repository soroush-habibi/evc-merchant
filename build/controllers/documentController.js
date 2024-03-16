import { CustomErrorClass } from "../utils/customError.js";
import { Document } from "../models/document.model.js";
import { documentStatusEnum } from "../enum/documentStatus.enum.js";
const ENV = process.env.PRODUCTION;
export default class documentController {
    static async sendDocument(req, res, next) {
        const body = req.body;
        try {
            const existedDocument = await Document.findOne({
                status: documentStatusEnum.PENDING,
                type: body.type,
                merchantId: req.user?.id
            });
            if (existedDocument)
                return next(CustomErrorClass.pendingDocument());
            await Document.create({
                merchantId: req.user?.id,
                type: body.type,
                doc: body.docUrl
            });
            res.status(201).json({
                message: "document saved!",
                data: body.docUrl
            });
        }
        catch (e) {
            return next(e);
        }
    }
    static async getDocuments(req, res, next) {
        const query = req.query;
        try {
            const filter = {
                merchantId: req.user?.id,
                status: query.status ? query.status : documentStatusEnum.PENDING
            };
            if (query.type)
                filter.type = query.type;
            const documents = await Document.find(filter, {}, {
                limit: 10,
                skip: query.page ? (query.page - 1) * 10 : 0
            });
            res.status(200).json({
                message: "list of documents!",
                data: documents
            });
        }
        catch (e) {
            return next(e);
        }
    }
}
