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
    console.log(response);
    const fullName = response.data.fullName;
    if (response.data.fullName) {
      const parameters = {
        fullName: fullName,
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
      res.send({
        fulfillmentText: `Приветствую Вас, ${fullName}.\n Для того чтобы ознакомиться с функциями бота произнесите или напишите "Помощь".`,
        //  outputContexts: [request],
      });
      const response = await axios.get(
        process.env.GET_ADDRESS_URL + "?YandexId=" + `${user_id}`
      );
      console.log(response);
      const parameters2 = {
        /*fullName: fullName,*/
        city: response.data[0].city,
        apartmentId: response.data[0].houses[0].apartmentRoles[0].apartmentId,
        address: response.data[0].houses[0].address,
        flat: response.data[0].houses[0].apartmentRoles[0].name,
      };
      /*const request = {
        parent: `projects/eknot-ktdq/agent/sessions/${user_id}`,
        context: {
          name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
          parameters: struct.encode(parameters),
          lifespanCount: 50,
        },
      };
      await contextsClient.createContext(request);*/
      
      const request2 = {
        context: {
          name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
          parameters: struct.encode(parameters2),
          lifespanCount: 50,
        },
      };
      await contextsClient.updateContext(request2);
      return;
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    console.error("Ошибка сервера (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
};

module.exports = check_user_yes_code;
