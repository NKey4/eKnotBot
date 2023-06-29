const { db } = require("../firebase");
const { STATUS } = require("../constants/constants");
const get_applications = async (res, queryResult, user_id) => {
  const appRef = db.collection("applications").doc(user_id);
  const result = await appRef.get();

  if (!result.exists) {
    return res.sendStatus(400);
  }
  const responses = Object.entries(result.data()).map(
    ([key, value]) =>
      `Заявка: ${key}, по адресу: ${value.address}, cтатус \"${
        STATUS.find((item) => item.key === value.status)?.value
      }\".`
  );
  const fulfillmentText = responses.join("\n");
  res.send({ fulfillmentText });
};

module.exports = get_applications;
