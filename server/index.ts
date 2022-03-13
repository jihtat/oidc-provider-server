import express, { Request, Response } from "express";
import next from "next";

import { config } from "dotenv";
config();

import oidcRouter from "./oidcProvider/router";

const port = process.env.PORT || 5000;
const dev = process.env.NODE_ENV !== "production";
export const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  oidcRouter(server);

  server.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on ${process.env.HOST}:${port}`);
  });
});
