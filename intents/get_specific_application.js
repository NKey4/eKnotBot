const Application = require("../models/application");
const { format_number_app } = require("../intents/format_number");
const { STATUS } = require("../constants/constants");
require("dotenv").config();

const get_specific_application = async (res, queryResult, user_id) => {
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
      console.log(data);
      if (number === "last" || data.length === 1) {
        number = data.length-1;
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

module.exports = get_specific_application;
