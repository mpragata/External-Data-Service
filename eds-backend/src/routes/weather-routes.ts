import { Router } from "express";
import { getWeather } from "../modules/weather/weatherService";

const router = Router();

router.get("/", async (req, res) => {
  const city = req.query.city as string;

  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const weather = await getWeather(city);
    res.json(weather);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch weather" });
  }
});

export default router;
