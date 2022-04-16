import * as errorTypes from "../utils/errorTypes.js";
import * as cardRepository from "../repositories/cardRepository.js";
import bcrypt from "bcrypt";

export function verifyCVV(cvv: string, cvvHash: string) {
  if (!bcrypt.compareSync(cvv, cvvHash))
    throw errorTypes.unauthorized("The CVV sent is not correct.");
}

export function verifyAlreadyAtivatedCard(password: string) {
  if (password !== null)
    throw errorTypes.conflict("This card has already been activated.");
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
