import express, { json, NextFunction, Request, Response } from "express";
import "express-async-errors";
import cors from "cors";
import router from "./routers/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(json());
app.use(router);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.type === "invalid_input")
    return res.status(err.code).send(err.message);
  if (err.type === "unauthorized")
    return res.status(err.code).send(err.message);
  if (err.type === "not_found") return res.status(err.code).send(err.message);
  if (err.type === "conflict") return res.status(err.code).send(err.message);

  res.sendStatus(500);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
