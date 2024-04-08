import dialogflow from "@google-cloud/dialogflow";
const { ContextsClient } = dialogflow.v2beta1;
import { struct } from "pb-util";
import User from "../../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const comeback_intent = async (res, queryResult, yandex_id) => {
  const { project_id, private_key, client_email } = JSON.parse(
    process.env.CREDENTIALS
  );

  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });

  try {
    const user = await User.findOne({ yandex_id }).populate("addresses");
    const addresses = user.addresses.map((address) => address.toObject());
    const parameters = {
      addresses: addresses.map(({ _id, city, street }) => ({
        _id: _id.toString(),
        city,
        street,
      })),
    };

    contextsClient.createContext({
      parent: `projects/eknot-ktdq/agent/sessions/${yandex_id}`,
      context: {
        name: `projects/eknot-ktdq/agent/sessions/${yandex_id}/contexts/logincheck`,
        parameters: struct.encode(parameters),
        lifespanCount: 50,
      },
    });

    res.send({
      fulfillmentText: "С возвращением " + user.fullName,
    });
  } catch (error) {
    console.error("Server error (comeback_intent):", error);
    res.send({
      fulfillmentText: "Ошибка сервера",
    });
  }
};
