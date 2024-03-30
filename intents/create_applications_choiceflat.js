import { ContextsClient } from "@google-cloud/dialogflow";
import Application from "../models/Application.js";
import {
  STATUS,
  requestCategoryId,
  requestLocationId,
} from "../constants/constants.js";
import { struct } from "pb-util";
import dotenv from "dotenv";
dotenv.config();

export const create_applications_choiceflat = async (
  res,
  queryResult,
  user_id
) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);
  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });

  let context;

  try {
    console.log(queryResult.outputContexts[2].parameters.number);
    queryResult.outputContexts[2].parameters.addresses[
      queryResult.outputContexts[2].parameters.number
    ];
    res.send({
      fulfillmentText: "Не желаете мне рассказать подробности?",
    });
  } catch (error) {}
};
