require("dotenv").config();
const { db } = require("../firebase");

const create_applications = async (res, queryResult, user_id) => {
  const {
    "worktype.original": reason,
    location,
    worktype,
    description = "",
  } = queryResult.outputContexts[1].parameters;

  const appRef = db.collection("applications").doc(user_id);
  const userRef = db.collection("users").doc(user_id);
  const result = await appRef.get();
  const result1 = await userRef.get();

  if (!result.exists && !result1.exists) {
    console.log("400");
    return res.sendStatus(400);
  }
  const app = await result.data();
  const user = await result1.data();
  const data = Object.keys(app);
  const newId =
    data.length > 0
      ? (
          Math.max(...data.map((item) => parseInt(item.split("-").join("")))) +
          1
        )
          .toString()
          .padStart(6, "0")
          .replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3")
      : "00-00-01";

  const requestBody = {
    [newId]: {
      reason: reason,
      address: user.address,
      worktype: worktype,
      location: location,
      description: description,
      status: "1",
    },
  };

  if (requestBody) {
    await appRef.update(requestBody);
    res.send({ fulfillmentText: `Ваша заявка №${newId} отправлена` });
  } else {
    res.status(500).send("Ошибка создания заявки, повторите позже");
  }
};

module.exports = create_applications;
