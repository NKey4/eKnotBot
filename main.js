const express = require("express");
const aliceRouter = require("./routes/yandex");
const aliceRouter1 = require("./routes/yandex-dialogs");
const dialogFlowrouter = require("./routes/dialogflow");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log("MongoDB подключен"))
  .catch((err) => console.log(`Ошибка подключения к бд: ${err}`));

app.listen(3000, () => console.log("Сервер запущен на 3000 порту"));

app.use("/", aliceRouter1);
app.use("/webhook", dialogFlowrouter);
