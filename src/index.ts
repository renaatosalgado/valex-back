import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import router from "./routers/index.js";
import { errorsHandlerMiddleware } from "./middlewares/errorsHandlerMiddleware.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(json());
app.use(router);
app.use(errorsHandlerMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
