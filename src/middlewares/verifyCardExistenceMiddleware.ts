import * as cardRepository from "../repositories/cardRepository.js";
import * as errorTypes from "../utils/errorTypes.js";

export async function verifyCardExistence(cardId: number) {
  const card = await cardRepository.findById(cardId);
  if (!card)
    throw errorTypes.notFound("This card was not found in the database.");

  return card;
}
