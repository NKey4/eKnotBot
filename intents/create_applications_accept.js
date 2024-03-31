import { ContextsClient } from "@google-cloud/dialogflow";
import ApplicationModel from "../models/Application.js";
import {
  STATUS,
  requestCategoryId,
  requestLocationId,
} from "../constants/constants.js";
import CounterModel from "../models/Counter.js";
import { struct } from "pb-util";
import dotenv from "dotenv";
dotenv.config();

export const create_applications_accept = async (
  res,
  queryResult,
  yandex_id,
  user_id
) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);
  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });

  try {
    console.log(queryResult.outputContexts);
    let context = queryResult.outputContexts[2].parameters;
    const number = context.number;
    if (!context.description) {
      context.description = context["worktype.original"];
    }
    const status_id = STATUS.find((item) => item.key === "1")?.oid;
    const RequestLocationId = requestLocationId.find(
      (item) => item.predName === context.location
    )?.oid;
    const locationStandartName = requestLocationId.find(
      (item) => item.predName === context.location
    )?.Name;
    const RequestCategoryId = requestCategoryId.find(
      (item) => item.Name === context.worktype
    )?.oid;
    let counter = await CounterModel.findOneAndUpdate(
      { id: "autoval" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    let seqId;
    if (!counter) {
      const newval = new CounterModel({ id: "autoval", seq: 1 });
      await newval.save();
      seqId = 1;
    } else {
      seqId = counter.seq;
    }

    const applicationToSend = {
      id: seqId,
      user: user_id,
      address: context.addresses[number - 1]._id,
      requestLocationId: RequestLocationId,
      requestCategoryId: RequestCategoryId,
      requestSubCategoryId: "65112d8b4db28605ac132b67",
      dataMessage: `Заявка по адресу: ${context.addresses[number - 1].city}, ${
        context.addresses[number - 1].street
      }\n\t• местонахождение - ${locationStandartName}\n\t• тип работ - ${
        context.worktype
      }`,
      userMessage: context.description,
      status_id: "660087e06c58241f9b026704",
    };
    console.log(applicationToSend);
    if (
      applicationToSend.user === undefined ||
      applicationToSend.address === undefined ||
      applicationToSend.requestLocationId === undefined ||
      applicationToSend.requestCategoryId === undefined
    ) {
      return res.send({
        fulfillmentText: "Ошибка создания заявки, повторите позднее.",
      });
    } else {
      res.send({
        fulfillmentText: `Ваша заявка отправлена!\n Для того чтобы узнать номер заявки напишите или произнесите "Покажи статус последней заявки".`,
      });
      const newApplication = new ApplicationModel(applicationToSend);
      await newApplication.save();
    }
  } catch (error) {
    res.send({
      fulfillmentText: "Дом ни к какой организации не прикреплён",
    });

    console.error("Ошибка:", error);
  }
};
