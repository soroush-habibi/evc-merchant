import { CustomErrorClass } from "../utils/customError.js";
import { Document } from "../models/document.model.js";
import { documentStatusEnum } from "../enum/documentStatus.enum.js";
import fsExtra from "fs-extra";
import path from "path";
import crypto from 'crypto';
const ENV = process.env.PRODUCTION;
export default class documentController {
    static async sendDocument(req, res, next) {
        const form = req.form;
        try {
            const existedDocument = await Document.findOne({
                status: documentStatusEnum.PENDING,
                type: form.type,
                merchantId: req.user?.id
            });
            if (existedDocument)
                return next(CustomErrorClass.pendingDocument());
            if (!fsExtra.existsSync(String(process.env.DOCUMENT_FOLDER))) {
                fsExtra.mkdirSync(String(process.env.DOCUMENT_FOLDER));
            }
            const uuid = crypto.randomUUID();
            fsExtra.copyFileSync(form.doc[0].filepath, path.join(String(process.env.DOCUMENT_FOLDER), uuid));
            await Document.create({
                merchantId: req.user?.id,
                type: form.type,
                doc: path.join(String(process.env.DOCUMENT_FOLDER), uuid)
            });
            res.status(201).json({
                message: "document saved!",
                data: uuid
            });
        }
        catch (e) {
            return next(e);
        }
    }
}
