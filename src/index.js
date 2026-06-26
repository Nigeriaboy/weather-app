import { sub } from "date-fns";
import "./styles.css";

const locationInput = document.querySelector("#location");
const submitBtn = document.querySelector("#submitBtn");

async function getWeather(location) {
  if (location) {
    const data = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=Y63Y38UT9H68LNE4LBRUFYHK3`,
    );

    const dataJson = await data.json();

    return dataJson;
  } else {
    return 1;
  }
}

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (locationInput.value) {
    const weather = await getWeather(locationInput.value);

    console.log(weather.description);
  }
});
