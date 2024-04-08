import UserModel from "../../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const Exit = async (res, queryResult, yandex_id, user_id) => {
  try {
    const user = await UserModel.findOne({
      yandex_id,
    });

    user.yandex_id = undefined;
    await user.save();

    res.send({ fulfillmentText: "Успешно" });
  } catch (error) {
    console.error("Ошибка сервера (Exit):", error);
    res.send({
      fulfillmentText: "Ошибка сервера",
    });
  }
};
