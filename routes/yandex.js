const express = require("express");
const { Alice, Reply, Markup } = require("yandex-dialogs-sdk");
const alice = new Alice();
const M = new Markup();
const aliceRouter = express.Router();
const detectIntent = require("../df");

aliceRouter.post("/", async (req, res) => {
  const jsonAnswer = await alice.handleRequest(req.body);
  res.json(jsonAnswer);
});

alice.command("", async () =>
  Reply.bigImageCard("Привет", {
    image_id:
      "https://static.tildacdn.com/tild3463-3762-4231-b836-636436313939/Frame_100.png",
    title: "Клик", // optional
    description: "212", // optional
    button: Markup.button({
      title: "12",
      url: "https://apps.apple.com/kz/app/eknot-%D1%86%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-%D0%BE%D1%81%D0%B8-%D0%B8-%D0%BF%D1%82/id1516986646",
    }),
    // optional
  })
);

alice.any(async (ctx) => {
  return Reply.text(await detectIntent(ctx.originalUtterance, ctx.userId));
});

module.exports = aliceRouter;
