import { Request, Response } from "express";
import * as cardRepository from "../repositories/cardRepository.js"

export async function create(req: Request, res: Response) {
  const { employeeId, cardType } = req.body;

  if (
    cardType !== "groceries" &&
    cardType !== "restaurants" &&
    cardType !== "transport" &&
    cardType !== "education" &&
    cardType !== "health"
  ) {
    return res.status(404).send("Invalid card type.")
  }

  //await cardRepository.insert()
  res.sendStatus(200)
}

export async function activate(req: Request, res: Response) {}

export async function overallTransactions(req: Request, res: Response) {}
