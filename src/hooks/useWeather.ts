import axios from "axios";
import type { SearchType } from "../types";
import z from "zod"

//Type Guards
// function isWeatherResponse(weather: unknown): weather is Weather {
//   //Esta función nos va  a revisar si contiene esos datos
//   //Esto => : weather is Weather => ase que se autocomplete en el codigo
//   return (
//     Boolean(weather) &&
//     typeof weather === "object" &&
//     typeof (weather as Weather).name === "string" &&
//     typeof (weather as Weather).main.temp === "number" &&
//     typeof (weather as Weather).main.temp_max === "number" &&
//     typeof (weather as Weather).main.temp_min === "number"
//   );
// }

//Zod
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number()
  })
})
type Weather = z.infer<typeof Weather>


function useWeather() {
  const fetchWeather = async (buscar: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY;

    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${buscar.city},${buscar.country}&appid=${appId}`; //await axios(then.()
      const { data } = await axios(geoUrl);

      const lat = data[0].lat;
      const lon = data[0].lon;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

      //Caster el type
      // const { data: weatherResult } = await axios<Weather>(weatherUrl)//Aca en data lo renombramos (la variable data la asignamos a weatherResult)
      // console.log(weatherResult.temp)
      // console.log(weatherResult.name)

      //Type Guards
      // const { data: weatherResult } = await axios(weatherUrl);
      // const result = isWeatherResponse(weatherResult);
      // if (result) {
      //   console.log(weatherResult.name);
      // } else {
      //   console.log("Respuesta mal formada");
      // }

      const { data: weatherResult } = await axios(weatherUrl);
      const result = Weather.safeParse(weatherResult);
      if(result.success){
        console.log(result.data.name)
        console.log(result.data.main.temp)
      }

    } catch (err) {
      console.log(err);
    }
  };

  return {
    fetchWeather,
  };
}

export default useWeather;
