const express = require("express");
const aliceRouter = express.Router();
const detectIntent = require("../df");

const hello = () => ({
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
});

aliceRouter.post("/", async (req, res) => {
  const { request, session, version } = req.body;
  const { user_id } = session.user;
  const response = { version, session };
  let intentResponse;
  if (!request.original_utterance) {
    response.response = hello();
  } else {
    intentResponse = await detectIntent(request.original_utterance, user_id);
    response.response = { text: intentResponse.fulfillmentText };
    if (intentResponse.intentDisplayName) {
      if (
        intentResponse.intentDisplayName === "Exit" ||
        intentResponse.intentDisplayName === "check_user_yes_Exit"
      ) {
        response.response.end_session = true;
      } else if (intentResponse.intentDisplayName === "check_user_yes_code") {
        response.user_state_update = { value: "123" };
      }
    }
  }

  res.json(response);
});

module.exports = aliceRouter;
