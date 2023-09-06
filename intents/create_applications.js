const { usual_number } = require("../intents/format_number");
const Application = require("../models/application");
require("dotenv").config();

const create_applications = async (res, queryResult, user_id) => {
  try {
    const {
      "worktype.original": reason,
      location,
      worktype,
      description = "",
    } = queryResult.outputContexts[1].parameters;

    const app = await Application.findOne({ userId: user_id });

    if (!app) {
      return res.sendStatus(400);
    }

    const maxIdApplication = await Application.findOne().sort({ userId: -1 });
    let newId = "00-01";

    if (maxIdApplication) {
      const currentId = maxIdApplication.userId;
      const parts = currentId.split("-");
      const incrementedNumber = parseInt(parts[1]) + 1;
      newId = `00-${incrementedNumber.toString().padStart(2, "0")}`;
    }

    const requestBody = {
      userId: user_id,
      reason,
      location,
      worktype,
      description,
      status: "1",
      viewing: "0",
    };

    const newApplication = new Application(requestBody);
    await newApplication.save();

    newId = usual_number(newId);

    if (newApplication) {
      res.send({ fulfillmentText: `Ваша заявка №${newId} отправлена` });
    } else {
      res.send({ fulfillmentText: "Ошибка создания заявки, повторите позже" });
    }
  } catch (error) {
    console.error("Ошибка при обращении к базе данных:", error);
    res.sendStatus(500);
  }
};

module.exports = create_applications;
