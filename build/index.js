"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db/db");
const port = 3500;
const express = require("express");
const app = express();
function organizeData(data, limit, offset) {
    {
        // @ts-ignore
        data.sort((a, b) => {
            if (a.ifsc < b.ifsc)
                return -1;
            if (a.ifsc > b.ifsc)
                return 1;
            return 0;
        });
        if ((limit === 0 && offset === 0) || offset >= data.length) {
            return data;
        }
        else if (offset === 0) {
            return data.slice(0, limit);
        }
        else if (limit === 0) {
            return data.slice(offset, data.length);
        }
        else {
            return data.slice(offset, offset + limit);
        }
    }
}
app.get("/api/branches", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const text = (_a = req.query.q) === null || _a === void 0 ? void 0 : _a.toString();
    const limit = (_b = req.query.limit) === null || _b === void 0 ? void 0 : _b.toString();
    const offset = (_c = req.query.offset) === null || _c === void 0 ? void 0 : _c.toString();
    // handling query error
    if (!text) {
        res.status(400).send(`invalid query parameter`);
        return;
    }
    else if (limit !== undefined && !parseInt(limit) && parseInt(limit) < 0) {
        res.status(400).send(`invalid limit parameter`);
        return;
    }
    else if (offset !== undefined &&
        !parseInt(offset) &&
        parseInt(offset) < 0) {
        res.status(400).send(`invalid offset parameter`);
        return;
    }
    yield (0, db_1.getAllMatchedData)(text).then((data) => {
        const result = organizeData(data, limit === undefined ? 0 : parseInt(limit), offset === undefined ? 0 : parseInt(offset));
        res.send(JSON.stringify(result));
    });
}));
app.get("/api/branches/autocomplete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    const text = (_d = req.query.q) === null || _d === void 0 ? void 0 : _d.toString();
    const limit = (_e = req.query.limit) === null || _e === void 0 ? void 0 : _e.toString();
    const offset = (_f = req.query.offset) === null || _f === void 0 ? void 0 : _f.toString();
    // handling query error
    if (!text) {
        res.status(400).send(`invalid query parameter`);
        return;
    }
    else if (limit !== undefined && !parseInt(limit) && parseInt(limit) < 0) {
        res.status(400).send(`invalid limit parameter`);
        return;
    }
    else if (offset !== undefined &&
        !parseInt(offset) &&
        parseInt(offset) < 0) {
        res.status(400).send(`invalid offset parameter`);
        return;
    }
    // getting data from database
    yield (0, db_1.getData)(text).then((data) => {
        // organizing data based of limit, offset & ifsc
        const result = organizeData(data, limit === undefined ? 0 : parseInt(limit), offset === undefined ? 0 : parseInt(offset));
        res.send(JSON.stringify(result));
    });
}));
app.listen(port, () => {
    console.info("Listing on port " + port);
});
