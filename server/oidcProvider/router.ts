import { Application, Router } from "express";
import bodyParser from "body-parser";

import { oidcProvider } from ".";
import {
  loginController,
  interactionConfirmController,
  interactionController,
} from "./controller";

const parse = bodyParser.urlencoded({ extended: false });

export default (server: Application) => {
  server.get(
    `/${process.env.PROVIDER_URL}/interaction/:uid`,
    interactionController
  );

  server.post(
    `/${process.env.PROVIDER_URL}/interaction/:uid/login`,
    parse,
    loginController
  );

  server.post(
    `/${process.env.PROVIDER_URL}/interaction/:uid/confirm`,
    parse,
    interactionConfirmController
  );

  server.use(`/${process.env.PROVIDER_URL}`, oidcProvider.callback());
};
