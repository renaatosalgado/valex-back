import * as companyRepository from "../repositories/companyRepository.js";
import * as errorTypes from "../utils/errorTypes.js";
import { Request, Response, NextFunction } from "express";

export async function validateApiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey)
    throw errorTypes.unauthorized("This action requires a valid api-key.");

  const company = await companyRepository.findByApiKey(apiKey.toString());
  if (!company)
    throw errorTypes.notFound("This api-key was not found in the database.");

  res.locals.company = company;

  next();
}
