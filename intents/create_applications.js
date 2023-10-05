const Application = require("../models/application");
const { STATUS, requestCategoryId, requestLocationId } = require("../constants/constants");
require("dotenv").config();

const create_applications = async (res, queryResult, user_id) => {
  try {
    const contextToFind = `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`;
    const {
      "worktype.original": reason,
      location,
      worktype,
      description = "",
      city,
      apartmentId,
      address,
      flat,
    } = queryResult.outputContexts.find(context => context.name === contextToFind).parameters;

    console.log(queryResult.outputContexts.find(context => context.name === contextToFind));
    console.log(apartmentId);
    const latestApplication = await Application.findOne().sort({ _id: -1 });
    const newId = latestApplication
      ? `00-${(parseInt(latestApplication._id.split("-")[1]) + 1)
          .toString()
          .padStart(2, "0")}`
      : "00-01";
    /*if (description === "") {
      description = reason;
    }*/

    const status_id = STATUS.find((item) => item.key === "1")?.oid;
    const RequestLocationId = requestLocationId.find(
      (item) => item.Name === location
    )?.oid;
    const locationStandartName = requestLocationId.find(
      (item) => item.Name === location
    )?.Name;
    const RequestCategoryId = requestCategoryId.find(
      (item) => item.Name === worktype
    )?.oid;

    const newApplication = new Application({
      _id: newId,
      yandexId: "1111",
      apartmentId:apartmentId,
      requestLocationId: RequestLocationId,
      requestCategoryId: RequestCategoryId,
      requestSubCategoryId: "65112d8b4db28605ac132b67",
      status_id,
      dataMessage: `Заявка по адресу: ${city}, ${address}, ${flat}\n\t• местонахождение - ${locationStandartName}\n\t• тип работ - ${worktype}`,
      userMessage: description,
    });

    await newApplication.save();
    try {
      const applicationToSend = { ...newApplication };
      delete applicationToSend._id;
      delete applicationToSend.status_id;
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