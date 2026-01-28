require("dotenv").config();
const { createApp } = require("./app");
const { startWeatherScheduler } = require("./cron/weather.scheduler");

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in backend/.env");
}

const PORT = Number(process.env.PORT || 3001);
const app = createApp();

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);

  // Start background scheduler after server is up
  startWeatherScheduler();
});
