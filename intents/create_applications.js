const Application = require("../models/application");
const { STATUS, WORKTYPE, LOCATION } = require("../constants/constants");

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
    if (description === "") {
      description = reason;
    }

    const status_id = STATUS.find((item) => item.key === "1")?.oid;
    const location_id = LOCATION.find((item) => item.Name === location)?.oid;
    const worktype_id = WORKTYPE.find((item) => item.Name === worktype)?.oid;

    const newApplication = new Application({
      _id: newId,
      yandexId: user_id,
      apartmentId,
      requestLocationId: location_id,
      requestCategoryId: worktype_id,
      requestSubCategoryId,
      dataMessage,
      userMessage,
    });

    await newApplication.save();
    try {
      const applicationToSend = { ...newApplication };
      delete applicationToSend._id;
      const response = await axios.post(
        process.env.CREATE_APPLICATION_URL,
        applicationToSend
      );
      if (newApplication) {
        res.send({ fulfillmentText: `Ваша заявка №${newId} отправлена` });
      } else {
        res.send({
          fulfillmentText: "Ошибка создания заявки, повторите позже",
        });
      }
      console.log(response.data);
    } catch (error) {
      console.error("Ошибка сервера (create_applications):", error);
      return res.sendStatus(500);
    }
  } catch (error) {
    console.error("Ошибка при обращении к базе данных:", error);
    res.sendStatus(500);
  }
};

module.exports = create_applications;
