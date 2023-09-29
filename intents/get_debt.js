require("dotenv").config();

const get_debt = async (res, queryResult, user_id) => {
  try {
    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.sendStatus(400);
    }

    const debt = user.debt;

    if (debt === undefined || debt === null || debt === "") {
      res.send({
        fulfillmentText: "Вы не имеете никакой задолженности.",
      });
    } else {
      res.send({
        fulfillmentText: `Ваша задолженность на данный момент составляет ${debt} тг`,
      });
    }
  } catch (error) {
    console.error(
      "Ошибка при получении данных о задолженности из базы данных:",
      error
    );
    res.send({ fulfillmentText: "Приношу извинения. Ошибка сервера." });
  }
};

module.exports = get_debt;
