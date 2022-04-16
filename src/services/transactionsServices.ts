import * as errorTypes from "../utils/errorTypes.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as getCardBalanceMiddleware from "../middlewares/getCardBalanceMiddleware.js";
import bcrypt from "bcrypt";

export async function verifyCardBalance(
  cardId: number,
  purchaseAmount: number
) {
  const convertAmountToCents = purchaseAmount * 100;

  const cardBalance = await getCardBalanceMiddleware.getBalance(Number(cardId));
  if (cardBalance.balance < convertAmountToCents)
    throw errorTypes.conflict("The card has insufficient balance.");
}

export async function rechargeCard(cardId: number, amount: number) {
  const convertAmountToCents = amount * 100;
  await rechargeRepository.insert({ cardId, amount: convertAmountToCents });
}

export async function verifyBusinessRegister(businessId: number) {
  const business = await businessRepository.findById(businessId);
  if (!business)
    throw errorTypes.notFound("This business was not found in the database.");

  return business;
}

export function verifyBusinessType(cardType: string, businessType: string) {
  if (cardType !== businessType)
    throw errorTypes.conflict(
      "This type of card cannot be used in this type of business."
    );
}

export function verifyPassword(password: string, passwordHash: string) {
  if (!bcrypt.compareSync(password, passwordHash))
    throw errorTypes.unauthorized("The password is not correct.");
}

export async function makePurchase(
  cardId: number,
  businessId: number,
  amount: number
) {
  const convertAmountToCents = amount * 100;
  await paymentRepository.insert({
    cardId,
    businessId,
    amount: convertAmountToCents,
  });
}
