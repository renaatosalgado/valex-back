import { Request, Response } from "express";
import * as cardsCreationServices from "../services/cardsCreationServices.js";
import * as cardsActivationServices from "../services/cardActivationServices.js";
import * as errorTypes from "../utils/errorTypes.js";
import joi from "joi";

export async function create(req: Request, res: Response) {
  const { employeeId, cardType } = req.body;
  const { company } = res.locals;

  validateCardType(cardType);

  const employee = await cardsCreationServices.verifyEmployeeRegister(
    employeeId, company.id
  );

  await cardsCreationServices.verifyEmployeeCards(cardType, employeeId);

  const { cardNumber, formattedName, expirationDate, cvv, cvvHash } =
    cardsCreationServices.createCardInfo(employee.fullName);

  const password = null;
  const isVirtual = false;
  const originalCardId = null;
  const isBlocked = true;

  await cardsCreationServices.createCreditCard(
    employee.id,
    cardNumber,
    formattedName,
    cvvHash,
    expirationDate,
    password,
    isVirtual,
    originalCardId,
    isBlocked,
    cardType
  );

  console.log({ cvv });

  res.sendStatus(201);
}

export async function activate(req: Request, res: Response) {
  const { cardId } = req.params;
  const { cvv, password } = req.body;

  validateActivationInput(cvv, password);

  const card = await cardsActivationServices.verifyCardExistence(
    Number(cardId)
  );

  cardsActivationServices.verifyCVV(cvv, card.securityCode);

  cardsActivationServices.verifyAlreadyAtivatedCard(card.password);

  cardsActivationServices.verifyExpirationDate(card.expirationDate);

  const passwordHash = cardsActivationServices.encryptPassword(password);

  const isBlocked = false;

  cardsActivationServices.activateCard(Number(cardId), passwordHash, isBlocked);

  res.sendStatus(201);
}

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

function validateActivationInput(cvv: string, password: string) {
  const activationSchema = joi.object({
    cvv: joi
      .string()
      .pattern(/^[0-9]{3}$/)
      .required(),
    password: joi
      .string()
      .pattern(/^[0-9]{4}$/)
      .required(),
  });

  const validation = activationSchema.validate({
    cvv: cvv,
    password: password,
  });

  if (validation.error)
    throw errorTypes.invalidInput(
      "The CVV must have exactly 3 numeric digits and the passowrd must have exactly 4 numeric digits."
    );
}
