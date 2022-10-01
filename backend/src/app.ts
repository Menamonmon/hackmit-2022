import express from "express";
import "reflect-metadata";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { expressjwt } from "express-jwt";
import "./auth/authorizations";
import api from "./api";
import websockets from "./websockets";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const main = async () => {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(
    expressjwt({
      secret: process.env.JWT_SECRET,
      algorithms: ["HS256"],
      credentialsRequired: false,
    })
  );

  // For JWT error handling
  app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      req.auth = null;
    }
    next();
  });

  await api(app);

  const PORT = process.env.PORT || 4000;

  const server = app.listen(PORT, () => {
    console.log(
      `Apollo Server up and running at http://localhost:${PORT}/graphql`
    );
  });

  websockets(server);
};

main();
