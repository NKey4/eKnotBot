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
      yandexId: "1111",
      userName: "77717849422",
      code: digitsOnly,
    };
    const response = await axios.post(process.env.CONFIRM_CODE_URL, data);
    const fullName = response.data.fullName;
    console.log(response.data.fullName);
    if(response.data.fullName){
      const context = {
        name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
        lifespanCount: 100,
        parameters: {
          fullName: fullName,
          flag: "true",
        },
      };
      res.send({
        fulfillmentText: `Приветствую Вас, ${fullName}.\n Для того чтобы ознакомиться с функциями бота произнесите или напишите "Помощь".`,
        outputContexts: [context],
      });
    } else{
      return res.sendStatus(404);
    }*/
    if (digitsOnly === "7777") {
      const response = await axios.get(process.env.CONFIRM_CODE_URL, { YandexId: user_id });
      const context = {
        name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
        lifespanCount: 100,
        parameters: {
          fullName: "Клышев Еркин Амангельдинович",
          city: response.data.city,
          apartmentId:response.data.houses.apartmentRoles.apartmentId,
          address:response.data.houses.address,
          flat:response.data.houses.apartmentRoles.name,
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
