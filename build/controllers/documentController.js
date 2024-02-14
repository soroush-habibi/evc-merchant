const ENV = process.env.PRODUCTION;
export default class documentController {
    static sendDocument(req, res, next) {
        const body = req.form;
        try {
        }
        catch (e) {
            return next(e);
        }
    }
}
