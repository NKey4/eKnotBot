const express = require("express");
const aliceRouter = express.Router();
const detectIntent = require("../df");

const helloResponse = {
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
};

aliceRouter.post("/", async (req, res) => {
  try {
    const { request, session, state, version } = req.body;
    const { user_id } = session.user;
    const jsonAnswer = { version, session };
    let intentResponse;

    if (!request.command) {
      if (Object.keys(state.user).length) {
        // jsonAnswer.user_state_update = { fullName: null };
        const fullName = state.user.fullName || "";
        intentResponse = await detectIntent(fullName, user_id);
        jsonAnswer.response = { text: intentResponse.fulfillmentText };
      } else {
        jsonAnswer.response = helloResponse;
      }
    } else {
      intentResponse = await detectIntent(request.command, user_id);
      jsonAnswer.response = { text: intentResponse.fulfillmentText };

      if (intentResponse.intentDisplayName === "Exit") {
        jsonAnswer.response.end_session = true;
      } else if (intentResponse.intentDisplayName === "check_user_yes_code") {
        const contextToFind = `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`;
        console.log(intentResponse.context);
        const foundContext = intentResponse.context.find(
          (context) => context.name === contextToFind
        );
        jsonAnswer.user_state_update = {
          fullName: foundContext.parameters.fields.fullName.stringValue,
        };
      }
    }

    res.json(jsonAnswer);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = aliceRouter;
