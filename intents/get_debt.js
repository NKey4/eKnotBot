const { db } = require("../firebase");

const get_debt = async (res, queryResult, user_id) => {
  const appRef = db.collection("debt").doc(user_id);
  const result = await appRef.get();

  if (!result.exists) {
    return res.sendStatus(400);
  }
  const debt = result.data().debt;
  res.send({
    fulfillmentText: `Ваша задолженность на данный момент составляет ${debt} тг`,
  });
};

module.exports = get_debt;
