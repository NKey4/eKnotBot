import { v2 as dialogflow } from "@google-cloud/dialogflow";
import dotenv from "dotenv";
import UserModel from "../../models/User.js";

dotenv.config();
const { ContextsClient } = dialogflow;

export const create_applications_init = async (
  res,
  queryResult,
  yandex_id,
  user_id
) => {
  const { private_key, client_email, project_id } = JSON.parse(
    process.env.CREDENTIALS
  );
  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });

  try {
    console.log(yandex_id);
    const user = await UserModel.findOne({ yandex_id })
      .populate("addresses")
      .exec();
    if (!user || !user.addresses.length) {
      return res.send({
        fulfillmentText: "Пользователь ни к одной организации не прикреплен",
      });
    }

    let message = "";
    let contextName = "";
    if (user.addresses.length > 1) {
      message =
        user.addresses
          .map(
            (address, index) =>
              `${index + 1}. Город ${address.city}, улица ${
                address.street.split(",")[0]
              }, квартира ${address.street.split(",")[1]}`
          )
          .join(";\n") + "\nДля того чтобы выбрать адрес назовите цифру.";
      contextName = "choiceFlat";
    } else {
      message = "Желаете рассказать подробности?";
      contextName = "defAddress";
    }

    contextsClient.createContext({
      parent: `projects/${project_id}/agent/sessions/${yandex_id}`,
      context: {
        name: `projects/${project_id}/agent/sessions/${yandex_id}/contexts/${contextName}`,
        lifespanCount: 1,
      },
    });

    res.send({ fulfillmentText: message });
  } catch (error) {
    console.error("Ошибка при обращении к базе данных:", error);
    res.sendStatus(500);
  }
};
