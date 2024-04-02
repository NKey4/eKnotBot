import Application from "../models/Application.js";
import { STATUS } from "../constants/constants.js";
import { usual_number } from "../intents/format_number.js";
import dotenv from "dotenv";
dotenv.config();

export const get_one_application = async (res, queryResult, yandex_id) => {
  try {
    const application = await Application.find({ yandexId: yandex_id });

    if (!application || application.length === 0) {
      return res.send({
        fulfillmentText: "Заявки не найдены",
      });
    }

    const status = queryResult.outputContexts[0].parameters["status"];
    const statusId = STATUS.find((status_id) => status_id.key === status)?.oid;
    const statusName = STATUS.find(
      (status_id) => status_id.key === status
    )?.Name;

    let fulfillmentText = "";

    application.forEach((app) => {
      if (app.status_id === statusId) {
        const key = usual_number(app.id);
        fulfillmentText += `Заявка под номером ${key}, со статусом: ${statusName}.`;
      }
    });

    res.send({ fulfillmentText });
  } catch (error) {
    console.error(
      "Ошибка при получении данных о заявках из базы данных:",
      error
    );
    res.send({ fulfillmentText: "Приношу извинения. Ошибка сервера." });
  }
};
