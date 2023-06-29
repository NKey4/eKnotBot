const { db } = require("../firebase");
const { STATUS } = require("../constants/constants");

const get_applications = async (res, queryResult, user_id) => {
  const appRef = db.collection("applications").doc(user_id);
  const result = await appRef.get();

  if (!result.exists) {
    return res.sendStatus(400);
  }

  const applications = result.data();
  const counts = {};
  Object.values(applications).forEach((value) => {
    const count = counts[value.status] || 0;
    counts[value.status] = count + 1;
  });

  const countText = Object.entries(counts)
    .map(
      ([status, count]) =>
        `Количество заявок со статусом "${
          STATUS.find((item) => item.key === status)?.value
        }": ${count}`
    )
    .join("\n");

  res.send({ fulfillmentText: countText });
};

module.exports = get_applications;
