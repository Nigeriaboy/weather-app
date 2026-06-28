import { add, sub } from "date-fns";
import "./styles.css";

const locationInput = document.querySelector("#location");
const submitBtn = document.querySelector("#submitBtn");
const content = document.querySelector("#content");
const summaryContainer = document.querySelector("#weatherSummary");

async function getWeather(location) {
  try {
    const data = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=Y63Y38UT9H68LNE4LBRUFYHK3`,
    );

    const dataJson = await data.json();

    return dataJson;
  } catch (error) {
    console.error(error);

    return 1;
  }
}

function weatherData(weatherJson) {
  try {
    const weatherObject = {
      address: weatherJson.resolvedAddress,
      currentCondition: {
        condition: weatherJson.currentConditions.conditions,
        feelsLike:
          Math.round(
            (((weatherJson.currentConditions.feelslike - 32) * 5) / 9) * 10,
          ) / 10,
        icon: weatherJson.currentConditions.icon,
        precipprob: weatherJson.currentConditions.precipprob,
        temp:
          Math.round(
            (((weatherJson.currentConditions.temp - 32) * 5) / 9) * 10,
          ) / 10,
      },
      rainProb: weatherJson.days[0].precipprob,
      description: weatherJson.description,
      cloudCover: weatherJson.days[0].cloudcover,
      days: weatherJson.days,
    };

    return weatherObject;
  } catch (error) {
    console.log(error);

    return 1;
  }
}

function displayWeather(weatherData) {
  const currentCondition = document.createElement("p");
  const currentFeelsLike = document.createElement("p");
  const currentRainProb = document.createElement("p");
  const currentTemp = document.createElement("p");
  const todayRainProb = document.createElement("p");
  const address = document.createElement("p");

  address.innerHTML = `<span>Location:</span> ${weatherData.address}.`;
  currentCondition.innerHTML = `<span>Current Condition:</span> ${weatherData.currentCondition.condition} with ${weatherData.description}`;
  currentFeelsLike.innerHTML = `<span>Currently Feels Like:</span> ${weatherData.currentCondition.feelsLike}°C`;
  currentRainProb.innerHTML = `<span>Probability Of Rain Falling Now:</span> ${weatherData.currentCondition.precipprob}%`;
  currentTemp.innerHTML = `<span>Current Temperature:</span> ${weatherData.currentCondition.temp}°C`;
  todayRainProb.innerHTML = `<span>Probability Of Rain Falling Today:</span> ${weatherData.rainProb}%`;

  content.append(
    address,
    currentCondition,
    currentFeelsLike,
    currentRainProb,
    currentTemp,
    todayRainProb,
  );
}

function weatherSummary(weatherData) {
  const cloudPercentage = weatherData.cloudCover;
  let cloudDescription;
  let rainPercentage = weatherData.days[0].precipprob;
  let rainDescription;

  if (cloudPercentage <= 20) {
    cloudDescription =
      "It will be mostly Sunny today, wear light clothes, stay hydrated and consider sunscreen.";
  } else if (cloudPercentage <= 60) {
    cloudDescription =
      "It will be Partly Sunny today, pleasant weather, enjoy oudoor activities.";
  } else if (cloudPercentage <= 85) {
    cloudDescription =
      "It will be Mostly Cloudy today, weather may change later, keep an eye on the forcast.";
  } else {
    cloudDescription =
      "The sky might be fully cloudy today. Outdoor plans should be fine, but weather could change later.";
  }

  if (rainPercentage >= 70) {
    rainDescription = "consider taking an Umbrella.";

    return `${cloudDescription} And ${rainDescription}`;
  } else {
    return cloudDescription;
  }
}

function displayWeatherSummary(summary) {
  const p = document.createElement("p");

  p.innerHTML = summary;

  summaryContainer.append(p);
}

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  // Clear the content and summary before displaying
  content.innerHTML = "";
  summaryContainer.innerHTML = "";

  if (locationInput.value) {
    const weather = await getWeather(locationInput.value);

    console.log(weather); // Delete soon

    if (weather !== 1) {
      const parsedWeatherData = weatherData(weather);

      if (parsedWeatherData !== 1) {
        displayWeather(parsedWeatherData);
        displayWeatherSummary(weatherSummary(parsedWeatherData));
      }
    }
  }
});
