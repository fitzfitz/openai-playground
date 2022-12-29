const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/ask-fitz", require("./route/openAiRoutes"));

app.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});

module.exports = app;
