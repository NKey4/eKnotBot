import express from "express";
import aliceRouter from "./routes/yandex-dialogs.js";
import dialogFlowRouter from "./routes/dialogflow.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log("MongoDB connected"))
  .catch((err) => console.log(`Error connecting to the database: ${err}`));

app.listen(process.env.PORT || 3000, () =>
  console.log("Server is running on port 3000")
);

app.use("/", aliceRouter);
app.use("/webhook", dialogFlowRouter);
