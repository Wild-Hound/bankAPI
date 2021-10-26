import knex from "knex";

export const db = knex({
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
    afterCreate: function (conn: any, done: any) {
      // in this example we use pg driver's connection API
      conn.query('SET timezone="UTC";', function (err: any) {
        if (err) {
          // first query failed, return error and don't try to make next query
          done(err, conn);
        } else {
          // do the second query...
          conn.query("SELECT set_limit(0.01);", function (err: any) {
            // if err is not falsy, connection is discarded from pool
            // if connection aquire was triggered by a query the error is passed to query promise
            done(err, conn);
          });
        }
      });
    },
  },
});

export function getData(branchName: string) {
  const results = db("branches")
    .select("*")
    .where("branch", "like", `%${branchName}%`);
  //   console.log(results);
  return results;
}
