import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Icon, // Keep Icon
} from "@mui/material";
import {
  WbSunny,
  Cloud,
  Grain,
  AcUnit,
  Thunderstorm,
  FilterDrama,
  AccessTime, // Import time icon
} from "@mui/icons-material";
import { format } from "date-fns";

// Props (no change)
interface WeatherWidgetProps {
  city: string;
  startDate: string;
  endDate: string;
}

// --- UPDATED INTERFACES ---

// This interface is the same as before
interface DailyWeather {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

// New interface for the timezone data from WorldTimeAPI
interface TimezoneData {
  datetime: string;
  abbreviation: string;
  timezone: string;
  utc_offset: string;
}

// New wrapper interface for the combined API response
interface ApiData {
  weather: DailyWeather;
  timezone: TimezoneData;
}

// --- HELPER FUNCTIONS (No changes) ---
const getWeatherIcon = (code: number) => {
  if ([0, 1].includes(code)) return <WbSunny sx={{ color: "#f9a825" }} />;
  if ([2].includes(code)) return <Cloud sx={{ color: "#90a4ae" }} />;
  // ... (rest of the function is the same)
  if ([95, 96, 99].includes(code))
    return <Thunderstorm sx={{ color: "#212121" }} />;
  return <WbSunny sx={{ color: "#f9a825" }} />;
};

const formatDay = (dateString: string) => {
  return format(new Date(`${dateString}T12:00:00`), "MMM d");
};

// --- NEW TIMEZONE DISPLAY COMPONENT ---
// A small component to neatly display the time
const TimezoneDisplay: React.FC<{ timezoneData: TimezoneData }> = ({
  timezoneData,
}) => {
  // Get the local time of the destination
  const destinationTime = format(new Date(timezoneData.datetime), "h:mm aa");
  // Get the user's current local time
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

// --- MAIN WIDGET COMPONENT ---
const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  city,
  startDate,
  endDate,
}) => {
  // State is updated to use the new ApiData interface
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeatherAndTime = async () => {
      const apiStartDate = format(new Date(startDate), "yyyy-MM-dd");
      const apiEndDate = format(new Date(endDate), "yyyy-MM-dd");

      setLoading(true);
      setError("");
      try {
        // The API response is now typed to ApiData
        const response = await axios.get<ApiData>("/api/weather", {
          params: { city, startDate: apiStartDate, endDate: apiEndDate },
        });
        // Set the combined data object in state
        setData(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Could not fetch weather data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherAndTime();
  }, [city, startDate, endDate]); // Dependency array is unchanged

  // Loading and Error states are unchanged
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress size={24} />
        <Typography sx={{ ml: 2 }}>Loading forecast & time...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Check for 'data' instead of 'weather'
  if (!data) {
    return null;
  }

  // --- UPDATED JSX ---
  return (
    <Box>
      {/* 1. Timezone Display (New) */}
      <TimezoneDisplay timezoneData={data.timezone} />

      {/* 2. Weather Forecast (Updated) */}
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
        {/* Access 'data.weather' instead of just 'weather' */}
        {data.weather.time.map((day, index) => (
          <Paper
            key={day}
            elevation={2}
            sx={{ p: 2, minWidth: 120, textAlign: "center", flexShrink: 0 }}
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
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default WeatherWidget;
