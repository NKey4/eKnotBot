const axios = require("axios");
require("dotenv").config();
const { struct } = require("pb-util");
const { ContextsClient } = require("@google-cloud/dialogflow").v2;

const comeback_intent = async (res, queryResult, user_id) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);

  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });
  const { "fullName.original": fullName } =
    queryResult.outputContexts[0].parameters;
  try {
    const response = await axios.get(
      process.env.GET_ADDRESS_URL + "?YandexId=1111"
    );
    res.send({
      fulfillmentText: `Приветствую Вас, ${fullName}.\n Для того чтобы ознакомиться с функциями бота произнесите или напишите "Помощь".`,
    });
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

    const king = await contextsClient.createContext(request);
    console.log(king[0].parameters.fields);
  } catch (error) {
    console.error("Ошибка сервера (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
};

module.exports = comeback_intent;
