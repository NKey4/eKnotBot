const Application = require("../models/application");
const { format_number } = require("../intents/format_number");

const create_applications = async (res, queryResult, user_id) => {
  try {
    const {
      "worktype.original": reason,
      location,
      worktype,
      description = "",
    } = queryResult.outputContexts[1].parameters;

    const latestApplication = await Application.findOne().sort({ _id: -1 });
    const newId = latestApplication
      ? `00-${(parseInt(latestApplication._id.split("-")[1]) + 1)
          .toString()
          .padStart(2, "0")}`
      : "00-01";

    console.log(newId);

    const newApplication = new Application({
      _id: newId,
      yandex_id: user_id,
      reason,
      location,
      worktype,
      description,
      status: "1",
      viewing: "0",
    });

    await newApplication.save();

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
