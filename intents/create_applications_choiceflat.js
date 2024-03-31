import { struct } from "pb-util";
import dotenv from "dotenv";
dotenv.config();

export const create_applications_choiceflat = async (res, queryResult) => {
  try {
    res.send({
      fulfillmentText: "Не желаете мне рассказать подробности?",
    });
  } catch (error) {}
};
