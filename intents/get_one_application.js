require("dotenv").config();
const Application = require("../models/application");
const { STATUS } = require("../constants/constants");
const { usual_number } = require("../intents/format_number");

const get_one_application = async (res, queryResult, user_id) => {
  try {
    const user = await Application.findOne({ userId: user_id });

    if (!user || !user.applications || user.applications.length === 0) {
      return res.sendStatus(400);
    }

    const status = queryResult.outputContexts[0].parameters["status"];
    const statusValue = STATUS.find(
      (status_id) => status_id.key === status
    )?.Name;

    let fulfillmentText = "";

    user.applications.forEach((app) => {
      if (app.status === status && app.viewing === "0") {
        const key = usual_number(app._id);
        const address = app.address.join(", ");
        fulfillmentText += `Заявка под номером ${key}, со статусом: ${statusValue}, по адресу: ${address}\n`;
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
