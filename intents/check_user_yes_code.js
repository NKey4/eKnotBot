const { ContextsClient } = require("@google-cloud/dialogflow").v2;
const axios = require("axios");
const { struct } = require("pb-util");
const {
  format_number_to_770,
  format_code,
} = require("../intents/format_number");
require("dotenv").config();

const check_user_yes_code = async (res, queryResult, user_id) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);

  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });
  const { phoneNumber, code } = queryResult.outputContexts[1].parameters;
  const digitsOnlyPhoneNum = format_number_to_770(phoneNumber);
  const digitsOnly = format_code(code);
  try {
    const data = {
      yandexId: user_id,
      userName: digitsOnlyPhoneNum,
      code: digitsOnly,
    };
    const response = await axios.post(process.env.CONFIRM_CODE_URL, data);
    const fullName = response.data.fullName;
    if (response.data.fullName) {
      res.send({
        fulfillmentText: `Приветствую Вас, ${fullName}.\n Для того чтобы ознакомиться с функциями бота произнесите или напишите "Помощь".`,
      });
      const response = await axios.get(
        process.env.GET_ADDRESS_URL + "?YandexId=" + `${user_id}`
      );
      const parameters = {
        fullName: fullName,
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
      await contextsClient.createContext(request);
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    console.error("Ошибка сервера (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
};

module.exports = check_user_yes_code;
