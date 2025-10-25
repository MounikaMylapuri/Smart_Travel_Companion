import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { PackingListItem } from "../types/trip";

interface PackingListWidgetProps {
  tripId: string;
  initialItems: PackingListItem[];
}

const PackingListWidget: React.FC<PackingListWidgetProps> = ({
  tripId,
  initialItems,
}) => {
  const [items, setItems] = useState<PackingListItem[]>(initialItems);
  const [newItemText, setNewItemText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;

    setLoading(true);
    setError("");
    try {
      const response = await axios.post<PackingListItem>(
        `/api/trips/${tripId}/packing-list`,
        { item: newItemText }
      );
      setItems([...items, response.data]);
      setNewItemText("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePacked = async (item: PackingListItem) => {
    const newPackedStatus = !item.packed;
    try {
      // Optimistically update UI
      setItems(
        items.map((i) =>
          i._id === item._id ? { ...i, packed: newPackedStatus } : i
        )
      );

      await axios.put(`/api/trips/${tripId}/packing-list/${item._id}`, {
        packed: newPackedStatus,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update item");
      // Revert UI on failure
      setItems(
        items.map((i) =>
          i._id === item._id ? { ...i, packed: !newPackedStatus } : i
        )
      );
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      // Optimistically update UI
      const originalItems = items;
      setItems(items.filter((i) => i._id !== itemId));

      await axios.delete(`/api/trips/${tripId}/packing-list/${itemId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete item");
      // Revert UI on failure
      // (This assumes you'd fetch the list again or restore 'originalItems')
    }
  };

  const packedCount = items.filter((i) => i.packed).length;
  const totalCount = items.length;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Packing List ({packedCount} / {totalCount})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="New packing item"
          variant="outlined"
          size="small"
          fullWidth
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
        />
        <Button
          variant="contained"
          onClick={handleAddItem}
          disabled={loading}
          sx={{ minWidth: "auto", px: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add"}
        </Button>
      </Box>

      <List sx={{ maxHeight: 300, overflow: "auto" }}>
        {items.map((item) => (
          <ListItem
            key={item._id}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteItem(item._id)}
              >
                <Delete />
              </IconButton>
            }
          >
            <Checkbox
              edge="start"
              checked={item.packed}
              onChange={() => handleTogglePacked(item)}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText
              primary={item.item}
              sx={{
                textDecoration: item.packed ? "line-through" : "none",
                color: item.packed ? "text.secondary" : "text.primary",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PackingListWidget;
