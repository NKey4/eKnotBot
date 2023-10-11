const { ContextsClient } = require("@google-cloud/dialogflow").v2;
const axios = require("axios");
const { struct } = require("pb-util");
const Application = require("../models/application");
const {
  STATUS,
  requestCategoryId,
  requestLocationId,
} = require("../constants/constants");
require("dotenv").config();

const createApplication = async (res, queryResult, user_id) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);
  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });

  try {
    const contextToFind = `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`;
    const request = {
      name: contextToFind,
    };
    const response = await contextsClient.getContext(request);

    const context = response[0].parameters.fields;

    if (context.description.stringValue === "") {
      context.description.stringValue =
        context["worktype.original"].stringValue;
    }

    const status_id = STATUS.find((item) => item.key === "1")?.oid;
    const RequestLocationId = requestLocationId.find(
      (item) => item.predName === context.location.stringValue
    )?.oid;
    const locationStandartName = requestLocationId.find(
      (item) => item.predName === context.location.stringValue
    )?.Name;
    const RequestCategoryId = requestCategoryId.find(
      (item) => item.Name === context.worktype.stringValue
    )?.oid;

    const applicationToSend = {
      yandexId: user_id,
      apartmentId: context.apartmentId.stringValue,
      requestLocationId: RequestLocationId,
      requestCategoryId: RequestCategoryId,
      requestSubCategoryId: "65112d8b4db28605ac132b67",
      dataMessage: `Заявка по адресу: ${context.city.stringValue}, ${context.address.stringValue}, ${context.flat.stringValue}\n\t• местонахождение - ${locationStandartName}\n\t• тип работ - ${context.worktype.stringValue}`,
      userMessage: context.description.stringValue,
    };

    if (
      applicationToSend.yandexId === undefined ||
      applicationToSend.apartmentId === undefined ||
      applicationToSend.requestLocationId === undefined ||
      applicationToSend.requestCategoryId === undefined
    ) {
      return res.send({
        fulfillmentText: "Ошибка создания заявки, повторите позднее.",
      });
    } else {
      const response = await axios.post(
        process.env.CREATE_APPLICATION_URL,
        applicationToSend
      );
      res.send({
        fulfillmentText: `Ваша заявка отправлена!\n Для того чтобы узнать номер заявки напишите или произнесите "Покажи статус последней заявки".`,
      });
      const newApplication = new Application({
        ...applicationToSend,
        id: " ",
        status_id,
        yandexAddress: `город ${context.city.stringValue}, ${context.address.stringValue}, ${context.flat.stringValue}`,
      });
      await newApplication.save();

      const parameters = {
        apartmentId: context.apartmentId.stringValue,
        city: context.city.stringValue,
        address: context.address.stringValue,
        flat: context.flat.stringValue,
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

      const requestId = String(response.data.requestId);
      await Application.updateOne(
        { _id: newApplication._id },
        { id: requestId }
      );
    }
  } catch (error) {
    const parameters = {
      apartmentId: context.apartmentId.stringValue,
      city: context.city.stringValue,
      address: context.address.stringValue,
      flat: context.flat.stringValue,
      description: "",
    };
    const request = {
      context: {
        name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
        parameters: struct.encode(parameters),
        lifespanCount: 50,
      },
    };
    res.send({
      fulfillmentText: "Дом ни к какой организации не прикреплён",
    });
    await contextsClient.updateContext(request);
    console.error("Ошибка:", error);
  }
};

module.exports = createApplication;
