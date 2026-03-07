import express from "express";

const app = express();

app.use(express.json())

app.get("/", (req, res) => {
  res.send("welcome to smart rest")
})

app.listen(3000, () => console.log("working on http://localhost:3000"))