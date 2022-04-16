import * as errorTypes from "../utils/errorTypes.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function getBalance(cardId: number) {
  const creditResult = await rechargeRepository.findByCardId(cardId);
  let totalCredit = 0;
  creditResult.forEach((item) => {
    totalCredit += item.amount;
  });

  const debitResult = await paymentRepository.findByCardId(cardId);
  let totalDebit = 0;
  debitResult.forEach((item) => {
    totalDebit += item.amount;
  });

  const finalBalance = totalCredit - totalDebit;

  return {
    balance: finalBalance,
    transactions: debitResult,
    recharges: creditResult,
  };
}
