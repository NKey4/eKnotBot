import AppealsModel from "../../models/Appeal.js";
import dotenv from "dotenv";
dotenv.config();

export const last_appeal = async (res, queryResult, yandex_id, user_id) => {
  try {
    const appeal = await AppealsModel.findOne({ user: user_id }).sort({
      _id: -1,
    });
    if (appeal) {
      return res.send({
        fulfillmentText: appeal.answer,
      });
    } else {
      res.send({
        fulfillmentText: "У вас пока нет обращений.",
      });
    }
  } catch (error) {
    console.error("Ошибка сервера (last_appeal):", error);
    res.send({
      fulfillmentText: "Ошибка сервера",
    });
  }
};
