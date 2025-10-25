import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useTrip } from "../contexts/TripContext";

// Import all required widgets
import WeatherWidget from "../components/WeatherWidget";
import LandmarksWidget from "../components/LandmarksWidget";
import PhrasebookWidget from "../components/PhrasebookWidget";
import TripPlannerWidget from "../components/TripPlannerWidget";
import PackingListWidget from "../components/PackingListWidget"; // NEW WIDGET

import { Trip } from "../types/trip";

// --- REQUIRED INTERFACES FOR WEATHER DATA ---
// NOTE: These should ideally be imported from a centralized types file
interface DailyWeather {
  temperature_2m_max: number[];
  weathercode: number[];
  // Add other fields you use in the WeatherWidget
}
interface TimezoneData {
  // Add fields you use
}
interface ApiData {
  weather: DailyWeather;
  timezone: TimezoneData;
}
// ------------------------------------------

// --- PURE HELPER FUNCTIONS ---

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const calculateDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

// --- START OF COMPONENT BODY ---

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Hooks must be called first
  const { currentTrip, fetchTrip, loading } = useTrip();

  // State to store the weather response passed back from the WeatherWidget
  const [weatherData, setWeatherData] = useState<ApiData | null>(null);

  useEffect(() => {
    if (id) {
      fetchTrip(id);
    }
  }, [id, fetchTrip]);

  // Calculate total trip days for the Duration card
  const tripDays = calculateDays(
    currentTrip?.startDate || "",
    currentTrip?.endDate || ""
  );

  // Helper map to convert country to language for phrasebook
  const languageMap: { [country: string]: string } = {
    japan: "japanese",
    france: "french",
    italy: "italian",
    india: "hindi",
    usa: "english",
    uk: "english",
    australia: "english",
    egypt: "arabic",
    brazil: "portuguese",
    china: "chinese",
  };

  const tripLanguage =
    languageMap[currentTrip?.destination.country.toLowerCase() || ""] ||
    "english";

  // Callback to capture data from the WeatherWidget (passed as a prop)
  const handleWeatherFetched = useCallback((data: ApiData) => {
    setWeatherData(data);
  }, []);

  // Memoized calculation of packing list properties
  const packingProps = useMemo(() => {
    if (!weatherData) return { avgTempMax: 0, isRainy: false };

    const maxTemps = weatherData.weather.temperature_2m_max;
    const weatherCodes = weatherData.weather.weathercode;

    // Calculate Average Max Temperature
    const avgTempMax =
      maxTemps.length > 0
        ? maxTemps.reduce((sum, temp) => sum + temp, 0) / maxTemps.length
        : 0;

    // Determine if it is rainy (WMO codes 51-65, 80-82, 95-99 are drizzle/rain/thunderstorm)
    const isRainy = weatherCodes.some(
      (code) =>
        (code >= 51 && code <= 65) || (code >= 80 && code <= 82) || code >= 95
    );

    return { avgTempMax: Math.round(avgTempMax), isRainy };
  }, [weatherData]);

  // --- CONDITIONAL RENDERING ---

  if (loading || !currentTrip) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!id) {
    return (
      <Box p={4}>
        <Alert severity="error">Invalid Trip ID</Alert>
        <Button onClick={() => navigate("/trips")} sx={{ mt: 2 }}>
          Back to Trips
        </Button>
      </Box>
    );
  }

  // --- FINAL RENDER ---

  return (
    <Box p={4} display="flex" flexDirection="column" gap={4}>
      {/* 1. HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            {currentTrip.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {currentTrip.description}
          </Typography>
          <Typography variant="body2" color="primary">
            Status: {currentTrip.status}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => navigate("/trips")}>
          Back to Trips
        </Button>
      </Box>

      {/* 2. QUICK INFO CARDS */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        {/* ... All 4 info cards remain unchanged, using tripDays variable ... */}
        <Card sx={{ flex: "1 1 200px" }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Destination
            </Typography>
            <Typography variant="h6">{currentTrip.destination.city}</Typography>
            <Typography variant="body2" color="text.secondary">
              {currentTrip.destination.country}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: "1 1 200px" }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Duration
            </Typography>
            <Typography variant="h6">{tripDays} days</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(currentTrip.startDate)} -{" "}
              {formatDate(currentTrip.endDate)}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: "1 1 200px" }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Budget
            </Typography>
            <Typography variant="h6">
              {currentTrip.budget.currency}{" "}
              {currentTrip.budget.total.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Spent: {currentTrip.budget.spent}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: "1 1 200px" }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Travelers
            </Typography>
            <Typography variant="h6">
              {currentTrip.travelers.length + 1}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Including you
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 3. TWO-COLUMN LAYOUT (All Widgets) */}
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        {/* --- LEFT COLUMN (2/3 Width) --- */}
        <Box
          sx={{
            width: { xs: "100%", md: "66.66%" },
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* WEATHER WIDGET (Sends data back via prop) */}
          <Card>
            <CardContent>
              <WeatherWidget
                city={currentTrip.destination.city}
                startDate={currentTrip.startDate}
                endDate={currentTrip.endDate}
                onDataFetched={handleWeatherFetched} // NEW PROP
              />
            </CardContent>
          </Card>

          {/* PACKING LIST WIDGET (Receives calculated data) */}
          <Card>
            <CardContent>
              <PackingListWidget
                city={currentTrip.destination.city}
                country={currentTrip.destination.country}
                avgTempMax={packingProps.avgTempMax}
                isRainy={packingProps.isRainy}
              />
            </CardContent>
          </Card>

          {/* TRIP PLANNER WIDGET */}
          <Card>
            <CardContent>
              <TripPlannerWidget
                city={currentTrip.destination.city}
                startDate={currentTrip.startDate}
                endDate={currentTrip.endDate}
              />
            </CardContent>
          </Card>

          {/* PHRASEBOOK WIDGET */}
          <Card>
            <CardContent>
              <PhrasebookWidget language={tripLanguage} />
            </CardContent>
          </Card>

          {/* LANDMARKS WIDGET */}
          <Card>
            <CardContent>
              <LandmarksWidget city={currentTrip.destination.city} />
            </CardContent>
          </Card>
        </Box>

        {/* --- RIGHT COLUMN (1/3 Width) --- */}
        <Box
          sx={{
            width: { xs: "100%", md: "33.33%" },
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* TRIP DETAILS CARD */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trip Details
              </Typography>
              {currentTrip.notes && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Notes:
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {currentTrip.notes}
                  </Typography>
                </Box>
              )}
              {currentTrip.tags.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tags:
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {currentTrip.tags.map((tag, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{
                          bgcolor: "primary.light",
                          color: "primary.contrastText",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        {tag}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* TRAVELERS CARD */}
          {currentTrip.travelers.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Travel Companions
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {currentTrip.travelers.map((traveler, index) => (
                    <Box
                      key={index}
                      p={2}
                      border="1px solid #e0e0e0"
                      borderRadius={1}
                    >
                      <Typography variant="body1">{traveler.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {traveler.email} • {traveler.role}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TripDetail;
