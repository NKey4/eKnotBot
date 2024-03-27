import { ContextsClient } from "@google-cloud/dialogflow";
import { struct } from "pb-util";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const comeback_intent = async (res, queryResult, user_id) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);

  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });

  try {
    const user = await User.findOne({ yandexId: user_id });

    res.send({
      fulfillmentText: "С возвращением " + user.fullName,
    });

    const parameters = {
      // city: response.data[0].city,
      // apartmentId: response.data[0].houses[1].apartmentRoles[0].apartmentId,
      address: user.address,
      // flat: response.data[0].houses[1].apartmentRoles[0].name,
      // data: response.data,
    };

    const request = {
      parent: `projects/eknot-ktdq/agent/sessions/${user_id}`,
      context: {
        name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
        parameters: struct.encode(parameters),
        lifespanCount: 50,
      },
    };

    await contextsClient.createContext(request);
  } catch (error) {
    console.error("Server error (comeback_intent):", error);
    return res.sendStatus(500);
  }
};
