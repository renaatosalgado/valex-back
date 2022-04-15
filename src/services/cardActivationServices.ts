import * as errorTypes from "../utils/errorTypes.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";

export async function verifyCardInfo(cvv: string, cardId: number) {
  const card = await cardRepository.findById(cardId);
  if (!card)
    throw errorTypes.notFound("This card is was not found in the database.");

  console.log(card);
}
