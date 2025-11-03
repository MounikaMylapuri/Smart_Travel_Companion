import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Container,
  CardMedia,
  CircularProgress,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../contexts/TripContext";
import { Trip } from "../types/trip";

// Styled components for consistent UI
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  textAlign: "center",
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 16,
  overflow: "hidden",
  cursor: "pointer",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[10],
  },
}));

const TripList: React.FC = () => {
  const navigate = useNavigate();
  const { trips, fetchTrips, loading } = useTrip();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SectionTitle variant="h4">MY TRIPS</SectionTitle>
      <SectionSubtitle variant="subtitle1">
        — explore your adventures —
      </SectionSubtitle>

      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Button
          variant="contained"
          onClick={() => navigate("/create-trip")}
          sx={{ borderRadius: 2, py: 1 }}
        >
          Create New Trip
        </Button>
      </Box>

      {/* Trip Cards List (Flexbox Container) */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3, // Spacing between items
        }}
      >
        {trips.length === 0 ? (
          <Alert severity="info" sx={{ width: "100%", borderRadius: 2 }}>
            No trips yet. Create your first trip to get started!
          </Alert>
        ) : (
          trips.map((trip) => {
            // Determine image source safely with local fallback
            const imageSource =
              trip.coverImage ||
              `/images/destinations/${trip.destination?.country?.toLowerCase() || 'default'}.jpg` ||
              "/images/travel-default.jpg";

            // Determine destination string safely (handles both string and object structures)
            const destinationString =
              typeof trip.destination === "string"
                ? trip.destination
                : trip.destination?.city && trip.destination?.country
                ? `${trip.destination.city}, ${trip.destination.country}`
                : "Unknown Destination";

            // Define totalBudget safely
            const totalBudget = trip.budget?.total || 0;

            return (
              // Flex item for responsive layout (xs=12, sm=6, md=4 equivalent)
              <Box
                key={trip._id}
                sx={{
                  flexBasis: {
                    xs: "100%",
                    sm: "calc(50% - 12px)", // 2 items per row
                    md: "calc(33.33% - 16px)", // 3 items per row
                  },
                  minWidth: 0,
                  display: "flex", // Ensures StyledCard stretches to full height
                }}
              >
                <StyledCard
                  onClick={() => navigate(`/trips/${trip._id}`)}
                  sx={{ flexGrow: 1 }} // Card fills the Box height
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={imageSource}
                    alt={destinationString}
                  />

                  {/* Card Content */}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {trip.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {destinationString}
                    </Typography>

                    <Typography variant="body2">
                      {`${new Date(
                        trip.startDate
                      ).toLocaleDateString()} - ${new Date(
                        trip.endDate
                      ).toLocaleDateString()}`}
                    </Typography>

                    <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                      {`Budget: $${totalBudget.toFixed(2)}`}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Box>
            );
          })
          // The final closing parentheses and curly brace for the ternary map block
        )}
      </Box>
    </Container>
  );
};

export default TripList;
