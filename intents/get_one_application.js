const Application = require("../models/application");
const { STATUS } = require("../constants/constants");
const { usual_number } = require("../intents/format_number");
require("dotenv").config();

const get_one_application = async (res, queryResult, user_id) => {
  try {
    const user = await Application.find({ yandexId: user_id });

    if (!user || user.length === 0) {
      return res.sendStatus(400);
    }

    const status = queryResult.outputContexts[0].parameters["status"];
    const statusId = STATUS.find(
      (status_id) => status_id.key === status
    )?.oid;
    console.log(statusId);
    const statusName = STATUS.find(
      (status_id) => status_id.key === status
    )?.Name;

    let fulfillmentText = "";

    user.forEach((app) => {
      if (app.status_id === statusId) {
        const key = usual_number(app._id);
        fulfillmentText += `Заявка под номером ${key}, со статусом: ${statusName}, по адресу: ${app.yandexAddress}\n.`;
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

module.exports = get_one_application;
