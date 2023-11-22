const { ContextsClient } = require("@google-cloud/dialogflow").v2;
const axios = require("axios");
const Phrase = require("../models/phrase");
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

    const response_confirm = await axios.post(
      process.env.CONFIRM_CODE_URL,
      data
    );
    const fullName = response_confirm.data.fullName;

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
    contextsClient.createContext(request);

    const phrases = await Phrase.find({}).exec({ type: "hello" });

    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    const modifiedText = randomPhrase.text.replace(
      /fullName/g,
      fullName.split(" ")[1]
    );

    res.send({
      fulfillmentText: modifiedText,
    });

    const response_get_address = await axios.get(
      process.env.GET_ADDRESS_URL + "?YandexId=" + `${user_id}`
    );

    const parameters2 = {
      fullName: fullName,
      city: response_get_address.data[0].city,
      apartmentId:
        response_get_address.data[0].houses[0].apartmentRoles[0].apartmentId,
      address: response_get_address.data[0].houses[0].address,
      flat: response_get_address.data[0].houses[0].apartmentRoles[0].name,
    };

    const request2 = {
      context: {
        name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
        parameters: struct.encode(parameters2),
        lifespanCount: 50,
      },
    };
    await contextsClient.updateContext(request2);
  } catch (error) {
    console.error("Ошибка сервера (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
};

module.exports = check_user_yes_code;
