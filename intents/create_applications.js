const Application = require("../models/application");
const {
  STATUS,
  requestCategoryId,
  requestLocationId,
} = require("../constants/constants");
const axios = require("axios");
require("dotenv").config();
const { struct } = require("pb-util");
const { ContextsClient } = require("@google-cloud/dialogflow").v2;

const createApplication = async (res, queryResult, user_id) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);
  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });
  try {
    const contextToFind = `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`;
    const context = {
      name: contextToFind,
      lifespanCount: 50,
      parameters: {
        ...queryResult.outputContexts.find(
          (context) => context.name === contextToFind
        ).parameters,
      },
    };

    if (context.parameters.description === "") {
      context.parameters.description = context.parameters["worktype.original"];
    }

    const status_id = STATUS.find((item) => item.key === "1")?.oid;
    const RequestLocationId = requestLocationId.find(
      (item) => item.predName === context.parameters.location
    )?.oid;
    const locationStandartName = requestLocationId.find(
      (item) => item.predName === context.parameters.location
    )?.Name;
    const RequestCategoryId = requestCategoryId.find(
      (item) => item.Name === context.parameters.worktype
    )?.oid;

    const newApplication = new Application({
      id: " ",
      yandexId: "1111",
      apartmentId: context.parameters.apartmentId,
      requestLocationId: RequestLocationId,
      requestCategoryId: RequestCategoryId,
      requestSubCategoryId: "65112d8b4db28605ac132b67",
      status_id,
      yandexAddress: `город ${context.parameters.city}, ${context.parameters.address}, ${context.parameters.flat}`,
      dataMessage: `Заявка по адресу: ${context.parameters.city}, ${context.parameters.address}, ${context.parameters.flat}\n\t• местонахождение - ${locationStandartName}\n\t• тип работ - ${context.parameters.worktype}`,
      userMessage: context.parameters.description,
    });
    console.log(newApplication);
    if (
      newApplication.yandexId === undefined ||
      newApplication.apartmentId === undefined ||
      newApplication.requestLocationId === undefined ||
      newApplication.requestCategoryId === undefined ||
      newApplication.status_id === undefined
    ) {
      return res.send({
        fulfillmentText: "Ошибка создания заявки, повторите позднее",
      });
    } else {
      res.send({
        fulfillmentText: `Ваша заявка отправлена!\nДля того чтобы узнать номер заявки напишите или произнесите "Покажи статус последней заявки".`,
      });

      await newApplication.save();

      const applicationToSend = {
        ...newApplication.toObject(),
        id: undefined,
        status_id: undefined,
        yandexAddress: undefined,
      };
      const parameters = {
        description: "",
      };
      const request = {
        context: {
          name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
          parameters: struct.encode(parameters),
          lifespanCount: 50,
        },
      };
      await contextsClient.updateContext(request);
      const response = await axios.post(
        process.env.CREATE_APPLICATION_URL,
        applicationToSend
      );

      const requestId = String(response.data.requestId);
      await Application.updateOne(
        { _id: newApplication._id },
        { id: requestId }
      );
    }
  } catch (error) {
    console.error("Ошибка:", error);
    return res.sendStatus(500);
  }
};

module.exports = createApplication;
