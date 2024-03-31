import dialogflow from "@google-cloud/dialogflow";
import detectIntent from "../df.js";
import { struct } from "pb-util";
import dotenv from "dotenv";
dotenv.config();
const { ContextsClient } = dialogflow.v2beta1;
export const create_applications = async (res, queryResult, yandex_id) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);
  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });

  try {
    const response = await contextsClient.getContext({
      name: `projects/eknot-ktdq/agent/sessions/${yandex_id}/contexts/logincheck`,
    });

    const contextParameters = struct.decode(response[0].parameters);
    const addresses = contextParameters.addresses;

    if (addresses && addresses.length > 0) {
      let fulfillmentText = "Назовите цифру относящееся к квартире:\n";
      addresses.forEach((address, index) => {
        fulfillmentText += `${index + 1}: г. ${address.city}, ${
          address.street
        }\n`;
      });

      res.send({
        fulfillmentText,
      });
    } else {
      res.send({
        fulfillmentText: "Адреса не найдены.",
      });
    }
  } catch (error) {
    console.error("Ошибка:", error);
  }
};
