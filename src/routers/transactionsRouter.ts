import { Router } from "express";
import * as transactionsController from "../controllers/transactionsController.js";
import { validateApiKeyMiddleware } from "../middlewares/validateApiKeyMiddleware.js";

const transactionsRouter = Router();

transactionsRouter.get(
  "/transactions/:cardId/overview",
  validateApiKeyMiddleware,
  transactionsController.allTransactions
);
transactionsRouter.post(
  "/transactions/:cardId/recharge",
  validateApiKeyMiddleware,
  transactionsController.recharge
);
transactionsRouter.post(
  "/transactions/:cardId/purchase",
  transactionsController.purchase
);

export default transactionsRouter;
