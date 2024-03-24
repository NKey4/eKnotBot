import dotenv from 'dotenv';

dotenv.config();

const application = async (res, queryResult, user_id, user) => {
  try {
    const userAddress = user.address;
    if (Array.isArray(userAddress) && userAddress.length > 1) {
      let message = "Выберите адрес:\n";
      userAddress.forEach((address, index) => {
        message += `${index + 1}. ${address}${index + 1 === userAddress.length ? '.' : ';\n'}`;
      });
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

export default application;
