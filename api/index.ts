import serverless from "serverless-http";
import app from "../artifacts/api-server/src/app";

export const handler = serverless(app, {
  binary: [
    "application/javascript",
    "application/json",
    "application/xml",
    "text/css",
    "text/html",
    "text/plain",
    "text/xml",
  ],
});
