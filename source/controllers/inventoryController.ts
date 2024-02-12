import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";

const ENV = process.env.PRODUCTION

export default class inventoryController {
    static async addInventory(req: Request, res: Response, next: NextFunction) {

    }
}