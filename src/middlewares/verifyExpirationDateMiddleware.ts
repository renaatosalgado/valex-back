import dayjs from "dayjs";
import * as errorTypes from "../utils/errorTypes.js";

export function verifyExpirationDate(expirationDate: string) {
  const today = dayjs().format("MM/YY");
  if (dayjs(today).isAfter(dayjs(expirationDate)))
    throw errorTypes.conflict("This card has already expired.");
}
