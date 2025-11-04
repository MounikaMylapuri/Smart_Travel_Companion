import React, { useEffect, useState } from "react";
import axios from "axios";

interface WeatherWidgetProps {
  city: string;
}

interface DayForecast {
  date: string;
  max: number | string;
  min: number | string;
  desc: string;
  icon: string;
}

interface WeatherData {
  weather: DayForecast[];
  timezone: {
    name: string;
    country: string;
    utc_offset_seconds: number;
  };
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ city }) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      try {
        const res = await axios.get(`/api/weather?city=${encodeURIComponent(city)}`);
        setData(res.data);

        const offset = res.data.timezone.utc_offset_seconds;
        const local = new Date(Date.now() + offset * 1000);
        setLocalTime(local.toLocaleString("en-GB", { timeZone: "UTC" }));
      } catch (err: any) {
        console.error("Weather fetch failed:", err.message);
        setError("Unable to fetch weather data.");
      }
    };

    fetchWeather();
  }, [city]);

  if (error)
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-2xl shadow">
        ⚠️ {error}
      </div>
    );

  if (!data)
    return (
      <div className="p-4 text-gray-500 italic">
        Fetching weather for {city}...
      </div>
    );

  const { weather, timezone } = data;
  const offsetHrs = timezone.utc_offset_seconds / 3600;
  const offsetStr = `UTC${offsetHrs >= 0 ? "+" : ""}${offsetHrs
    .toFixed(0)
    .padStart(2, "0")}:00`;

  // Safely convert strings to numbers for calculations
  const avgMax =
    weather.reduce((a, d) => a + Number(d.max), 0) / weather.length;
  const avgMin =
    weather.reduce((a, d) => a + Number(d.min), 0) / weather.length;

  return (
    <div className="p-4 bg-blue-50 rounded-2xl shadow">
      <h3 className="text-xl font-semibold mb-2">🌦 Weather in {city}</h3>

      <div className="text-sm text-gray-600 mb-3">
        {timezone.name}, {timezone.country} • {offsetStr} | Local time:{" "}
        {localTime}
      </div>

      <p className="text-gray-700 mb-3">
        Avg Max: {avgMax.toFixed(1)}°C | Avg Min: {avgMin.toFixed(1)}°C
      </p>

      {/* Forecast cards row */}
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
        {weather.slice(0, 5).map((day) => {
          const max = Number(day.max);
          const min = Number(day.min);

          return (
            <div
              key={day.date}
              className="flex-none w-28 bg-white p-3 rounded-xl shadow-sm text-center border border-gray-100"
            >
              <p className="text-xs text-gray-500 mb-1">
                {new Date(day.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </p>
              <img src={day.icon} alt={day.desc} className="w-10 h-10 mx-auto" />
              <p className="text-xs capitalize text-gray-700">{day.desc}</p>
              <p className="text-sm font-semibold mt-1">
                {max.toFixed(1)}° / {min.toFixed(1)}°
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherWidget;
