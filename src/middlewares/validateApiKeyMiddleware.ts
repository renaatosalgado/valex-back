import * as companyRepository from "../repositories/companyRepository.js";
import { Request, Response, NextFunction } from "express";

export async function validateApiKey(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
        return res.sendStatus(401);
    }

    const company = await companyRepository.findByApiKey(apiKey.toString());
   
    res.locals.company = company;

    next();
}