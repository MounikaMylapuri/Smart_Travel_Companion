import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import {
  LocationOn,
  CalendarToday,
  AttachMoney,
  People,
  Edit,
  Add,
  Schedule,
  CloudQueue,
  Map,
  Photo,
  Note,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useTrip } from "../contexts/TripContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`trip-tabpanel-${index}`}
      aria-labelledby={`trip-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTrip, fetchTrip, updateTrip, loading } = useTrip();
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    status: "planning" as
      | "planning"
      | "upcoming"
      | "ongoing"
      | "completed"
      | "cancelled",
    budget: { total: 0, currency: "USD", spent: 0 },
    notes: "",
  });

  useEffect(() => {
    if (id) {
      fetchTrip(id);
    }
  }, [id, fetchTrip]);

  useEffect(() => {
    if (currentTrip) {
      setEditData({
        title: currentTrip.title,
        description: currentTrip.description,
        status: currentTrip.status,
        budget: currentTrip.budget,
        notes: currentTrip.notes,
      });
    }
  }, [currentTrip]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (id) {
      try {
        await updateTrip(id, editData);
        setEditDialogOpen(false);
      } catch (error) {
        console.error("Error updating trip:", error);
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
        <Typography>Loading trip details...</Typography>
      </Container>
    );
  }

  if (!currentTrip) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Trip not found</Alert>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              {currentTrip.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {currentTrip.description}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                label={currentTrip.status}
                color={getStatusColor(currentTrip.status) as any}
                size="small"
              />
              {currentTrip.tags.map((tag, index) => (
                <Chip key={index} label={tag} variant="outlined" size="small" />
              ))}
            </Box>
          </Box>
          <Button variant="outlined" startIcon={<Edit />} onClick={handleEdit}>
            Edit Trip
          </Button>
        </Box>

        {/* Quick Info Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <LocationOn color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Destination
                    </Typography>
                    <Typography variant="h6">
                      {currentTrip.destination.city}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentTrip.destination.country}
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
                  <CalendarToday color="secondary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Duration
                    </Typography>
                    <Typography variant="h6">
                      {calculateDays(
                        currentTrip.startDate,
                        currentTrip.endDate
                      )}{" "}
                      days
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(currentTrip.startDate)} -{" "}
                      {formatDate(currentTrip.endDate)}
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
                  <AttachMoney color="success" sx={{ mr: 2 }} />
                  <Box>
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
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <People color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Travelers
                    </Typography>
                    <Typography variant="h6">
                      {currentTrip.travelers.length + 1}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Including you
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ width: "100%" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="trip details tabs"
          >
            <Tab icon={<Schedule />} label="Itinerary" />
            <Tab icon={<CloudQueue />} label="Weather" />
            <Tab icon={<Map />} label="Map" />
            <Tab icon={<Photo />} label="Photos" />
            <Tab icon={<Note />} label="Notes" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6">Daily Itinerary</Typography>
              <Button variant="contained" startIcon={<Add />}>
                Add Activity
              </Button>
            </Box>
            <Alert severity="info">
              Itinerary management will be implemented in the next phase. For
              now, you can view basic trip information.
            </Alert>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Weather Forecast
            </Typography>
            <Alert severity="info">
              Weather integration will be implemented with real-time API data.
            </Alert>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Interactive Map
            </Typography>
            <Alert severity="info">
              Map integration will show trip locations and routes.
            </Alert>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Trip Photos
            </Typography>
            {currentTrip.photos.length === 0 ? (
              <Alert severity="info">
                No photos uploaded yet. Upload photos to share your travel
                memories!
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {currentTrip.photos.map((photo, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Photo {index + 1}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" gutterBottom>
              Trip Notes
            </Typography>
            {currentTrip.notes ? (
              <Paper sx={{ p: 2 }}>
                <Typography variant="body1">{currentTrip.notes}</Typography>
              </Paper>
            ) : (
              <Alert severity="info">
                No notes added yet. Add notes to remember important details
                about your trip!
              </Alert>
            )}
          </TabPanel>
        </Paper>

        {/* Travelers List */}
        {currentTrip.travelers.length > 0 && (
          <Paper sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Travel Companions
            </Typography>
            <List>
              {currentTrip.travelers.map((traveler, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <People />
                    </ListItemIcon>
                    <ListItemText
                      primary={traveler.name}
                      secondary={`${traveler.email} • ${traveler.role}`}
                    />
                  </ListItem>
                  {index < currentTrip.travelers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}

        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Trip</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={editData.title}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, title: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={editData.description}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Budget"
              type="number"
              value={editData.budget.total}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  budget: {
                    ...prev.budget,
                    total: parseFloat(e.target.value) || 0,
                  },
                }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={editData.notes}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default TripDetail;
