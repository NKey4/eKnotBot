const { ContextsClient } = require("@google-cloud/dialogflow").v2;
const axios = require("axios");
const Phrase = require("../models/phrase");
const User = require("../models/user")
const { struct } = require("pb-util");
const {
  format_number_to_770,
  format_code,
} = require("../utils/format_number");
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
    const user = await User.findOne({phoneNumber: digitsOnlyPhoneNum});

    if(!user){
      return res.send({
        fulfillmentText: "Пользователь с таким номер не существует."
      })
    }

    if(digitsOnly !== user.aliceCode){
      return res.send({
        fulfillmentText: "Код привязки не совпадает."
      })
    } else if(user.aliceCode === undefined){
      return res.send({
        fulfillmentText: "Код привязки не был сформирован."
      })
    }

    const parameters = {
      fullName: user.fullName,
      // Дописать адреса
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

    const phrases = await Phrase.find({}).exec({ type: "hello" });

    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    const modifiedText = randomPhrase.text.replace(
      /fullName/g,
      fullName.split(" ")[1]
    );

    res.send({
      fulfillmentText: modifiedText,
    });

    // Убрать
    const response_get_address = await axios.get(
      process.env.GET_ADDRESS_URL + "?YandexId=" + `${user_id}`
    );

    /*const parameters2 = {
      fullName: fullName,
      city: response_get_address.data[0].city,
      apartmentId:
        response_get_address.data[0].houses[0].apartmentRoles[0].apartmentId,
      address: response_get_address.data[0].houses[0].address,
      flat: response_get_address.data[0].houses[0].apartmentRoles[0].name,
    };*/
  } catch (error) {
    console.error("Ошибка сервера (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
};

module.exports = check_user_yes_code;
