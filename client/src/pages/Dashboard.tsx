import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  FlightTakeoff,
  LocationOn,
  CalendarToday,
  AttachMoney,
  TrendingUp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTrip } from "../contexts/TripContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trips, fetchTrips, loading } = useTrip();
  const [stats, setStats] = useState({
    totalTrips: 0,
    completedTrips: 0,
    totalDays: 0,
    totalBudget: 0,
    countriesVisited: [] as string[],
  });

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    // Calculate stats from trips
    const calculatedStats = trips.reduce(
      (acc, trip) => {
        acc.totalTrips += 1;
        if (trip.status === "completed") {
          acc.completedTrips += 1;
        }
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);
        const days = Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        acc.totalDays += days;
        acc.totalBudget += trip.budget.total;
        if (!acc.countriesVisited.includes(trip.destination.country)) {
          acc.countriesVisited.push(trip.destination.country);
        }
        return acc;
      },
      {
        totalTrips: 0,
        completedTrips: 0,
        totalDays: 0,
        totalBudget: 0,
        countriesVisited: [] as string[],
      }
    );
    setStats(calculatedStats);
  }, [trips]);

  const upcomingTrips = trips
    .filter((trip) => trip.status === "upcoming" || trip.status === "planning")
    .slice(0, 3);

  const recentTrips = trips.slice(0, 3);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const chartData = trips.map((trip) => ({
    name: trip.title,
    budget: trip.budget.total,
    days: Math.ceil(
      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ),
  }));

  const statusData = [
    { name: "Completed", value: stats.completedTrips, color: "#00C49F" },
    {
      name: "Upcoming",
      value: stats.totalTrips - stats.completedTrips,
      color: "#0088FE",
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's an overview of your travel adventures
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <FlightTakeoff color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Trips
                  </Typography>
                  <Typography variant="h4">{stats.totalTrips}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <LocationOn color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Countries Visited
                  </Typography>
                  <Typography variant="h4">
                    {stats.countriesVisited.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarToday color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Days Traveled
                  </Typography>
                  <Typography variant="h4">{stats.totalDays}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AttachMoney color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Budget
                  </Typography>
                  <Typography variant="h4">
                    ${stats.totalBudget.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trip Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="budget" stroke="#8884d8" />
                <Line type="monotone" dataKey="days" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Status Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trip Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Upcoming Trips */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Trips
            </Typography>
            {upcomingTrips.length === 0 ? (
              <Alert severity="info">
                No upcoming trips.{" "}
                <Button onClick={() => navigate("/create-trip")}>
                  Create one!
                </Button>
              </Alert>
            ) : (
              upcomingTrips.map((trip) => (
                <Card key={trip._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {trip.title}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {trip.destination.city}, {trip.destination.country}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <Chip
                        label={trip.status}
                        color={
                          trip.status === "upcoming" ? "primary" : "default"
                        }
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2">
                      {new Date(trip.startDate).toLocaleDateString()} -{" "}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/trips/${trip._id}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              ))
            )}
          </Paper>
        </Grid>

        {/* Recent Trips */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Trips
            </Typography>
            {recentTrips.length === 0 ? (
              <Alert severity="info">
                No trips yet.{" "}
                <Button onClick={() => navigate("/create-trip")}>
                  Create your first trip!
                </Button>
              </Alert>
            ) : (
              recentTrips.map((trip) => (
                <Card key={trip._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {trip.title}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {trip.destination.city}, {trip.destination.country}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <Chip
                        label={trip.status}
                        color={
                          trip.status === "completed"
                            ? "success"
                            : trip.status === "ongoing"
                            ? "warning"
                            : trip.status === "upcoming"
                            ? "primary"
                            : "default"
                        }
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2">
                      Budget: ${trip.budget.total} | Days:{" "}
                      {Math.ceil(
                        (new Date(trip.endDate).getTime() -
                          new Date(trip.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/trips/${trip._id}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
