require("dotenv").config();
const Application = require("../models/application");
const { format_number_app } = require("../intents/format_number");
const { STATUS } = require("../constants/constants");

const get_specific_application = async (res, queryResult, user_id) => {
  try {
    let number = queryResult.outputContexts[0].parameters["number"];

    const user = await Application.findOne({ userId: user_id });

    if (!user || !user.applications || user.applications.length === 0) {
      return res.sendStatus(400);
    }

    if (Number.isInteger(number)) {
      number = format_number_app(number);
    } else {
      const data = user.applications.map((app) => app._id);
      if (number === "last") {
        number = format_number_app(data.length);
      } else if (number === "penultimate") {
        number = format_number_app(data.length - 1);
      }
    }

    const appResult = user.applications.find((app) => app._id === number);

    if (!appResult) {
      return res.sendStatus(400);
    }

    const statusValue = STATUS.find(
      (status_id) => status_id.key === appResult.status
    )?.value;
    res.send({ fulfillmentText: `Статус заявки: ${statusValue}` });
  } catch (error) {
    console.error(
      "Ошибка при получении данных о заявках из базы данных:",
      error
    );
    res.send({ fulfillmentText: "Приношу извинения. Ошибка сервера." });
  }
};

module.exports = get_specific_application;
