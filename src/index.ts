import { Client } from "pg";
import express from "express";

const app = express();
const PORT = 3001;
app.use(express.json());

const pgClient = new Client("put you neon.tech url");
pgClient.connect();

// or

const pgClient2 = new Client({
    user:"Testing_owner",
        database:"neondb",
        port: 5432,
        host: "ep-delicate-resonance-a86kg228-pooler.eastus2.azure.neon.tech",
        password: "npg_5B0CnoxhluMA",
        ssl:true
})

/*
 * VULNERABLE: SQL Injection possible due to string interpolation
 */
app.post("/login-vulnerable", async (req, res) => {
  const { username, password } = req.body;

  // NEVER do this
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  try {
    const result = await pgClient.query(query);
    if (result.rows.length > 0) {
      res.send("Login successful (vulnerable endpoint)");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).send("Internal server error");
  }
});

/*
 * SAFE: Uses parameterized query to prevent SQL Injection
 */
app.post("/login-safe", async (req, res) => {
    console.log("Incoming request:", req.body);
  const { username, password } = req.body;

  //    Always use placeholders and parameterized queries
  const query = `SELECT * FROM users WHERE username = $1 AND password = $2`;

  try {
    const result = await pgClient.query(query, [username, password]);
    if (result.rows.length > 0) {
      res.send("Login successful (safe endpoint)");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).send("Internal server error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const connect = async ()=>{
    // await pgClient2.connect();
    // const response = await pgClient2.query("select * from users;");

    const insert = await pgClient.query("insert into users(username, email, password) values('Hello0','hello0@gmail','hello0pass');");
    console.log(insert);
    const response = await pgClient.query("select * from users;");
    console.log(response.rows);
}