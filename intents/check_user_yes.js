const { format_number } = require("../intents/format_number");
const axios = require("axios");
const User = require("../models/user");
require("dotenv").config();

const check_user_yes = async (res, queryResult, user_id) => {
  try {
    const { phoneNumber } = queryResult.outputContexts[1].parameters;
    const digitsOnlyPhoneNum = format_number(phoneNumber);

    const user = await User.findOneAndUpdate(
      { _id: user_id },
      { phoneNumber: digitsOnlyPhoneNum },
      { upsert: true, new: true }
    );

    const response = await axios.post(process.env.SEND_CODE_URL, {
      phoneNumber: "77478084388",
    });
    console.log(response.data);

    res.send({
      fulfillmentText:
        "Введите код, который был сформирован в приложении E-knot (Енот).",
    });
  } catch (error) {
    console.log("Ошибка сервера (check_user_yes)");
    return res.sendStatus(500);
  }
};

module.exports = check_user_yes;
