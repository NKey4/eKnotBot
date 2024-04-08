import { v2 as dialogflow } from "@google-cloud/dialogflow";
import ApplicationModel from "../../models/Application.js";
import UserModel from "../../models/User.js";
import CounterModel from "../../models/Counter.js";
import { struct } from "pb-util";
import {
  STATUS,
  requestCategoryId,
  requestLocationId,
} from "../../constants/constants.js";
import dotenv from "dotenv";

dotenv.config();

const { ContextsClient } = dialogflow;

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
    const response = await contextsClient.getContext({
      name: `projects/eknot-ktdq/agent/sessions/${yandex_id}/contexts/logincheck`,
    });

    const context = struct.decode(response[0].parameters);
    console.log(context);
    let description = null;
    if (!context.description) {
      description = context["worktype.original"];
    } else {
      description = context.description;
    }
    console.log(context.description);
    const user = await UserModel.findOne({ yandex_id }).populate("addresses");
    if (!user || !user.addresses.length) {
      return res
        .status(400)
        .json({ fulfillmentText: "Ошибка сервера (отсутствие адресов)" });
    }

    const locationInfo = requestLocationId.find(
      (item) => item.Name === context.location
    );
    const categoryInfo = requestCategoryId.find(
      (item) => item.Name === context.worktype
    );
    console.log(locationInfo);
    console.log(categoryInfo);

    const addressIndex =
      user.addresses.length > 1
        ? Math.max(0, context.numberFlat.numberValue - 1)
        : 0;
    const selectedAddress = user.addresses[addressIndex];
    const [streetName, flatNumber] = selectedAddress.street.split(", ");

    const seqId = (
      await CounterModel.findOneAndUpdate(
        { id: "autoval" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      )
    ).seq;
    const status_id = STATUS.find((item) => item.key === "1")?.oid;
    const applicationToSend = {
      id: seqId,
      user: user_id,
      address: selectedAddress._id,
      requestLocationId: locationInfo?.oid,
      requestCategoryId: categoryInfo?.oid,
      requestSubCategoryId: context["worktype.original"],
      dataMessage: `Заявка по адресу: город ${selectedAddress.city}, улица ${streetName}, квартира ${flatNumber}\n\t• местонахождение - ${locationInfo?.Name};\n\t• тип работ - ${context.worktype}.`,
      userMessage: `${description}.`,
      status_id,
    };

    if (Object.values(applicationToSend).some((value) => value === undefined)) {
      throw new Error("Некоторые обязательные поля не определены");
    }

    await new ApplicationModel(applicationToSend).save();
    res.send({
      fulfillmentText: `Ваша заявка отправлена!\nДля того чтобы узнать номер заявки напишите или произнесите "Покажи статус последней заявки".`,
    });

    contextsClient.updateContext({
      context: {
        name: `projects/eknot-ktdq/agent/sessions/${yandex_id}/contexts/logincheck`,
        lifespanCount: 50,
      },
    });
  } catch (error) {
    console.error(error);
    res.send({ fulfillmentText: "Проблемы с сервером." });
  }
};
