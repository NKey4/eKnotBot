import { v2 as dialogflow } from '@google-cloud/dialogflow';
import axios from 'axios';
import Phrase from '../models/phrase.js';
import User from '../models/user.js';
import { struct } from 'pb-util';
import { format_number_to_770, format_code } from '../utils/format_number.js';
import dotenv from 'dotenv';

dotenv.config();

const { ContextsClient } = dialogflow;

const check_user_yes_code = async (res, queryResult, user_id) => {
  const { private_key, client_email } = JSON.parse(process.env.CREDENTIALS);

  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });
  const { phoneNumber, code } = queryResult.outputContexts[1].parameters;
  const digitsOnlyPhoneNum = format_number_to_770(phoneNumber);
  const digitsOnly = format_code(code);
  try {
    const user = await User.findOne({ phoneNumber: digitsOnlyPhoneNum });

    if (!user) {
      return res.send({
        fulfillmentText: "Пользователь с таким номером не существует."
      });
    }

    if (digitsOnly !== user.aliceCode) {
      return res.send({
        fulfillmentText: "Код привязки не совпадает."
      });
    } else if (user.aliceCode === undefined) {
      return res.send({
        fulfillmentText: "Код привязки не был сформирован."
      });
    }

    const parameters = {
      fullName: user.fullName
      // Additional address handling might be implemented here
    };
    const request = {
      parent: `projects/eknot-ktdq/agent/sessions/${user_id}`,
      context: {
        name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
        parameters: struct.encode(parameters),
        lifespanCount: 50,
      },
    };
    await contextsClient.createContext(request);

    const phrases = await Phrase.find({ type: "hello" });
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    const modifiedText = randomPhrase.text.replace(/fullName/g, user.fullName.split(" ")[1]);

    res.send({ fulfillmentText: modifiedText });

    // The code to fetch address and set parameters might need to be updated or removed depending on your application logic
  } catch (error) {
    console.error("Ошибка сервера (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
};

export default check_user_yes_code;

    /*const parameters2 = {
      fullName: fullName,
      city: response_get_address.data[0].city,
      apartmentId:
        response_get_address.data[0].houses[0].apartmentRoles[0].apartmentId,
      address: response_get_address.data[0].houses[0].address,
      flat: response_get_address.data[0].houses[0].apartmentRoles[0].name,
    };*/