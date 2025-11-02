import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  PaletteMode,
} from "@mui/material";

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(
    (localStorage.getItem("themeMode") as PaletteMode) || "light"
  );

  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  }, []);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#1976d2",
            light: "#42a5f5",
            dark: "#1565c0",
          },
          secondary: {
            main: "#ff9800",
            light: "#ffb74d",
            dark: "#f57c00",
          },
          ...(mode === "light"
            ? {
                background: {
                  default: "#f5f5f5",
                  paper: "#ffffff",
                },
              }
            : {
                background: {
                  default: "#121212",
                  paper: "#1e1e1e",
                },
              }),
          ...(mode === "dark" && {
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
          }),
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: "none",
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow:
                  mode === "light"
                    ? "0px 2px 8px rgba(0, 0, 0, 0.1)"
                    : "0px 2px 8px rgba(0, 0, 0, 0.3)",
              },
            },
          },
        },
      }),
    [mode]
  );

  const contextValue = useMemo(
    () => ({ mode, toggleColorMode }),
    [mode, toggleColorMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
