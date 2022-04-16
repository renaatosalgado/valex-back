import * as errorTypes from "../utils/errorTypes.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import dayjs from "dayjs";

export async function rechargeCard(cardId: number, amount: number) {
  await rechargeRepository.insert({ cardId, amount });
}
