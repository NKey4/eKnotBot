require("dotenv").config();
const { db } = require("../firebase");
const { usual_number } = require("../intents/format_number");

const create_applications = async (res, queryResult, user_id) => {
  const {
    "worktype.original": reason,
    location,
    worktype,
    description = "",
  } = queryResult.outputContexts[1].parameters;

  const appRef = db.collection("applications").doc(user_id);
  const userRef = db.collection("users").doc(user_id);
  const [app, user] = await Promise.all([appRef.get(), userRef.get()]);

  if (!app.exists && !user.exists) {
    return res.sendStatus(400);
  }

  const data = Object.keys(app.data());
  let newId =
    data.length > 0
      ? (
          Math.max(...data.map((item) => parseInt(item.split("-").join("")))) +
          1
        )
          .toString()
          .padStart(4, "0")
          .replace(/(\d{2})(\d{2})/, "$1-$2")
      : "00-01";

  const requestBody = {
    [newId]: {
      reason,
      address: user.data().address,
      worktype,
      location,
      description,
      status: "1",
      viewing: "0",
    },
  };
  newId=usual_number(newId);
  if (requestBody) {
    await appRef.update(requestBody);
    res.send({ fulfillmentText: `Ваша заявка №${newId} отправлена` });
  } else {
    res.send({ fulfillmentText: "Ошибка создания заявки, повторите позже" });
  }
};

module.exports = create_applications;
