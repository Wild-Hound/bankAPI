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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMatchedData = exports.getData = exports.db = void 0;
const knex_1 = __importDefault(require("knex"));
exports.db = (0, knex_1.default)({
    client: "pg",
    connection: {
        host: "b58i9vnhmikmmrhiaiin-postgresql.services.clever-cloud.com",
        port: 5432,
        user: "u5fcsboyuadfk8d2eeik",
        password: "S3V5US89iebz26jfqAQ7",
        database: "b58i9vnhmikmmrhiaiin",
    },
    pool: {
        min: 0,
        max: 7,
        afterCreate: function (conn, done) {
            // in this example we use pg driver's connection API
            conn.query('SET timezone="UTC";', function (err) {
                if (err) {
                    // first query failed, return error and don't try to make next query
                    done(err, conn);
                }
                else {
                    // do the second query...
                    conn.query("SELECT set_limit(0.01);", function (err) {
                        // if err is not falsy, connection is discarded from pool
                        // if connection aquire was triggered by a query the error is passed to query promise
                        done(err, conn);
                    });
                }
            });
        },
    },
});
function getData(branchName) {
    const results = (0, exports.db)("branches")
        .select("*")
        .where("branch", "like", `%${branchName}%`);
    // .offset(10)
    // .limit(20);
    return results;
}
exports.getData = getData;
function getAllMatchedData(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const branchRes = yield (0, exports.db)("branches")
            .select("*")
            .where({ branch: text })
            .then((res) => res);
        const addressRes = yield (0, exports.db)("branches")
            .select("*")
            .where({ branch: text })
            .then((res) => res);
        const cityRes = yield (0, exports.db)("branches")
            .select("*")
            .where({ city: text })
            .then((res) => res);
        const districtRes = yield (0, exports.db)("branches")
            .select("*")
            .where({ district: text })
            .then((res) => res);
        const stateRes = yield (0, exports.db)("branches")
            .select("*")
            .where({ state: text })
            .then((res) => res);
        const results = [
            ...branchRes,
            ...addressRes,
            ...cityRes,
            ...districtRes,
            ...stateRes,
        ];
        const filteredResults = [];
        const tempArray = [];
        results.forEach((data) => {
            if (!tempArray.includes(data.bank_id)) {
                tempArray.push(data.bank_id);
                filteredResults.push(data);
            }
        });
        return filteredResults;
    });
}
exports.getAllMatchedData = getAllMatchedData;
