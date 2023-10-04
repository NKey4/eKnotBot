const axios = require("axios");
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
  const { request, session, state, version } = req.body;
  const { user_id } = session.user;
  const response = { version, session };
  let intentResponse;
  if (!request.original_utterance) {
    if (Object.keys(state.user).length) {
      //response.user_state_update = { fullName: null };
      intentResponse = await detectIntent(`${state.user.fullName}`, user_id);
      response.response = { text: intentResponse.fulfillmentText };
    } else {
      response.response = hello();
    }
  } else {
    intentResponse = await detectIntent(request.original_utterance, user_id);
    response.response = { text: intentResponse.fulfillmentText };
    if (intentResponse.intentDisplayName) {
      if (intentResponse.intentDisplayName === "Exit") {
        response.response.end_session = true;
      } else if (
        intentResponse.intentDisplayName === "check_user_yes_code") 
        {
        try {
          const contextToFind = `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`;
          const foundContext = intentResponse.context.find(context => context.name === contextToFind)
          console.log(foundContext.parameters.fields.fullName.stringValue);
          response.user_state_update = {
            fullName: foundContext.parameters.fields.fullName.stringValue,
          };
        } catch (error) {
          console.error(error);
          return res.sendStatus(500);
        }
      }
    }
  }
  res.json(response);
});

module.exports = aliceRouter;
