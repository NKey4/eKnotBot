const { format_number_to_770 } = require("../intents/format_number");
const axios = require("axios");
const { response } = require("express");
require("dotenv").config();

const check_user_yes_code = async (res, queryResult, user_id) => {
  const { phoneNumber, code } = queryResult.outputContexts[1].parameters;
  const digitsOnlyPhoneNum = format_number_to_770(phoneNumber);
  const digitsOnly = format_code(code);
  try {
    const data = {
      phoneNumber: "77717849422",
      code: digitsOnly,
      yandexId: "1111",
    };
    const response = await axios.post(process.env.CONFIRM_CODE_URL, data);
    console.log(response.data);
    const context = {
      name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
      lifespanCount: 100,
      parameters: {
        flag: "true",
      },
    };
    res.send({
      fulfillmentText: `Приветствую Вас, ${response.data}.\n Для того чтобы ознакомиться с функциями бота произнесите или напишите "Помощь".`,
      outputContexts: [context],
    });
  } catch (error) {
    console.error("Ошибка сервера (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
};

const format_code = (number) => {
  const digitsOnly = number.replace(/\D/g, "");
  return digitsOnly.length === 4 ? digitsOnly : null;
};

module.exports = check_user_yes_code;
