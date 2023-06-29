const express = require("express");
const { Alice, Reply, Markup } = require("yandex-dialogs-sdk");
const alice = new Alice();
const aliceRouter = express.Router();
const detectIntent = require("../df");

aliceRouter.post("/", async (req, res) => {
  const jsonAnswer = await alice.handleRequest(req.body);
  res.json(jsonAnswer);
});

alice.command("", async (req) => {
  let link;
  let buttonText;

  if (req.data.meta.client_id.includes("android")) {
    link = "https://play.google.com/store/apps/details?id=me.eknot&hl=ru&gl=US";
    buttonText = "Play Market";
  } else if (req.data.meta.client_id.includes("Apple")) {
    link =
      "https://apps.apple.com/kz/app/eknot-%D1%86%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-%D0%BE%D1%81%D0%B8-%D0%B8-%D0%BF%D1%82/id1516986646";
    buttonText = "App Store";
  } else {
    buttonText = "App Store или Play Market";
  }

  let bigImageCardParams = {
    image_id: "1533899/4ac3620447eeaa50946a",
    title: "Клик",
    button:
      link &&
      Markup.button({
        title: "e-Knot",
        url: link,
      }),
  };

  return Reply.bigImageCard(
    `Привет, если ты тут впервые, то тебе надо скачать наше приложение в ${buttonText}. Далее включить разрешение в настройках. После того как все сделал, введи сюда свой номер телефона`,
    bigImageCardParams
  );
});

alice.any(async (ctx) => {
  return Reply.text(await detectIntent(ctx.originalUtterance, ctx.userId));
});

module.exports = aliceRouter;
