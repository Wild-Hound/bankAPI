import { Express } from "express";
import { getData, getAllMatchedData } from "./db/db";

const port = process.env.PORT || 3500;
const express = require("express");

const app: Express = express();

function organizeData(data: any[], limit: number, offset: number) {
  {
    // @ts-ignore
    data.sort((a: any, b: any) => {
      if (a.ifsc < b.ifsc) return -1;
      if (a.ifsc > b.ifsc) return 1;
      return 0;
    });

    if ((limit === 0 && offset === 0) || offset >= data.length) {
      return data;
    } else if (offset === 0) {
      return data.slice(0, limit);
    } else if (limit === 0) {
      return data.slice(offset, data.length);
    } else {
      return data.slice(offset, offset + limit);
    }
  }
}

app.get("/api/branches", async (req, res) => {
  const text: string | undefined = req.query.q?.toString().toUpperCase();
  const limit: string | undefined = req.query.limit?.toString();
  const offset: string | undefined = req.query.offset?.toString();

  // handling query error
  if (!text) {
    res.status(400).send(`invalid query parameter`);
    return;
  } else if (limit !== undefined && !parseInt(limit) && parseInt(limit) < 0) {
    res.status(400).send(`invalid limit parameter`);
    return;
  } else if (
    offset !== undefined &&
    !parseInt(offset) &&
    parseInt(offset) < 0
  ) {
    res.status(400).send(`invalid offset parameter`);
    return;
  }

  await getAllMatchedData(text).then((data) => {
    const result = organizeData(
      data,
      limit === undefined ? 0 : parseInt(limit),
      offset === undefined ? 0 : parseInt(offset)
    );
    res.send(JSON.stringify(result));
  });
});

app.get("/api/branches/autocomplete", async (req, res) => {
  const text: string | undefined = req.query.q?.toString();
  const limit: string | undefined = req.query.limit?.toString();
  const offset: string | undefined = req.query.offset?.toString();

  // handling query error
  if (!text) {
    res.status(400).send(`invalid query parameter`);
    return;
  } else if (limit !== undefined && !parseInt(limit) && parseInt(limit) < 0) {
    res.status(400).send(`invalid limit parameter`);
    return;
  } else if (
    offset !== undefined &&
    !parseInt(offset) &&
    parseInt(offset) < 0
  ) {
    res.status(400).send(`invalid offset parameter`);
    return;
  }

  // getting data from database
  await getData(text).then((data) => {
    // organizing data based of limit, offset & ifsc
    const result = organizeData(
      data,
      limit === undefined ? 0 : parseInt(limit),
      offset === undefined ? 0 : parseInt(offset)
    );
    res.send(JSON.stringify(result));
  });
});

app.listen(port, () => {
  console.info("Listing on port " + port);
});
