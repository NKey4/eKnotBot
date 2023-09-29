require("dotenv").config();

const check_user_yes = async (res, queryResult, user_id) => {
  res.send({
    fulfillmentText:
      "Введите код, который был сформирован в приложении E-knot (Енот).",
  });
};

module.exports = check_user_yes;
