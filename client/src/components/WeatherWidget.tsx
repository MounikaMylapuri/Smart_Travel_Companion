import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  ListItem,
} from "@mui/material";
import {
  WbSunny,
  Cloud,
  Grain,
  AcUnit,
  Thunderstorm,
  FilterDrama,
  AccessTime,
} from "@mui/icons-material";
import { format } from "date-fns";

// --- INTERFACES ---
interface DailyWeather {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

interface TimezoneData {
  datetime: string;
  abbreviation: string;
  timezone: string;
  utc_offset: string;
}

interface ApiData {
  weather: DailyWeather;
  timezone: TimezoneData;
}

// --- WIDGET PROPS ---
interface WeatherWidgetProps {
  city: string;
  startDate: string;
  endDate: string;
  // Callback to send data back to parent
  onDataFetched: (data: ApiData) => void;
}

// --- HELPER FUNCTIONS ---
const getWeatherIcon = (code: number) => {
  if ([0, 1].includes(code)) return <WbSunny sx={{ color: "#f9a825" }} />;
  if ([2].includes(code)) return <Cloud sx={{ color: "#90a4ae" }} />;
  if ([3].includes(code)) return <Cloud sx={{ color: "#546e7a" }} />;
  if ([45, 48].includes(code)) return <FilterDrama sx={{ color: "#b0bec5" }} />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
    return <Grain sx={{ color: "#42a5f5" }} />;
  if ([71, 73, 75, 85, 86].includes(code))
    return <AcUnit sx={{ color: "#81d4fa" }} />;
  if ([95, 96, 99].includes(code))
    return <Thunderstorm sx={{ color: "#212121" }} />;
  return <WbSunny sx={{ color: "#f9a825" }} />;
};

const formatDay = (dateString: string) => {
  return format(new Date(`${dateString}T12:00:00`), "MMM d");
};

const TimezoneDisplay: React.FC<{ timezoneData: TimezoneData }> = ({
  timezoneData,
}) => {
  const destinationTime = format(new Date(timezoneData.datetime), "h:mm aa");
  const localTime = format(new Date(), "h:mm aa");

  return (
    <Box display="flex" alignItems="center" gap={4} mt={2} flexWrap="wrap">
      <Box display="flex" alignItems="center" gap={1}>
        <AccessTime color="action" />
        <Box>
          <Typography variant="body2" color="text.secondary">
            Your Time
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {localTime}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <AccessTime color="primary" />
        <Box>
          <Typography variant="body2" color="text.secondary">
            {timezoneData.timezone.split("/").pop()?.replace("_", " ")} Time
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {destinationTime}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {timezoneData.abbreviation} ({timezoneData.utc_offset})
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// --- MAIN COMPONENT ---
const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  city,
  startDate,
  endDate,
  onDataFetched,
}) => {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // ✅ Fixed typing

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city || !startDate || !endDate) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<ApiData>("/api/weather", {
          params: { city, startDate, endDate },
        });

        // 1️⃣ Save local data
        setData(response.data);

        // 2️⃣ Send back to parent
        onDataFetched(response.data);
      } catch (err: any) {
        console.error("Weather API error:", err);
        setError("Could not load weather data."); // ✅ Works now
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, startDate, endDate, onDataFetched]);

  // --- UI States ---
  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Loading forecast & time...
        </Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Alert severity="error">{error || "Server error fetching data"}</Alert>
    );
  }

  // --- MAIN RENDER ---
  return (
    <Box>
      {/* Timezone Display */}
      <TimezoneDisplay timezoneData={data.timezone} />

      {/* Weather Forecast */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Weather Forecast for {city}
      </Typography>
      <Box
        display="flex"
        gap={2}
        overflow="auto"
        pb={1}
        sx={{
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#e0e0e0",
            borderRadius: 4,
          },
        }}
      >
        {data.weather.time.map((day, index) => (
          <Box
            key={day}
            component={ListItem}
            sx={{
              display: "inline-flex",
              flexDirection: "column",
              p: 2,
              minWidth: 120,
              textAlign: "center",
              flexShrink: 0,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {formatDay(day)}
            </Typography>
            <Box my={1}>{getWeatherIcon(data.weather.weathercode[index])}</Box>
            <Typography variant="body1" fontWeight="bold">
              {Math.round(data.weather.temperature_2m_max[index])}°
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(data.weather.temperature_2m_min[index])}°
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WeatherWidget;
