import { Request, Response } from "express";
import * as cardsServices from "../services/cardsServices.js";
import * as errorTypes from "../utils/errorTypes.js";

export async function create(req: Request, res: Response) {
  const { employeeId, cardType } = req.body;

  validateCardType(cardType);

  const employee = await cardsServices.verifyEmployeeRegister(employeeId);

  await cardsServices.verifyEmployeeCards(cardType, employeeId);

  const { cardNumber, formattedName, expirationDate, cvv, cvvHash } =
    cardsServices.createCardInfo(employee.fullName);

  const password = null;
  const isVirtual = false;
  const originalCardId = null;
  const isBlocked = true;

  await cardsServices.createCreditCard(
    employee.id,
    cardNumber,
    formattedName,
    cvv,
    expirationDate,
    password,
    isVirtual,
    originalCardId,
    isBlocked,
    cardType
  );

  res.sendStatus(201);
}

export async function activate(req: Request, res: Response) {}

export async function overallTransactions(req: Request, res: Response) {}

function validateCardType(cardType: string) {
  if (
    cardType !== "groceries" &&
    cardType !== "restaurant" &&
    cardType !== "transport" &&
    cardType !== "education" &&
    cardType !== "health"
  ) {
    throw errorTypes.invalidInput("This card type is not valid.");
  }
}
