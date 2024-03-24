// Импортируем необходимые модули и функции
import dotenv from "dotenv"
import { STATUS } from "../../constants/constants.js"
import Application from "../../models/application.js"
import { usual_number } from "../../utils/format_number.js"

dotenv.config();

const get_one_application = async (res, queryResult, user_id) => {
  try {
    const application = await Application.find({ yandexId: user_id });

    if (!application || application.length === 0) {
      return res.sendStatus(400);
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

// Экспортируем функцию
export default get_one_application;
