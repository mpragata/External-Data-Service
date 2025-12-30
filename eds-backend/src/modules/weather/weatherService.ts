import httpClient from "../../lib/httpClient";
import { WeatherData } from "./types";

export const getWeather = async (city: string): Promise<WeatherData> => {
  try {
    const data = await httpClient.get<{
      main: {
        temp: number;
        temp_min: number;
        temp_max: number;
        humidity: number;
        pressure: number;
      };
      weather: { description: string; icon: string }[];
      wind: { speed: number; deg: number };
      clouds: { all: number };
      sys: { sunrise: number; sunset: number };
      name: string;
    }>(`${process.env.OPENWEATHER_API_BASE_URL}/weather`, {
      params: {
        q: city,
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric",
      },
    });

    return {
      city: data.name,
      temperature: data.main.temp,
      minTemperature: data.main.temp_min,
      maxTemperature: data.main.temp_max,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind?.speed,
      windDeg: data.wind?.deg,
      cloudiness: data.clouds?.all,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      sunrise: data.sys?.sunrise,
      sunset: data.sys?.sunset,
    };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    throw error;
  }
};
