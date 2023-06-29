const { db } = require("../firebase");
const { STATUS } = require("../constants/constants");

const get_one_application = async (res, queryResult, user_id) => {
  const appRef = db.collection("applications").doc(user_id);
  const result = await appRef.get();
  const status = queryResult.outputContexts[0].parameters["status"];

  if (!result.exists) {
    return res.sendStatus(400);
  }

  const statusValue = STATUS.find(
    (status_id) => status_id.key === status
  ).value;

  let fulfillmentText = "";

  for (const [key, value] of Object.entries(result.data())) {
    if (value.status === status) {
      const address = value.address.join(", ");
      fulfillmentText += `Заявка: ${key}, Статус: ${statusValue}, Адрес: ${address}\n`;
    }
  }

  res.send({ fulfillmentText });
};

module.exports = get_one_application;
