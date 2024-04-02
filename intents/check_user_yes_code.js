import { ContextsClient } from "@google-cloud/dialogflow";
import User from "../models/User.js";
import { struct } from "pb-util";
import { format_number_to_770, format_code } from "../intents/format_number.js";
import dotenv from "dotenv";
dotenv.config();

export const check_user_yes_code = async (res, queryResult, yandex_id) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);

  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });

  const { phoneNumber, code } = queryResult.outputContexts[1].parameters;
  const digitsOnlyPhoneNum = format_number_to_770(phoneNumber);
  const digitsOnly = format_code(code);

  try {
    const user = await User.findOne({
      phoneNumber: digitsOnlyPhoneNum,
    }).populate("addresses");

    if (user.aliceCode === digitsOnly) {
      user.yandexId = yandex_id;
      user.aliceCode = undefined;
      await user.save();
    }

    const parameters = {
      fullName: user.fullName,
      city: user.addresses.city,
      street: user.addresses.street,
    };

    const request = {
      parent: `projects/eknot-ktdq/agent/sessions/${yandex_id}`,
      context: {
        name: `projects/eknot-ktdq/agent/sessions/${yandex_id}/contexts/logincheck`,
        parameters: struct.encode(parameters),
        lifespanCount: 50,
      },
    };

    contextsClient.createContext(request);

    res.send({
      fulfillmentText: "Добро пожаловать " + user.fullName,
    });
  } catch (error) {
    console.error("Server error (check_user_yes_code):", error);
    res.send({
      fulfillmentText: "Ошибка сервера",
    });
  }
};
