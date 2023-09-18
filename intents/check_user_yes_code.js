const { format_number } = require("../intents/format_number");
const axios = require("axios");
const User = require("../models/user");
require("dotenv").config();

const check_user_yes_code = async (res, queryResult, user_id) => {
  const { phoneNumber, code } = queryResult.outputContexts[1].parameters;
  const digitsOnlyPhoneNum = format_number(phoneNumber);

  try {
    const data = {
      phoneNumber: digitsOnlyPhoneNum,
      code: format_code(code),
      yandexId: user_id,
    };

    //const response = await axios.post(process.env.CONFIRM_CODE_URL, data);
    //console.log(response.data);
  } catch (error) {
    console.error("Ошибка сервера (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
   //Необходим метод для получения данных о пользователе (имя, адрес) для дальнейшего записывания в user_state и session_state в Yandex
  try {
    const existingUser = await User.findOne({ yandex_id: user_id });
  
    if (!existingUser) {
      const newUser = new User({ yandex_id: user_id, address: " ", phoneNumber: digitsOnlyPhoneNum, entryDate: new Date()});
  
      await newUser.save();
  
      console.log('Пользователь успешно сохранен');
    } else {
      await existingUser.updateOne({entryDate: new Date()})

      console.log('Пользователь уже существует и время входа обновлено');
    }
    const context = {
      name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
      lifespanCount: 100,
      parameters: {
        flag: "true",
      },
    };
    res.send({
      fulfillmentText: `Приветствую Вас, {name}.\n Для того чтобы ознакомиться с функциями бота произнесите или напишите "Помощь".`,
      outputContexts: [context],
    });
  } catch (error) {
    console.error('Ошибка при поиске/сохранении пользователя:', error);
  }   
  //Пока что лучше оставить
  /*try {
    const user = await User.findOneAndUpdate(
      { yandex_id: user_id },
      {
        phoneNumber: digitsOnlyPhoneNum,
        entryDate: new Date(),
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("Ошибка при обновлении данных пользователя:", error);
    return res.sendStatus(500);
  }*/
};

const format_code = (number) => {
  const digitsOnly = number.replace(/\D/g, "");
  return digitsOnly.length === 4 ? digitsOnly : null;
};

module.exports = check_user_yes_code;
