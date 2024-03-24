// Импорт необходимых модулей через ES6 import
import express from "express";
import aliceRouter from "./routes/yandex-dialogs.js";
import dialogFlowRouter from "./routes/dialogflow.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Инициализация dotenv для использования переменных окружения из файла .env
dotenv.config();

// Создание экземпляра приложения
const app = express();

// Middleware для разбора JSON и urlencoded тел запросов
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка роутеров
app.use("/", aliceRouter);
app.use("/webhook", dialogFlowRouter);

async function start(){
    try{
      // Подключение к MongoDB
      await mongoose
      .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => console.log("MongoDB подключен"))
      .catch((err) => console.log(`Ошибка подключения к бд: ${err}`));

      // Запуск сервера
      app.listen(3000, () => console.log("Сервер запущен на 3000 порту"));
    } catch(error){
        console.log(error)
    }
}

start()