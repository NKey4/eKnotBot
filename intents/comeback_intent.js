const { ContextsClient } = require("@google-cloud/dialogflow").v2;
const axios = require("axios");
const { struct } = require("pb-util");
require("dotenv").config();

const comeback_intent = async (res, queryResult, user_id) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);

  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });
  try {
    res.send({
      fulfillmentText: `С возвращением!\n Для того чтобы ознакомиться с функциями бота произнесите или напишите "Помощь".`,
    });
    const response = await axios.get(
      process.env.GET_ADDRESS_URL + "?YandexId=" + `${user_id}`
    );
    const parameters = {
      city: response.data[0].city,
      apartmentId: response.data[0].houses[0].apartmentRoles[0].apartmentId,
      address: response.data[0].houses[0].address,
      flat: response.data[0].houses[0].apartmentRoles[0].name,
    };
    const request = {
      parent: `projects/eknot-ktdq/agent/sessions/${user_id}`,
      context: {
        name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
        parameters: struct.encode(parameters),
        lifespanCount: 50,
      },
    };

    const respons1e = await contextsClient.createContext(request);
  } catch (error) {
    console.error("Ошибка сервера (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
};

module.exports = comeback_intent;
