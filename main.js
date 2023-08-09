const express = require("express");
const aliceRouter = require("./routes/yandex");
const dialogFlowrouter = require("./routes/dialogflow");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", aliceRouter);
app.use("/webhook", dialogFlowrouter);

app.listen(3000, () => console.log("Сервер запущен на 3000 порту"));
