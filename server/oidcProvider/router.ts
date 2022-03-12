import { Application, Router } from "express";
import bodyParser from "body-parser";

import { oidcProvider } from "./";
import {
  loginController,
  interactionConfirmController,
  interactionController,
} from "./controller";

const parse = bodyParser.urlencoded({ extended: false });

export default (server: Application) => {
  server.get("/provider/interaction/:uid", interactionController);

  server.post("/provider/interaction/:uid/login", parse, loginController);

  server.post(
    "/provider/interaction/:uid/confirm",
    parse,
    interactionConfirmController
  );

  server.use("/provider", oidcProvider.callback());
};
