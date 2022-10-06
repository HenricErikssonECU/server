// uppkoppling mot postgres-databas

const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: 'XXXXXXXX',
    host: "localhost",
    port: 5432,
    database: "pernblog"
});

module.exports = pool;
