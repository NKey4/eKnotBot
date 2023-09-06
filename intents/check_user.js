const { format_number } = require("../intents/format_number");
const User = require("../models/user");

const check_user = async (res, queryResult, user_id) => {
  try {
    const number = queryResult.outputContexts[0].parameters["phoneNumber"];
    const digitsOnly = format_number(number);

    // Используйте Mongoose, которое уже подключено в server.js
    const user = await User.findOne({ _id: user_id });

    // ...
  } catch (error) {
    console.error("Ошибка при обращении к базе данных:", error);
    res.sendStatus(500);
  }
};

module.exports = check_user;
