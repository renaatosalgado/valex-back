import dayjs from "dayjs";
import { Request, Response } from "express";
import * as errorTypes from "../utils/errorTypes.js";

export async function allTransactions(req: Request, res: Response) {
  const { cardId } = req.params;

  console.log(dayjs(Date.now()).format("DD/MM/YY HH:mm:ss"));
}
