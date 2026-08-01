const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://mentors-hub-nine.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", routes);

module.exports = app;
