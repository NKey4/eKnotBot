const mongoose = require("mongoose");
const { format_number } = require("../intents/format_number");
const User = require("../models/user");

const check_user = async (res, queryResult, user_id) => {
  try {
    const number = format_number(
      queryResult.outputContexts[0].parameters["phoneNumber"]
    );

    const response = { fulfillmentText: `Вы ввели номер ${number}, верно?` };

    res.send(response);
  } catch (error) {
    console.error("Ошибка при обращении к базе данных:", error);
    res.sendStatus(500);
  }
};

module.exports = check_user;
