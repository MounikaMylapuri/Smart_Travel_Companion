import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider as CustomThemeProvider } from "./contexts/ThemeContext";
import { TripProvider } from "./contexts/TripContext";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TripDetail from "./pages/TripDetail";
import CreateTrip from "./pages/CreateTrip";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <TripProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Router>
              <CssBaseline />
              <Navbar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/trips/:id"
                  element={
                    <ProtectedRoute>
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

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </LocalizationProvider>
        </TripProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
};

export default App;
