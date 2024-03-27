import { ContextsClient } from "@google-cloud/dialogflow";
import axios from "axios";
import Application from "../models/Application.js";
import {
  STATUS,
  requestCategoryId,
  requestLocationId,
} from "../constants/constants.js";
import { struct } from "pb-util";
import dotenv from "dotenv";
dotenv.config();

export const createApplicationChoiceFlat = async (
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
    const contextToFind = `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`;
    const request = {
      name: contextToFind,
    };
    const response = await contextsClient.getContext(request);

    context = response[0].parameters.fields;
  } catch (error) {}
};
