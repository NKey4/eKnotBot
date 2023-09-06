const Application = require("../models/application");
const { STATUS } = require("../constants/constants");
require("dotenv").config();

const get_applications = async (res, queryResult, user_id) => {
  try {
    const applications = await Application.find({ userId: user_id });

    if (!applications || applications.length === 0) {
      return res.sendStatus(400);
    }

    const counts = {};
    applications.forEach((app) => {
      const count = counts[app.status] || 0;
      counts[app.status] = count + 1;
    });

    const countText = Object.entries(counts)
      .map(([status, count]) => {
        const statusLabel = STATUS.find((item) => item.key === status)?.value;
        return `Количество заявок со статусом "${statusLabel}": ${count}`;
      })
      .join("\n");

    res.send({ fulfillmentText: countText });
  } catch (error) {
    console.error("Ошибка при получении данных заявок из базы данных:", error);
    res.send({ fulfillmentText: "Приношу извинения. Ошибка сервера." });
  }
};

module.exports = get_applications;
