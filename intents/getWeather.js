const axios = require("axios");
require("dotenv").config();

const getweather = async (res, queryResult) => {
  const { "geo-city": city } = queryResult.parameters;

  try {
    const response = await axios.get(
      `${process.env.WEATHER_API_URL}&q=${encodeURIComponent(city)}&aqi=no`
    );
    const temperature = response.data.current.temp_c;
    res.send({
      fulfillmentText: `В городе ${city} температура ${temperature}°C`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка предоставления информации о температуре");
  }
};

module.exports = getweather;
