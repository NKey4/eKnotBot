import dotenv from "dotenv";
dotenv.config();

export const create_applications_confirm = async (
  res,
  queryResult,
  yandex_id
) => {
  const contextToFind = `projects/eknot-ktdq/agent/sessions/${yandex_id}/contexts/logincheck`;
  let {
    "worktype.original": reason,
    location,
    worktype,
    description,
    addresses,
    number,
  } = queryResult.outputContexts[5].parameters;

  location = location.toLowerCase();
  const address = addresses[number - 1];
  const addressText = `город ${address.city}, ${address.street}`;
  const descriptionText = description ? ` Подробности: ${description}.` : "";

  const fulfillmentText = `Желаете подать заявку, что у Вас ${location} ${reason}.${descriptionText} Адрес: ${addressText}. Подтвердите, пожалуйста.\nПри неточностях, опишите заново.`;

  res.send({ fulfillmentText });
};
