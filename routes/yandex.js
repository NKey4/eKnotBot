const express = require("express");
const { Alice, Reply } = require("yandex-dialogs-sdk");
const alice = new Alice();
const aliceRouter = express.Router();
const detectIntent = require("../df");

aliceRouter.post("/", async (req, res) => {
  const jsonAnswer = await alice.handleRequest(req.body);
  res.json(jsonAnswer);
});

alice.command("", async () => Reply.text("Привет, назови свой номер телефона"));

alice.any(async (ctx) => {
  return Reply.text(await detectIntent(ctx.originalUtterance, ctx.userId));
});

module.exports = aliceRouter;
