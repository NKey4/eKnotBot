// Импорт необходимых модулей
import { v2 as dialogflow } from '@google-cloud/dialogflow';
import axios from 'axios';
import { struct } from 'pb-util';
import Application from '../../models/application.js';
import { STATUS, requestCategoryId, requestLocationId } from '../../constants/constants.js';
import dotenv from 'dotenv';

dotenv.config();

const { ContextsClient } = dialogflow;

const createApplication = async (res, queryResult, user_id) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);
  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });

  try {
    const contextToFind = `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`;
    const requestContext = {
      name: contextToFind,
    };
    const response = await contextsClient.getContext(requestContext);

    const context = response[0].parameters.fields;

    if (context.description.stringValue === "") {
      context.description.stringValue = context["worktype.original"].stringValue;
    }

    const status_id = STATUS.find((item) => item.key === "1")?.oid;
    const RequestLocationId = requestLocationId.find((item) => item.predName === context.location.stringValue)?.oid;
    const locationStandartName = requestLocationId.find((item) => item.predName === context.location.stringValue)?.Name;
    const RequestCategoryId = requestCategoryId.find((item) => item.Name === context.worktype.stringValue)?.oid;

    const applicationToSend = {
      yandexId: user_id,
      apartmentId: context.apartmentId.stringValue,
      requestLocationId: RequestLocationId,
      requestCategoryId: RequestCategoryId,
      requestSubCategoryId: "65112d8b4db28605ac132b67",
      dataMessage: `Заявка по адресу: ${context.city.stringValue}, ${context.address.stringValue}, ${context.flat.stringValue}\n\t• местонахождение - ${locationStandartName}\n\t• тип работ - ${context.worktype.stringValue}`,
      userMessage: context.description.stringValue,
    };

    if (!applicationToSend.yandexId || !applicationToSend.apartmentId || !applicationToSend.requestLocationId || !applicationToSend.requestCategoryId) {
      return res.send({
        fulfillmentText: "Ошибка создания заявки, повторите позднее.",
      });
    } else {
      res.send({
        fulfillmentText: `Ваша заявка отправлена!\n Для того чтобы узнать номер заявки напишите или произнесите "Покажи статус последней заявки".`,
      });
      const responsePost = await axios.post(process.env.CREATE_APPLICATION_URL, applicationToSend);
      const newApplication = new Application({
        ...applicationToSend,
        id: " ",
        status_id: status_id,
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
      const updateRequest = {
        context: {
          name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
          parameters: struct.encode(parameters),
          lifespanCount: 50,
        },
      };
      await contextsClient.updateContext(updateRequest);

      const requestId = String(responsePost.data.requestId);
      await Application.updateOne({ _id: newApplication._id }, { id: requestId });
    }
  } catch (error) {
    console.error(error);
    res.send({ fulfillmentText: "Дом ни к какой организации не прикреплён" });
  }
};

export default createApplication;
