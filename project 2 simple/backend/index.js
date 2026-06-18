const express = require("express");
const cors = require("cors");
const getConnection = require("./db");
const oracledb = require("oracledb");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/add-student", async (req, res) => {
  const { name, email } = req.body;

  try {
    const connection = await getConnection();

    await connection.execute(
      "INSERT INTO students (name, email) VALUES (:name, :email)",
      { name, email },
      { autoCommit: true }
    );

    await connection.close();

    res.json({ message: "Student added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Oracle DB Error" });
  }
});

// FIXED: Return objects, not arrays
app.get("/students", async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      "SELECT id, name, email FROM students",
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await connection.close();

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Oracle DB Error" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});