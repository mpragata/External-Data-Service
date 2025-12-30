"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import type { WeatherData } from "@/types/weather";

export default function Weather() {
  const [city, setCity] = useState("");
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    if (!city) {
      setError("Please Input a City");
      setLoading(false);
      return;
    }
    try {
      const res = await apiClient.get<WeatherData>("/weather", {
        params: { city },
      });
      setData(res.data);
      setLastUpdated(new Date()); // store timestamp
    } catch (err: any) {
      setError(err.message || "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="font-semibold mb-2">Weather</h2>

      <div className="flex gap-2 mb-2">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 rounded"
          placeholder="Naga"
        />
        <button
          className="bg-black text-white px-3 py-1"
          onClick={fetchWeather}
        >
          Fetch
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {data && (
        <div className="mt-2 text-sm flex flex-col gap-1">
          <p>
            City: <strong>{data.city}</strong>
          </p>
          <p>
            Temperature: <strong>{data.temperature}°C</strong>
          </p>
          <p>
            Humidity: <strong>{data.humidity}%</strong>
          </p>
          <p>
            Wind: <strong>{data.windSpeed} m/s</strong>
          </p>
          <p>
            Clouds: <strong>{data.cloudiness}%</strong>
          </p>
          <p>
            Description: <strong>{data.description}</strong>{" "}
            {data.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${data.icon}.png`}
                alt={data.description}
                className="inline-block w-6 h-6"
              />
            )}
          </p>
          <p>
            Sunrise:{" "}
            <strong>
              {new Date(data.sunrise * 1000).toLocaleTimeString()}
            </strong>
          </p>
          <p>
            Sunset:{" "}
            <strong>{new Date(data.sunset * 1000).toLocaleTimeString()}</strong>
          </p>
          {lastUpdated && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
