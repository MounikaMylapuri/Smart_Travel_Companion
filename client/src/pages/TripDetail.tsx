import React, { useEffect } from "react";
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
import WeatherWidget from "../components/WeatherWidget";
import LandmarksWidget from "../components/LandmarksWidget"; // Import new widget
import { Trip } from "../types/trip";

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTrip, fetchTrip, loading } = useTrip();

  useEffect(() => {
    if (id) {
      fetchTrip(id);
    }
  }, [id, fetchTrip]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Add 1 to include both start and end dates
  };

  return (
    <Box p={4} display="flex" flexDirection="column" gap={4}>
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

      {/* Quick Info Cards */}
      <Box display="flex" flexWrap="wrap" gap={3}>
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
            <Typography variant="h6">
              {calculateDays(currentTrip.startDate, currentTrip.endDate)} days
            </Typography>
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

      {/* --- WEATHER WIDGET --- */}
      <Card>
        <CardContent>
          <WeatherWidget
            city={currentTrip.destination.city}
            startDate={currentTrip.startDate}
            endDate={currentTrip.endDate}
          />
        </CardContent>
      </Card>

      {/* --- NEW LANDMARKS WIDGET --- */}
      <Card>
        <CardContent>
          <LandmarksWidget city={currentTrip.destination.city} />
        </CardContent>
      </Card>

      {/* Trip Details */}
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

      {/* Travelers */}
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
  );
};

export default TripDetail;
