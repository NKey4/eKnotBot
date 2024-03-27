import dotenv from "dotenv";
dotenv.config();

export const application = async (res, queryResult, user_id) => {
  try {
    const userAddress = user.address; // Assuming 'user' is defined elsewhere
    if (Array.isArray(userAddress) && userAddress.length > 1) {
      let message = "Выберите адрес:\n";
      for (let i = 0; i < userAddress.length; i++) {
        if (i + 1 === userAddress.length) {
          message += `${i + 1}. ${userAddress[i]}.`;
        } else {
          message += `${i + 1}. ${userAddress[i]};\n`;
        }
      }
      res.send({ fulfillmentText: message });
    } else {
      res.send({
        fulfillmentText: "Пожалуйста, опишите причину подачи заявки",
      });
    }
  } catch (error) {
    console.error("Ошибка при обращении к базе данных:", error);
    return res.sendStatus(500);
  }
};

