import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CircularProgress,
  Typography,
  Alert, // Added Alert for better error/empty state handling
  CardMedia, // Added CardMedia for trip cards
  styled,
} from "@mui/material";
// NOTE: Grid component is removed from the imports
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTrip } from "../contexts/TripContext";
import { Trip } from "../types/trip"; // Assuming Trip type is available

// Styled components for consistent UI
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 12, // Slightly larger border radius for modern look
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10],
  },
}));

// Mock error state for demonstration, in a real app this would come from useTrip or local state
const error = null;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trips, fetchTrips, loading } = useTrip();
  const navigate = useNavigate();

  // Combined state for all calculated stats
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    pastTrips: 0,
    completedTrips: 0,
    totalDays: 0,
    totalBudget: 0,
    countriesVisited: [] as string[],
  });

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    if (trips.length > 0) {
      const now = new Date();

      const calculatedStats = trips.reduce(
        (acc: any, trip: Trip) => {
          const startDate = new Date(trip.startDate);
          const endDate = new Date(trip.endDate);

          acc.totalTrips += 1;

          // Logic for upcoming/past (using date difference)
          if (startDate > now) {
            acc.upcomingTrips += 1;
          }
          if (endDate < now) {
            acc.pastTrips += 1;
          }

          // Logic for completed (using status)
          if (trip.status === "completed") {
            acc.completedTrips += 1;
          }

          // Total Days calculation
          const days = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          acc.totalDays += days;

          // Total Budget calculation (assuming trip.budget.total exists)
          // Add a null check or default value for budget to prevent errors
          acc.totalBudget += trip.budget?.total || 0;

          // Countries Visited calculation
          if (
            trip.destination?.country &&
            !acc.countriesVisited.includes(trip.destination.country)
          ) {
            acc.countriesVisited.push(trip.destination.country);
          }
          return acc;
        },
        {
          totalTrips: 0,
          upcomingTrips: 0,
          pastTrips: 0,
          completedTrips: 0,
          totalDays: 0,
          totalBudget: 0,
          countriesVisited: [] as string[],
        }
      );
      setStats(calculatedStats);
    }
  }, [trips]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <SectionTitle variant="h4" gutterBottom>
        Welcome back, {user?.name || "Traveler"}!
      </SectionTitle>

      {/* --- 📊 Statistical Cards Section (Flexbox) --- */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3, // Spacing between items
          mb: 4,
        }}
      >
        {/* Stat Card 1: Total Trips (Layout: xs=12, sm=4) */}
        <Box
          sx={{
            flexBasis: { xs: "100%", sm: "calc(33.33% - 16px)" },
            minWidth: 0,
            display: "flex", // Allows card to take 100% height
          }}
        >
          <StyledCard sx={{ flexGrow: 1 }}>
            <CardContent>
              <SectionSubtitle variant="h6">Total Trips</SectionSubtitle>
              <Typography variant="h3" color="primary">
                {stats.totalTrips}
              </Typography>
            </CardContent>
          </StyledCard>
        </Box>

        {/* Stat Card 2: Upcoming Trips (Layout: xs=12, sm=4) */}
        <Box
          sx={{
            flexBasis: { xs: "100%", sm: "calc(33.33% - 16px)" },
            minWidth: 0,
            display: "flex",
          }}
        >
          <StyledCard sx={{ flexGrow: 1 }}>
            <CardContent>
              <SectionSubtitle variant="h6">Upcoming Trips</SectionSubtitle>
              <Typography variant="h3" color="primary">
                {stats.upcomingTrips}
              </Typography>
            </CardContent>
          </StyledCard>
        </Box>

        {/* Stat Card 3: Past Trips (Layout: xs=12, sm=4) */}
        <Box
          sx={{
            flexBasis: { xs: "100%", sm: "calc(33.33% - 16px)" },
            minWidth: 0,
            display: "flex",
          }}
        >
          <StyledCard sx={{ flexGrow: 1 }}>
            <CardContent>
              <SectionSubtitle variant="h6">Past Trips</SectionSubtitle>
              <Typography variant="h3" color="primary">
                {stats.pastTrips}
              </Typography>
            </CardContent>
          </StyledCard>
        </Box>
      </Box>

      {/* Additional Stats Section - Using a 4-column layout for variety */}
      <SectionTitle variant="h5" sx={{ mt: 6, mb: 3 }}>
        Your Travel Log
      </SectionTitle>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 4,
        }}
      >
        {/* Completed Trips (xs=12, sm=6, md=3) */}
        <Box
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 12px)",
              md: "calc(25% - 18px)",
            },
            minWidth: 0,
            display: "flex",
          }}
        >
          <StyledCard sx={{ flexGrow: 1 }}>
            <CardContent>
              <SectionSubtitle variant="h6">Completed</SectionSubtitle>
              <Typography variant="h3" color="primary">
                {stats.completedTrips}
              </Typography>
            </CardContent>
          </StyledCard>
        </Box>

        {/* Total Days (xs=12, sm=6, md=3) */}
        <Box
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 12px)",
              md: "calc(25% - 18px)",
            },
            minWidth: 0,
            display: "flex",
          }}
        >
          <StyledCard sx={{ flexGrow: 1 }}>
            <CardContent>
              <SectionSubtitle variant="h6">Total Days</SectionSubtitle>
              <Typography variant="h3" color="primary">
                {stats.totalDays}
              </Typography>
            </CardContent>
          </StyledCard>
        </Box>

        {/* Budget Spent (xs=12, sm=6, md=3) */}
        <Box
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 12px)",
              md: "calc(25% - 18px)",
            },
            minWidth: 0,
            display: "flex",
          }}
        >
          <StyledCard sx={{ flexGrow: 1 }}>
            <CardContent>
              <SectionSubtitle variant="h6">Budget Spent</SectionSubtitle>
              <Typography variant="h3" color="primary">
                ${stats.totalBudget.toFixed(2)}
              </Typography>
            </CardContent>
          </StyledCard>
        </Box>

        {/* Countries Visited (xs=12, sm=6, md=3) - Using Countries Visited count instead of the full array */}
        <Box
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 12px)",
              md: "calc(25% - 18px)",
            },
            minWidth: 0,
            display: "flex",
          }}
        >
          <StyledCard sx={{ flexGrow: 1 }}>
            <CardContent>
              <SectionSubtitle variant="h6">Countries Visited</SectionSubtitle>
              <Typography variant="h3" color="primary">
                {stats.countriesVisited.length}
              </Typography>
            </CardContent>
          </StyledCard>
        </Box>
      </Box>

      {/* --- 🚀 Quick Actions Section (Flexbox) --- */}
      <SectionTitle variant="h5" sx={{ mt: 6, mb: 3 }}>
        Quick Actions
      </SectionTitle>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3, // Spacing between items
        }}
      >
        {/* Quick Action Card 1 (Layout: xs=12, sm=6, md=4) */}
        <Box
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 12px)",
              md: "calc(33.33% - 16px)",
            },
            minWidth: 0,
            display: "flex",
          }}
        >
          <StyledCard sx={{ flexGrow: 1 }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <SectionSubtitle variant="h6">View All Trips</SectionSubtitle>
              <Typography variant="body2" color="text.secondary" paragraph>
                Browse through all your planned and past trips.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/trips")}
              >
                Go to Trips
              </Button>
            </CardContent>
          </StyledCard>
        </Box>

        {/* Quick Action Card 2 (Layout: xs=12, sm=6, md=4) */}
        <Box
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 12px)",
              md: "calc(33.33% - 16px)",
            },
            minWidth: 0,
            display: "flex",
          }}
        >
          <StyledCard sx={{ flexGrow: 1 }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <SectionSubtitle variant="h6">Plan New Trip</SectionSubtitle>
              <Typography variant="body2" color="text.secondary" paragraph>
                Start planning your next adventure.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/create-trip")}
              >
                Create Trip
              </Button>
            </CardContent>
          </StyledCard>
        </Box>

        {/* Quick Action Card 3 (Layout: xs=12, sm=6, md=4) */}
        <Box
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 12px)",
              md: "calc(33.33% - 16px)",
            },
            minWidth: 0,
            display: "flex",
          }}
        >
          <StyledCard sx={{ flexGrow: 1 }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <SectionSubtitle variant="h6">Update Profile</SectionSubtitle>
              <Typography variant="body2" color="text.secondary" paragraph>
                Update your personal information and preferences.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/profile")}
              >
                Go to Profile
              </Button>
            </CardContent>
          </StyledCard>
        </Box>
      </Box>

      {/* --- ✈️ Trip Cards List Section (The 'Your Trips' from the second snippet) --- */}
      <SectionTitle variant="h5" sx={{ mt: 6, mb: 3 }}>
        Your Trips
      </SectionTitle>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {error ? (
          <Alert severity="error" sx={{ width: "100%" }}>
            Error loading trips.
          </Alert>
        ) : trips.length === 0 ? (
          <Alert severity="info" sx={{ width: "100%" }}>
            You haven't created any trips yet. Click "Create Trip" above to get
            started!
          </Alert>
        ) : (
          trips.map((trip) => (
            // Trip Card Item (Layout: xs=12, sm=6, md=4)
            <Box
              key={trip._id}
              sx={{
                flexBasis: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(33.33% - 16px)",
                },
                minWidth: 0,
                display: "flex",
                cursor: "pointer",
              }}
            >
              <StyledCard
                onClick={() => navigate(`/trips/${trip._id}`)}
                sx={{ flexGrow: 1 }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    trip.coverImage ||
                    `/images/destinations/${trip.destination?.country?.toLowerCase() || 'default'}.jpg` ||
                    "/images/travel-default.jpg"
                  }
                  alt={trip.name}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {trip.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trip.destination.city}, {trip.destination.country}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(trip.startDate).toLocaleDateString()} -{" "}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "inline-block",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      mt: 1,
                      bgcolor:
                        trip.status === "completed"
                          ? "success.light"
                          : "info.light",
                    }}
                  >
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
