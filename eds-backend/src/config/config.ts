import * as dotenv from "dotenv";
import * as path from "path";

export const loadEnv = () => {
  const envFile =
    process.env.NODE_ENV === "production"
      ? path.resolve(process.cwd(), "src", "config", ".env.production")
      : path.resolve(process.cwd(), "src", "config", ".env");

  const result = dotenv.config({ path: envFile });

  if (result.error) {
    if (result.error.message.includes("ENOENT")) {
      console.warn(
        `[Config] WARNING: Could not find ${envFile}. Using system environment variables.`
      );
    } else {
      console.error(
        "[Config] Error loading environment variables:",
        result.error
      );
    }
  } else {
    console.log(`[Config] Loaded environment variables from ${envFile}`);
  }

  const envKeys = [
    "MONGO_URI",
    "DB_NAME",
    "OPENWEATHER_API_KEY",
    "OPENWEATHER_API_BASE_URL",
    "EXCHANGE_API_KEY",
    "EXCHANGE_API_BASE_URL",
    "STRIPE_SECRET_KEY",
  ];

  envKeys.forEach((key) => {
    if (!process.env[key]) {
      console.warn(`[Config] WARNING: ${key} is not defined.`);
    }
  });

  const runtimeRequired = ["MONGO_URI", "DB_NAME"];

  runtimeRequired.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`[Config] Missing required env: ${key}`);
    }
  });
};
