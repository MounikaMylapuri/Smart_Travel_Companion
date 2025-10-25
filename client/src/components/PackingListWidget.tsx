import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button,
} from "@mui/material";
import { CloudDownload, CheckCircle } from "@mui/icons-material";

interface Item {
  name: string;
  category: string;
  required: boolean;
  packed: boolean; // Add state for packing
}

interface PackingListWidgetProps {
  city: string;
  country: string;
  // We need these stats from the weather API call result
  avgTempMax: number;
  isRainy: boolean;
}

// NOTE: PDF Export is a separate task we can tackle next
const PackingListWidget: React.FC<PackingListWidgetProps> = ({
  city,
  country,
  avgTempMax,
  isRainy,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChecklist = async () => {
      if (!city || !avgTempMax) return;

      setLoading(true);
      setError("");
      try {
        // Call our new backend API with the determined parameters
        const response = await axios.get<Item[]>("/api/checklist", {
          params: {
            city,
            country,
            avgTempMax,
            isRainy: isRainy ? "true" : "false",
          },
        });

        // Add 'packed: false' state for the frontend
        const listItems = response.data.map((item) => ({
          ...item,
          packed: false,
        }));
        setItems(listItems);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Could not generate packing list."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchChecklist();
  }, [city, country, avgTempMax, isRainy]);

  // Handle user checking an item
  const handleToggle = (name: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.name === name ? { ...item, packed: !item.packed } : item
      )
    );
  };

  if (loading) {
    return (
      <Box>
        <CircularProgress size={20} />
        <Typography sx={{ ml: 2 }}>Generating Checklist...</Typography>
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Group items by category (Clothing, Essentials, etc.)
  const groupedItems = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Packing Checklist</Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<CloudDownload />}
          // onClick={handleExportPDF} // To be implemented
        >
          Export PDF
        </Button>
      </Box>

      {items.length === 0 && (
        <Alert severity="info" sx={{ mt: 1 }}>
          Returning basic list. Template not found for these conditions.
        </Alert>
      )}

      {Object.entries(groupedItems).map(([category, list]) => (
        <Box key={category} mt={2}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ textTransform: "capitalize" }}
          >
            {category}
          </Typography>
          <List dense>
            {list.map((item) => (
              <ListItem
                key={item.name}
                onClick={() => handleToggle(item.name)}
                sx={{ cursor: "pointer", py: 0 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Checkbox
                    edge="start"
                    checked={item.packed}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  secondary={item.required ? "Required" : "Optional"}
                  sx={{ textDecoration: item.packed ? "line-through" : "none" }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default PackingListWidget;
