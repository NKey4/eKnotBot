const { format_number } = require("../intents/format_number");
const axios = require("axios");
const User = require("../models/user");
const { response } = require("express");
require("dotenv").config();

const check_user_yes = async (res, queryResult, user_id) => {
  try {
    const { phoneNumber } = queryResult.outputContexts[1].parameters;

    const response = await axios.post(process.env.SEND_CODE_URL, {
      phoneNumber: format_number(phoneNumber),
    });
    console.log(response.data);
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
