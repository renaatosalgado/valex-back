import { Router } from "express";
import * as cardsController from "../controllers/cardsController.js";

const cardsRouter = Router();

cardsRouter.post("/cards", cardsController.create);
cardsRouter.post("/cards/activation", cardsController.activate);
cardsRouter.get("/cards/transactions", cardsController.overallTransactions);

export default cardsRouter;
