import dayjs from "dayjs";
import { Request, Response } from "express";
import * as errorTypes from "../utils/errorTypes.js";
import * as transactionsServices from "../services/transactionsServices.js";
import * as verifyEmployeeCompanyLinkMiddleware from "../middlewares/verifyEmployeeCompanyLinkMiddleware.js";
import * as verifyCardExistenceMiddleware from "../middlewares/verifyCardExistenceMiddleware.js";
import * as verifyExpirationDateMiddleware from "../middlewares/verifyExpirationDateMiddleware.js";
import rechargeSchema from "../schemas/rechargeSchema.js";

export async function allTransactions(req: Request, res: Response) {
  const { cardId } = req.params;

  console.log(dayjs(Date.now()).format("DD/MM/YY HH:mm:ss"));
}

export async function recharge(req: Request, res: Response) {
  const { cardId } = req.params;
  const { company } = res.locals;
  const { amount } = req.body;

  validateRechargeAmount(req.body);

  const card = await verifyCardExistenceMiddleware.verifyCardExistence(
    Number(cardId)
  );

  await verifyEmployeeCompanyLinkMiddleware.verifyEmployeeRegister(
    card.employeeId,
    company.id
  );

  verifyExpirationDateMiddleware.verifyExpirationDate(card.expirationDate);

  await transactionsServices.rechargeCard(card.id, Number(amount));

  res.sendStatus(201);
}

function validateRechargeAmount(body: any) {
  const validation = rechargeSchema.validate(body);

  if (validation.error)
    throw errorTypes.invalidInput("The 'amount' must be an integer value above $0.");
}
