import { Express } from "express";
import { getData } from "./db/db";

const port = 3500;
const express = require("express");

const app: Express = express();

// console.log(db);

// @ts-ignore
getData("RTGS").then((data) => {
  console.log(data);
});

app.listen(port, () => {
  console.info("Listing on port " + port);
});
