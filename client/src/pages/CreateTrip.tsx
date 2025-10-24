import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../contexts/TripContext";
import dayjs from "dayjs";

const CreateTrip: React.FC = () => {
  const navigate = useNavigate();
  const { createTrip } = useTrip();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: {
      country: "",
      city: "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    startDate: dayjs(),
    endDate: dayjs().add(7, "day"),
    budget: {
      total: 0,
      currency: "USD",
      spent: 0,
    },
    travelers: [] as Array<{ name: string; email: string; role: string }>,
    status: "planning" as
      | "planning"
      | "upcoming"
      | "ongoing"
      | "completed"
      | "cancelled",
    tags: [] as string[],
    notes: "",
  });

  const [newTag, setNewTag] = useState("");
  const [newTraveler, setNewTraveler] = useState({
    name: "",
    email: "",
    role: "traveler",
  });

  const steps = [
    "Basic Info",
    "Destination",
    "Dates & Budget",
    "Travelers & Tags",
    "Review",
  ];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");

      setFormData((prev) => {
        const parentValue = prev[parent as keyof typeof prev];
        return {
          ...prev,
          [parent]: {
            ...(typeof parentValue === "object" && parentValue !== null
              ? (parentValue as Record<string, any>)
              : {}),
            [child]: value,
          },
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddTraveler = () => {
    if (newTraveler.name.trim() && newTraveler.email.trim()) {
      setFormData((prev) => ({
        ...prev,
        travelers: [...prev.travelers, { ...newTraveler }],
      }));
      setNewTraveler({ name: "", email: "", role: "traveler" });
    }
  };

  const handleRemoveTraveler = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      travelers: prev.travelers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const tripData = {
        ...formData,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
      };

      const newTrip = await createTrip(tripData);
      navigate(`/trips/${newTrip._id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Trip Title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) =>
                    handleChange(
                      "status",
                      e.target.value as
                        | "planning"
                        | "upcoming"
                        | "ongoing"
                        | "completed"
                        | "cancelled"
                    )
                  }
                >
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.destination.city}
                onChange={(e) =>
                  handleChange("destination.city", e.target.value)
                }
                required
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                value={formData.destination.country}
                onChange={(e) =>
                  handleChange("destination.country", e.target.value)
                }
                required
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Notes about destination"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Any special notes about your destination..."
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(newValue) => handleChange("startDate", newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(newValue) => handleChange("endDate", newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Budget"
                type="number"
                value={formData.budget.total}
                onChange={(e) =>
                  handleChange("budget.total", parseFloat(e.target.value) || 0)
                }
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.budget.currency}
                  label="Currency"
                  onChange={(e) =>
                    handleChange("budget.currency", e.target.value)
                  }
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="INR">INR</MenuItem>
                  <MenuItem value="JPY">JPY</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Typography variant="h6" gutterBottom>
                Travel Companions
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={newTraveler.name}
                      onChange={(e) =>
                        setNewTraveler((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={newTraveler.email}
                      onChange={(e) =>
                        setNewTraveler((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={newTraveler.role}
                        label="Role"
                        onChange={(e) =>
                          setNewTraveler((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                      >
                        <MenuItem value="traveler">Traveler</MenuItem>
                        <MenuItem value="organizer">Organizer</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button onClick={handleAddTraveler} sx={{ mt: 1 }}>
                  Add Traveler
                </Button>
              </Box>
              {formData.travelers.map((traveler, index) => (
                <Chip
                  key={index}
                  label={`${traveler.name} (${traveler.role})`}
                  onDelete={() => handleRemoveTraveler(index)}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Grid>

            <Grid xs={12}>
              <Typography variant="h6" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Add Tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  sx={{ mr: 1 }}
                />
                <Button onClick={handleAddTag}>Add</Button>
              </Box>
              <Box>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Trip
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Title:</strong> {formData.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formData.description}
                </Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2">
                  <strong>Destination:</strong> {formData.destination.city},{" "}
                  {formData.destination.country}
                </Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2">
                  <strong>Duration:</strong>{" "}
                  {formData.startDate.format("MMM DD")} -{" "}
                  {formData.endDate.format("MMM DD, YYYY")}
                </Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2">
                  <strong>Budget:</strong> {formData.budget.currency}{" "}
                  {formData.budget.total}
                </Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2">
                  <strong>Status:</strong> {formData.status}
                </Typography>
              </Grid>
              {formData.travelers.length > 0 && (
                <Grid xs={12}>
                  <Typography variant="subtitle2">
                    <strong>Travelers:</strong>{" "}
                    {formData.travelers.map((t) => t.name).join(", ")}
                  </Typography>
                </Grid>
              )}
              {formData.tags.length > 0 && (
                <Grid xs={12}>
                  <Typography variant="subtitle2">
                    <strong>Tags:</strong> {formData.tags.join(", ")}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Trip
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>{renderStepContent(activeStep)}</Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !formData.title ||
                    !formData.destination.city ||
                    !formData.destination.country
                  }
                >
                  {loading ? "Creating..." : "Create Trip"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && !formData.title) ||
                    (activeStep === 1 &&
                      (!formData.destination.city ||
                        !formData.destination.country))
                  }
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default CreateTrip;
