import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./contexts/AuthContext";
import { TripProvider, useTrip } from "./contexts/TripContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TripList from "./pages/TripList";
import TripDetail from "./pages/TripDetail";
import CreateTrip from "./pages/CreateTrip";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

const theme = createTheme({
  palette: { primary: { main: "#1976d2" }, secondary: { main: "#dc004e" } },
});

function AppRoutes() {
  const { trips, currentTrip } = useTrip();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {/* This is correct: Dashboard needs the primary currentTrip */}
            {currentTrip && <Dashboard currentTrip={currentTrip} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            {/* This is correct: TripList needs all trips */}
            <TripList filteredTrips={trips} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:id"
        element={
          <ProtectedRoute>
            {/*
              This is also correct. TripDetail (your selected file) 
              fetches its own data based on the URL :id, 
              so it does not need props.
            */}
            <TripDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-trip"
        element={
          <ProtectedRoute>
            <CreateTrip />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <TripProvider>
          <Router>
            <Navbar />
            <AppRoutes />
          </Router>
        </TripProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
