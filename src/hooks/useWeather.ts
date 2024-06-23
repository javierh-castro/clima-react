import { useMemo, useState } from "react";
import axios from "axios";
import type { SearchType } from "../types";
import z from "zod";


// Zod
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
});
export type Weather = z.infer<typeof Weather>;

const initialState = {
  name: "",
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0,
  },
};

function useWeather() {
  const [weather, setWeather] = useState<Weather>(initialState);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false)

  const fetchWeather = async (buscar: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY;
    setLoading(true);
    setWeather(initialState)

    try {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${buscar.city},${buscar.country}&appid=${appId}`; //await axios(then.()
      const { data } = await axios(geoUrl);

      if(!data[0]) {
        setNotFound(true)
        return
      }

      const lat = data[0].lat;
      const lon = data[0].lon;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

      // Zod
      const { data: weatherResult } = await axios(weatherUrl);
      const result = Weather.safeParse(weatherResult);
      if (result.success) {
        setWeather(result.data);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const hasWeatherData = useMemo(() => weather.name, [weather]); //Utilizar

  return {
    weather,
    loading,
    notFound,
    fetchWeather,
    hasWeatherData
  };
}

export default useWeather;
