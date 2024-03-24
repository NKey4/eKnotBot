import Application from "../models/application.js";
import { STATUS } from "../constants/constants.js";
import dotenv from "dotenv";

dotenv.config();

const get_applications = async (res, queryResult, user_id) => {
  try {
    const applications = await Application.find({ yandexId: user_id });

    if (!applications || applications.length === 0) {
      return res.status(404).send("Заявки не найдены");
    }

    const counts = {};
    applications.forEach((app) => {
      const count = counts[app.status_id] || 0;
      counts[app.status_id] = count + 1;
    });

    const countText = Object.entries(counts)
      .map(([status_id, count]) => {
        const statusLabel = STATUS.find((item) => item.oid === status_id)?.Name;
        return `Количество заявок со статусом "${statusLabel}": ${count}`;
      })
      .join("\n");

    res.send({ fulfillmentText: countText });
  } catch (error) {
    console.error("Ошибка при получении данных заявок из базы данных:", error);
    res.send({ fulfillmentText: "Приношу извинения. Ошибка сервера." });
  }
};

export default get_applications;
