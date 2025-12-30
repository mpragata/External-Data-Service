//weather types
export interface WeatherData {
  city: string;
  temperature: number;
  minTemperature?: number;
  maxTemperature?: number;
  humidity: number;
  pressure?: number;
  windSpeed?: number;
  windDeg?: number;
  cloudiness?: number;
  description: string;
  icon?: string;
  sunrise?: number;
  sunset?: number;
}
