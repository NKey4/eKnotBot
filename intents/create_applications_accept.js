import ApplicationModel from "../models/Application.js";
import {
  STATUS,
  requestCategoryId,
  requestLocationId,
} from "../constants/constants.js";
import CounterModel from "../models/Counter.js";
import dotenv from "dotenv";
dotenv.config();

export const create_applications_accept = async (
  res,
  queryResult,
  yandex_id,
  user_id
) => {
  try {
    const context = queryResult.outputContexts[2].parameters;
    const {
      number,
      description = context["worktype.original"],
      addresses,
      location,
      worktype,
    } = context;

    const RequestLocationId = requestLocationId.find(
      (item) => item.predName === location
    )?.oid;
    const RequestCategoryId = requestCategoryId.find(
      (item) => item.Name === worktype
    )?.oid;
    const seqId = (
      await CounterModel.findOneAndUpdate(
        { id: "autoval" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      )
    ).seq;
    const address = addresses[number - 1];

    const applicationToSend = {
      id: seqId,
      user: user_id,
      address: address._id,
      requestLocationId: RequestLocationId,
      requestCategoryId: RequestCategoryId,
      requestSubCategoryId: context["worktype.original"],
      dataMessage: `Заявка по адресу: ${address.city}, ${address.street}\n\t• местонахождение - ${location}\n\t• тип работ - ${worktype}`,
      userMessage: description,
      status_id: "660087e06c58241f9b026704",
    };

    if (Object.values(applicationToSend).some((value) => value === undefined)) {
      throw new Error("Некоторые обязательные поля не определены");
    }

    await new ApplicationModel(applicationToSend).save();
    res.send({
      fulfillmentText: `Ваша заявка отправлена!\n Для того чтобы узнать номер заявки напишите или произнесите "Покажи статус последней заявки".`,
    });
  } catch (error) {
    console.error("Ошибка:", error);
    res.send({
      fulfillmentText:
        "Произошла ошибка при создании заявки. Пожалуйста, попробуйте снова позже.",
    });
  }
};
