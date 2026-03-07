import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to smart rest");
});

app.listen(PORT, () => console.log(`working on http://localhost:${PORT}`));
