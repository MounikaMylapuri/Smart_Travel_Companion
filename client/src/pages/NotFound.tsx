import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SentimentVeryDissatisfied } from "@mui/icons-material";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: 5,
          mt: 10,
          textAlign: "center",
          borderRadius: 4,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
        }}
      >
        <SentimentVeryDissatisfied
          sx={{ fontSize: 100, color: "primary.main", mb: 2 }}
        />

        <Typography variant="h2" gutterBottom>
          404
        </Typography>

        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          The page you are looking for doesn't exist or has been moved.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/dashboard")}
            sx={{ px: 4, py: 1.5 }}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;
