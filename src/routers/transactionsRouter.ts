import { Router } from "express";
import * as transactionsController from "../controllers/transactionsController.js";
import { validateApiKeyMiddleware } from "../middlewares/validateApiKeyMiddleware.js";

const transactionsRouter = Router();

transactionsRouter.get(
  "/transactions/:cardId/overview",
  validateApiKeyMiddleware,
  transactionsController.allTransactions
);
transactionsRouter.get("/transactions/:cardId/recharge");
transactionsRouter.get("/transactions/:cardId/payments");

export default transactionsRouter;
