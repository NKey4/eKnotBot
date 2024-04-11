import dotenv from "dotenv";
import UserModel from "../../models/User.js";
import { struct } from "pb-util";
import { v2 as dialogflow } from "@google-cloud/dialogflow";

dotenv.config();

const { ContextsClient } = dialogflow;

export const create_applications_Confirm = async (
  res,
  queryResult,
  yandex_id,
  user_id
) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);
  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });
  const response = await contextsClient.getContext({
    name: `projects/eknot-ktdq/agent/sessions/${yandex_id}/contexts/logincheck`,
  });

  let context = struct.decode(response[0].parameters);
  console.log(context);

  const user = await UserModel.findOne({ yandex_id: yandex_id }).populate(
    "addresses"
  );
  if (!user || user.addresses.length === 0) {
    return res.send({
      fulfillmentText: "Не удалось найти пользователя или адреса.",
    });
  }
  const addressIndex =
    user.addresses.length > 1 ? Number(context.numberFlat - 1) : 0;
  const userAddress = user.addresses[addressIndex];

  context["worktype.original"] = context["worktype.original"].toLowerCase();

  const addressText = `город ${userAddress.city}, улица ${userAddress.street}, квартира ${userAddress.flat}`;
  const detailsText =
    queryResult.outputContexts[0] &&
    queryResult.outputContexts[0].parameters &&
    queryResult.outputContexts[0].parameters.description
      ? ` Подробности: ${queryResult.outputContexts[0].parameters.description}.`
      : "";
  const message = `Желаете подать заявку, что у Вас ${context["location.original"]} ${context["worktype.original"]}.${detailsText} Адрес: ${addressText}. Подтвердите, пожалуйста.\nПри неточностях, опишите заново.`;

  res.send({ fulfillmentText: message });
};
