import { Router } from "express";
import * as cardsController from "../controllers/cardsController.js";
import { validateApiKeyMiddleware } from "../middlewares/validateApiKeyMiddleware.js";

const cardsRouter = Router();

cardsRouter.post("/cards", validateApiKeyMiddleware, cardsController.create);
cardsRouter.put("/cards/:cardId/activation", cardsController.activate);

export default cardsRouter;
