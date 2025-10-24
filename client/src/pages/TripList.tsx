import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  FlightTakeoff,
  LocationOn,
  CalendarToday,
  AttachMoney,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../contexts/TripContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const TripList: React.FC = () => {
  const navigate = useNavigate();
  const { trips, fetchTrips, deleteTrip, loading } = useTrip();
  const [filteredTrips, setFilteredTrips] = useState(trips);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    let filtered = trips;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((trip) => trip.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (trip) =>
          trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trip.destination.city
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          trip.destination.country
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTrips(filtered);
  }, [trips, filterStatus, searchTerm]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    tripId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedTripId(tripId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTripId(null);
  };

  const handleDeleteClick = (tripId: string) => {
    setTripToDelete(tripId);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (tripToDelete) {
      try {
        await deleteTrip(tripToDelete);
        setDeleteDialogOpen(false);
        setTripToDelete(null);
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "ongoing":
        return "warning";
      case "upcoming":
        return "primary";
      case "planning":
        return "default";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  const calculateDays = (startDate: string, endDate: string) => {
    return Math.ceil(
      (dayjs(endDate).valueOf() - dayjs(startDate).valueOf()) /
        (1000 * 60 * 60 * 24)
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <Typography>Loading trips...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Typography variant="h4" gutterBottom>
            My Trips
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/create-trip")}
          >
            New Trip
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Search trips"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="planning">Planning</MenuItem>
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="ongoing">Ongoing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <Box textAlign="center" sx={{ py: 8 }}>
            <FlightTakeoff
              sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {trips.length === 0
                ? "No trips yet"
                : "No trips match your filters"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {trips.length === 0
                ? "Start planning your next adventure!"
                : "Try adjusting your search criteria"}
            </Typography>
            {trips.length === 0 && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/create-trip")}
              >
                Create Your First Trip
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredTrips.map((trip) => (
              <Grid item xs={12} sm={6} md={4} key={trip._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      sx={{ mb: 2 }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                      >
                        {trip.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, trip._id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <LocationOn color="action" sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {trip.destination.city}, {trip.destination.country}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <CalendarToday
                        color="action"
                        sx={{ mr: 1, fontSize: 20 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(trip.startDate)} -{" "}
                        {formatDate(trip.endDate)}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                      <AttachMoney
                        color="action"
                        sx={{ mr: 1, fontSize: 20 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ${trip.budget.total} •{" "}
                        {calculateDays(trip.startDate, trip.endDate)} days
                      </Typography>
                    </Box>

                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip
                        label={trip.status}
                        color={getStatusColor(trip.status) as any}
                        size="small"
                      />
                      {trip.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/trips/${trip._id}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              navigate(`/trips/${selectedTripId}`);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`/trips/${selectedTripId}/edit`);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Trip</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleDeleteClick(selectedTripId!)}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Trip</ListItemText>
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Trip</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this trip? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() => navigate("/create-trip")}
        >
          <Add />
        </Fab>
      </Container>
    </LocalizationProvider>
  );
};

export default TripList;
