require("dotenv").config();
const Application = require("../models/application");

const delete_applications = async (res, queryResult, user_id) => {
  try {
    const numberApp = queryResult.outputContexts[0].parameters["number"];

    const app = await Application.findOne({ yandexId: user_id });

    if (!app) {
      return res.sendStatus(400);
    }

    let digitsOnly = numberApp.replace(/\D/g, "");
    if (digitsOnly.length === 4) {
      digitsOnly = digitsOnly.replace(/(\d{2})(\d{2})/, "$1-$2");
    } else {
      return res.send({ fulfillmentText: "Некорректный номер заявки." });
    }

    // Обновление статуса заявки
    await Application.findOneAndUpdate({ yandexId: user_id }, { status: "6" });

    res.send({ fulfillmentText: `Заявка под №${numberApp} отменена` });
  } catch (error) {
    console.error("Ошибка при удалении заявки из базы данных:", error);
    res.send({ fulfillmentText: "Приношу извинения. Ошибка сервера." });
  }
};

module.exports = delete_applications;
