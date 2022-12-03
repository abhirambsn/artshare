import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
config();

const app = express();
const host = "0.0.0.0";
const port = process.env.PORT || 5000;

app.use(express.json());

import authRoutes from "./routes/auth.js";
import articleRoutes from "./routes/article.js";

app.use("/auth", authRoutes);
app.use("/article", articleRoutes);

app.get("/", (req, res) => {
  return res.status(200).send({ message: "API is Working :)" });
});

mongoose.connect(process.env.MONGO_URI, (err) => {
  if (!err) {
    console.log("MongoDB Connected");
    app.listen(port, () => {
      console.log(`Backend Started at http://localhost:${port}`);
    });
  }
});
