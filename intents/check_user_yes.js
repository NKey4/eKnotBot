const { format_number } = require("../intents/format_number");
const axios = require("axios");
const User = require("../models/user");
require("dotenv").config();

const check_user_yes = async (res, queryResult, user_id) => {
  try {
    const { phoneNumber } = queryResult.outputContexts[1].parameters;

    const user = await User.findOneAndUpdate(
      { yandex_id: user_id },
      { phoneNumber: format_number(phoneNumber) },
      { upsert: true, new: true }
    );

    // await axios.post(process.env.SEND_CODE_URL, {
    //   phoneNumber: format_number(phoneNumber),
    // });

    res.send({
      fulfillmentText:
        "Введите код, который был сформирован в приложении E-knot (Енот).",
    });
  } catch (error) {
    console.error("Ошибка сервера (check_user_yes)", error);
    res.sendStatus(500);
  }
};

module.exports = check_user_yes;
