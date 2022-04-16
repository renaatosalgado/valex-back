import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import * as errorTypes from "../utils/errorTypes.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";

export async function verifyEmployeeRegister(
  employeeId: number,
  companyId: number
) {
  const employee = await employeeRepository.findById(employeeId);
  if (!employee)
    throw errorTypes.notFound("This employee was not found in the database.");

  if (employee.companyId !== companyId)
    throw errorTypes.forbidden("This employee is assigned to another company.");

  return employee;
}

export async function verifyEmployeeCards(
  type: cardRepository.TransactionTypes,
  employeeId: number
) {
  const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
  if (card) {
    throw errorTypes.conflict(
      "This employee already have a card with this type."
    );
  }
}

export function createCardInfo(employeeName: string) {
  const cardNumber = faker.finance.creditCardNumber("mastercard");
  const formattedName = formatName(employeeName);
  const expirationDate = genetateExpirationDate();
  const { cvv, cvvHash } = encryptCVV();

  return {
    cardNumber,
    formattedName,
    expirationDate,
    cvv,
    cvvHash,
  };
}

export async function createCreditCard(
  employeeId: number,
  number: string,
  cardholderName: string,
  securityCode: string,
  expirationDate: string,
  password: string,
  isVirtual: boolean,
  originalCardId: number,
  isBlocked: boolean,
  type: cardRepository.TransactionTypes
) {
  await cardRepository.insert({
    employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    password,
    isVirtual,
    originalCardId,
    isBlocked,
    type,
  });
}

function formatName(employeeName: string) {
  const arrUpperName = employeeName.toUpperCase().split(" ");

  const filteredNames = arrUpperName.filter((name) => name.length >= 3);

  const firstName = filteredNames[0];

  const lastName = filteredNames[filteredNames.length - 1];

  const middleNames = filteredNames.filter(
    (name) => name !== firstName && name !== lastName
  );

  const finalName = [];

  finalName.push(firstName);

  middleNames.forEach((name) => finalName.push(name[0]));

  finalName.push(lastName);

  return finalName.join(" ");
}

function genetateExpirationDate() {
  return dayjs().add(5, "year").format("MM/YY");
}

function encryptCVV() {
  const cvv = faker.finance.creditCardCVV();
  const cvvHash = bcrypt.hashSync(cvv, 10);
  return {
    cvv,
    cvvHash,
  };
}
