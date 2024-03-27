import Application from "../models/Application.js";
import { format_number_app } from "../intents/format_number.js";
import { STATUS } from "../constants/constants.js";
import dotenv from "dotenv";
dotenv.config();

export const get_specific_application = async (res, queryResult, user_id) => {
  try {
    let number = queryResult.outputContexts[0].parameters["number"];

    const application = await Application.find({ yandexId: user_id });

    if (!application || application.length === 0) {
      return res.sendStatus(404);
    }

    let appResult = null;

    if (Number.isInteger(number)) {
      number = format_number_app(number);
      appResult = application.find((app) => app.id === number);
    } else {
      const data = application.map((app) => app.yandexId);
      if (number === "last" || data.length === 1) {
        number = data.length - 1;
        appResult = application[number];
      } else if (number === "penultimate" && data.length !== 1) {
        number = data.length - 2;
        appResult = application[number];
      }
    }

    if (!appResult) {
      return res.sendStatus(400);
    }

    const statusValue = STATUS.find(
      (status_id) => status_id.oid === appResult.status_id
    )?.Name;

    res.send({
      fulfillmentText: `Статус заявки: ${statusValue}.\n ${appResult.dataMessage}.`,
    });
  } catch (error) {
    console.error(
      "Ошибка при получении данных о заявках из базы данных:",
      error
    );
    res.send({ fulfillmentText: "Приношу извинения. Ошибка сервера." });
  }
};
