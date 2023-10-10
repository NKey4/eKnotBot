const {
  format_number_to_770,
  format_code,
} = require("../intents/format_number");
const axios = require("axios");
require("dotenv").config();

const check_user_yes_code = async (res, queryResult, user_id) => {
  const { phoneNumber, code } = queryResult.outputContexts[1].parameters;
  const digitsOnlyPhoneNum = format_number_to_770(phoneNumber);
  const digitsOnly = format_code(code);
  try {
    const data = {
      yandexId: "1111",
      userName: digitsOnlyPhoneNum,
      code: digitsOnly,
    };
    const response = await axios.post(process.env.CONFIRM_CODE_URL, data);
    const fullName = response.data.fullName;
    if (response.data.fullName) {
      const response = await axios.get(
        process.env.GET_ADDRESS_URL + "?YandexId=1111"
      );
      const context = {
        name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
        lifespanCount: 50,
        //исправить fullName
        parameters: {
          fullName: fullName,
          city: response.data[0].city,
          apartmentId: response.data[0].houses[0].apartmentRoles[0].apartmentId,
          address: response.data[0].houses[0].address,
          flat: response.data[0].houses[0].apartmentRoles[0].name,
        },
      };
      res.send({
        fulfillmentText: `Приветствую Вас, ${fullName}.\n Для того чтобы ознакомиться с функциями бота произнесите или напишите "Помощь".`,
        outputContexts: [context],
      });
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    console.error("Ошибка сервера (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
};

module.exports = check_user_yes_code;
