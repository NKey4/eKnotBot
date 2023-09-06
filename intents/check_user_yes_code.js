const { format_number } = require("../intents/format_number");
const axios = require("axios");
const User = require("../models/user");
require("dotenv").config();

const check_user_yes_code = async (res, queryResult, user_id) => {
  const { phoneNumber, code } = queryResult.outputContexts[1].parameters;
  const digitsOnlyPhoneNum = format_number(phoneNumber);
  const digitsOnlyCode = format_code(code);

  try {
    const data = {
      phoneNumber: "77478084388",
      code: format_code(code),
      yandexId: "123",
    };

    const response = await axios.post(process.env.CONFIRM_CODE_URL, data);
    console.log(response.data);
  } catch (error) {
    console.error("Ошибка сервера (check_user_yes):", error);
    return res.sendStatus(500);
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: user_id },
      {
        phoneNumber: digitsOnlyPhoneNum,
        entryDate: new Date(),
      },
      { upsert: true, new: true }
    );

    const context = {
      name: "projects/eknot-ktdq/agent/sessions/2CF3B4D976AD447DDAE6BB2C6034CCA533252650FF31791390F00F0DD1D5D821/contexts/logincheck",
      lifespanCount: 100,
      parameters: {
        flag: "true",
      },
    };

    res.send({
      fulfillmentText: `Приветствую Вас, .\n Для того чтобы ознакомиться с функциями бота произнесите или напишите "Помощь".`,
      outputContexts: [context],
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных пользователя:", error);
    return res.sendStatus(500);
  }
};

const format_code = (number) => {
  const digitsOnly = number.replace(/\D/g, "");
  console.log(digitsOnly);
  return digitsOnly.length === 4 ? digitsOnly : null;
};

module.exports = check_user_yes_code;
