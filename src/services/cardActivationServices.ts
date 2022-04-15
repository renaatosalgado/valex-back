import * as errorTypes from "../utils/errorTypes.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

export async function verifyCardExistence(cardId: number) {
  const card = await cardRepository.findById(cardId);
  if (!card)
    throw errorTypes.notFound("This card is was not found in the database.");

  return card;
}

export function verifyCVV(cvv: string, cvvHash: string) {
  if (!bcrypt.compareSync(cvv, cvvHash))
    throw errorTypes.unauthorized("The CVV sent is not correct.");
}

export function verifyAlreadyAtivatedCard(password: string) {
  if (password !== null)
    throw errorTypes.conflict("This card has already been activated.");
}

export function verifyExpirationDate(expirationDate: string) {
  const today = dayjs().format("MM/YY");
  if (dayjs(today).isAfter(dayjs(expirationDate)))
    throw errorTypes.conflict("This card has already expired.");
}

export function encryptPassword(password: string) {
  const passwordHash = bcrypt.hashSync(password, 10);

  return passwordHash;
}

export async function activateCard(
  cardId: number,
  password: string,
  isBlocked: boolean
) {
  await cardRepository.update(cardId, { password, isBlocked });
}
