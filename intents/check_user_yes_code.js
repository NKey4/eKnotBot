const {
  format_number_to_770,
  format_code,
} = require("../intents/format_number");
const axios = require("axios");
const { response } = require("express");
require("dotenv").config();

const check_user_yes_code = async (res, queryResult, user_id) => {
  const { phoneNumber, code } = queryResult.outputContexts[1].parameters;
  const digitsOnlyPhoneNum = format_number_to_770(phoneNumber);
  const digitsOnly = format_code(code);
  try {
    /*const data = {
      userName: "77717849422",
      code: digitsOnly,
      yandexId: "1111",
    };
    const response = await axios.post(process.env.CONFIRM_CODE_URL, data);
    console.log(response.data);*/
    if (digitsOnly === "7777") {
      const context = {
        name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
        lifespanCount: 100,
        parameters: {
          fullName: "Клышев Еркин Амангельдинович",
          flag: "true",
        },
      };
      res.send({
        fulfillmentText: `Приветствую Вас, Клышев Еркин Амангельдинович.\n Для того чтобы ознакомиться с функциями бота произнесите или напишите "Помощь".`,
        outputContexts: [context],
      });
    }
  } catch (error) {
    console.error("Ошибка сервера (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
};

module.exports = check_user_yes_code;
