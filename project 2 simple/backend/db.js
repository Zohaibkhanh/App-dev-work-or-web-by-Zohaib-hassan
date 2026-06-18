const oracledb = require("oracledb");

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function getConnection() {
  return await oracledb.getConnection({
    user: "system",
    password: "dbpro",
    connectString: "localhost/XE"
  });
}

module.exports = getConnection;
