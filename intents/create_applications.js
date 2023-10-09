const Application = require("../models/application");
const {
  STATUS,
  requestCategoryId,
  requestLocationId,
} = require("../constants/constants");
const axios = require("axios");
require("dotenv").config();

const createApplication = async (res, queryResult, user_id) => {
  try {
    const contextToFind = `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`;
    let {
      "worktype.original": reason,
      location,
      worktype,
      description = "",
    } = queryResult.outputContexts[1].parameters;

    const context = {
      name: contextToFind,
      lifespanCount: 50,
      parameters: {
        ...queryResult.outputContexts.find(
          (context) => context.name === contextToFind
        ).parameters,
      },
    };

    const latestApplication = await Application.findOne({
      yandexId: "1111",
    }).sort({ id: -1 });
    const newId = latestApplication
      ? `00-${(parseInt(latestApplication.id.split("-")[1]) + 1)
          .toString()
          .padStart(2, "0")}`
      : "00-01";
    if (description === "") {
      description = reason;
    }

    const status_id = STATUS.find((item) => item.key === "1")?.oid;
    const RequestLocationId = requestLocationId.find(
      (item) => item.predName === location
    )?.oid;
    const locationStandartName = requestLocationId.find(
      (item) => item.predName === location
    )?.Name;
    const RequestCategoryId = requestCategoryId.find(
      (item) => item.Name === worktype
    )?.oid;

    const newApplication = new Application({
      id: newId,
      yandexId: "1111",
      apartmentId: context.parameters.apartmentId,
      requestLocationId: RequestLocationId,
      requestCategoryId: RequestCategoryId,
      requestSubCategoryId: "65112d8b4db28605ac132b67",
      status_id,
      yandexAddress: `город ${context.parameters.city}, ${context.parameters.address}, ${context.parameters.flat}`,
      dataMessage: `Заявка по адресу: ${context.parameters.city}, ${context.parameters.address}, ${context.parameters.flat}\n\t• местонахождение - ${locationStandartName}\n\t• тип работ - ${worktype}`,
      userMessage: description,
    });

    await newApplication.save();

    const applicationToSend = {
      ...newApplication.toObject(),
      id: undefined,
      status_id: undefined,
      yandexAddress: undefined,
    };

    const response = await axios.post(
      process.env.CREATE_APPLICATION_URL,
      applicationToSend
    );

    if (newApplication) {
      res.send({
        fulfillmentText: `Ваша заявка №${newId} отправлена`,
        outputContexts: [context],
      });
    } else {
      res.send({
        fulfillmentText: "Ошибка создания заявки, повторите позднее",
      });
    }
  } catch (error) {
    console.error("Ошибка:", error);
    res.sendStatus(500);
  }
};

module.exports = createApplication;
