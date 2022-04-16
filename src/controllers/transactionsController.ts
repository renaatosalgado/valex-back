import { Request, Response } from "express";
import * as errorTypes from "../utils/errorTypes.js";
import * as transactionsServices from "../services/transactionsServices.js";
import * as verifyEmployeeCompanyLinkMiddleware from "../middlewares/verifyEmployeeCompanyLinkMiddleware.js";
import * as verifyCardExistenceMiddleware from "../middlewares/verifyCardExistenceMiddleware.js";
import * as verifyExpirationDateMiddleware from "../middlewares/verifyExpirationDateMiddleware.js";
import * as getCardBalanceMiddleware from "../middlewares/getCardBalanceMiddleware.js";
import rechargeSchema from "../schemas/rechargeSchema.js";
import purchaseSchema from "../schemas/purchaseSchema.js";

export async function allTransactions(req: Request, res: Response) {
  const { cardId } = req.params;

  await verifyCardExistenceMiddleware.verifyCardExistence(Number(cardId));

  const result = await getCardBalanceMiddleware.getBalance(Number(cardId));

  res.status(200).send(result);
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

export async function purchase(req: Request, res: Response) {
  const { cardId } = req.params;
  const { amount, businessId, password } = req.body;

  validatePurchase(req.body);

  const card = await verifyCardExistenceMiddleware.verifyCardExistence(
    Number(cardId)
  );

  verifyExpirationDateMiddleware.verifyExpirationDate(card.expirationDate);

  await transactionsServices.verifyCardBalance(Number(cardId), amount);

  const business = await transactionsServices.verifyBusinessRegister(
    Number(businessId)
  );

  transactionsServices.verifyBusinessType(card.type, business.type);

  transactionsServices.verifyPassword(password, card.password);

  transactionsServices.makePurchase(card.id, business.id, amount);

  res.sendStatus(201);
}

function validateRechargeAmount(body: any) {
  const validation = rechargeSchema.validate(body);

  if (validation.error)
    throw errorTypes.invalidInput(
      "The 'amount' must be an integer value above $0."
    );
}

function validatePurchase(body: any) {
  const validation = purchaseSchema.validate(body);

  if (validation.error)
    throw errorTypes.invalidInput(
      "'Amount' must be an integer number above $0, 'businessId' must be an integer number and 'password' must have exactly 4 numeric digits."
    );
}
