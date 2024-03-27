import { ContextsClient } from "@google-cloud/dialogflow";
import User from "../models/User.js";

import { struct } from "pb-util";
import { format_number_to_770, format_code } from "../intents/format_number.js";
import dotenv from "dotenv";
dotenv.config();

export const check_user_yes_code = async (res, queryResult, user_id) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);

  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });

  const { phoneNumber, code } = queryResult.outputContexts[1].parameters;
  const digitsOnlyPhoneNum = format_number_to_770(phoneNumber);
  const digitsOnly = format_code(code);

  try {
    const user = await User.findOne({ phoneNumber: digitsOnlyPhoneNum });
    console.log(user);
    if (user.aliceCode === digitsOnly) {
      user.yandexId = user_id;
      user.aliceCode = undefined;
      await user.save();
    }

    const parameters = {
      fullName: user.fullName,
    };

    const request = {
      parent: `projects/eknot-ktdq/agent/sessions/${user_id}`,
      context: {
        name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
        parameters: struct.encode(parameters),
        lifespanCount: 50,
      },
    };

    contextsClient.createContext(request);

    res.send({
      fulfillmentText: "Добро пожаловать " + user.fullName,
    });

    const parameters2 = {
      fullName: user.fullName,
      // city: response_get_address.data[0].city,
      address: user.address,
    };

    const request2 = {
      context: {
        name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
        parameters: struct.encode(parameters2),
        lifespanCount: 50,
      },
    };

    await contextsClient.updateContext(request2);
  } catch (error) {
    console.error("Server error (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
};
