const express = require("express");
const aliceRouter = express.Router();
const detectIntent = require("../df");

const intentFunctions = {
  hello: () => ({
    text: "Здравствуйте, если Вы тут впервые, то Вам необходимо скачать наше приложение в Play Market. Далее включить разрешение в настройках. После выполнения предыдущих действий, введите сюда свой номер телефона",
    card: {
      type: "BigImage",
      image_id: "1533899/4ac3620447eeaa50946a",
      title: "Клик",
      button: {
        title: "e-Knot",
        url: "https://play.google.com/store/apps/details?id=me.eknot&hl=ru&gl=US",
      },
    },
    end_session: false,
  }),
  exit: () => ({
    text: "Спасибо за внимание! До скорой встречи!",
    end_session: true,
  }),
};

async function getIntent(userUtterance, user_id) {
  if (!userUtterance) {
    return intentFunctions.hello();
  }

  const exitWords = [
    "нет",
    "выйти",
    "закрыть",
    "завершить",
    "хватит",
    "достаточно",
  ];
  const exitRequested = exitWords.some((word) => userUtterance.includes(word));

  return exitRequested
    ? intentFunctions.exit()
    : await any(userUtterance, user_id);
}

async function any(message, user_id) {
  const intentResponse = await detectIntent(message, user_id);
  return { text: intentResponse };
}

aliceRouter.post("/", async (req, res) => {
  const { request, session, version } = req.body;
  const user_id = session.user.user_id;
  const userUtterance = request.original_utterance;
  const detectIntentResponse = await getIntent(userUtterance, user_id);

  const response = {
    version,
    session,
    response: detectIntentResponse,
  };

  if (detectIntentResponse.text.intentDisplayName === "check_user_yes_code") {
    response.session_state = { value: "123" };
  } else if (detectIntentResponse.text.fulfillmentText) {
    response.response = { text: detectIntentResponse.text.fulfillmentText };
  }
  res.json(response);
});

module.exports = aliceRouter;
