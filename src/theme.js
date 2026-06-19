import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// ─── COLOR DESIGN TOKENS ────────────────────────────────────────────────────

export const tokens = {
  // Greys
  grey: {
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
  },

  // Backgrounds (dark navy)
  background: {
    default:  "#131315",   // fond global le plus sombre
    paper:    "#131315",   // sidebar + drawer 
    card:     "#1e293b",   // cards / KPI boxes
    elevated: "#1e2a3a",   // modals, dropdowns
    // top : "#131315"
  },

  // Brand green (primary)
  green: {
    100: "#dbf5ee",
    200: "#b7ebde",
    300: "#94e2cd",
    400: "#70d8bd",
    500: "#4cceac",  // ← accent principal
    600: "#3da58a",
    700: "#2e7c67",
    800: "#1e5245",
    900: "#0f2922",
  },

  // Red (danger / alertes)
  red: {
    100: "#f8dcdb",
    200: "#f1b9b7",
    300: "#e99592",
    400: "#e2726e",
    500: "#db4f4a",  // ← danger
    600: "#af3f3b",
    700: "#832f2c",
    800: "#58201e",
    900: "#2c100f",
  },

  // Blue-violet (info / secondaire)
  blueAccent: {
    100: "#e1e2fe",
    200: "#c3c6fd",
    300: "#a4a9fc",
    400: "#868dfb",
    500: "#6870fa",  // ← accent secondaire
    600: "#535ac8",
    700: "#3e4396",
    800: "#2a2d64",
    900: "#151632",
  },

  // Orange (warnings — ex: alerte carburant sur le dashboard)
  orange: {
    500: "#f0a500",
    600: "#c98600",
  },
};

// ─── COLOR MODE CONTEXT ──────────────────────────────────────────────────────

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// ─── THEME SETTINGS ──────────────────────────────────────────────────────────

const themeSettings = (mode) => ({
  palette: {
    mode,
    ...(mode === "dark"
      ? {
          primary:   { main: tokens.green[500] },
          secondary: { main: tokens.blueAccent[500] },
          error:     { main: tokens.red[500] },
          warning:   { main: tokens.orange[500] },

          background: {
            default: tokens.background.default,
            paper:   tokens.background.paper,
          },

          text: {
            primary:   tokens.grey[100],
            secondary: tokens.grey[500],
            disabled:  tokens.grey[700],
          },

          divider: tokens.background.elevated,

          // Tokens custom accessibles via theme.palette.custom.*
          custom: {
            card:     tokens.background.card,
            elevated: tokens.background.elevated,
            sidebar:  tokens.background.paper,
            green:    tokens.green[500],
            red:      tokens.red[500],
            blue:     tokens.blueAccent[500],
          },
        }
      : {
          // Light mode (optionnel — garde une cohérence si tu bascules)
          primary:   { main: tokens.green[600] },
          secondary: { main: tokens.blueAccent[600] },
          background: { default: "#f5f7fa", paper: "#ffffff" },
          text: { primary: "#141b2b", secondary: "#666666" },
          custom: {
            card:     "#ffffff",
            elevated: "#f0f2f5",
            sidebar:  "#141b2b",
            green:    tokens.green[600],
            red:      tokens.red[500],
            blue:     tokens.blueAccent[500],
          },
        }),
  },

  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    fontSize: 13,
    h1: { fontSize: "2.2rem", fontWeight: 700 },
    h2: { fontSize: "1.8rem", fontWeight: 700 },
    h3: { fontSize: "1.4rem", fontWeight: 600 },
    h4: { fontSize: "1.1rem", fontWeight: 600 },
    h5: { fontSize: "0.95rem", fontWeight: 600 },
    h6: { fontSize: "0.85rem", fontWeight: 500 },
    body1: { fontSize: "0.875rem" },
    body2: { fontSize: "0.78rem", color: tokens.grey[500] },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.background.default,
          scrollbarColor: `${tokens.grey[700]} ${tokens.background.paper}`,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: tokens.background.paper },
          "&::-webkit-scrollbar-thumb": {
            background: tokens.grey[700],
            borderRadius: "3px",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.background.card,
          backgroundImage: "none",
          border: `1px solid ${tokens.background.elevated}`,
          borderRadius: "12px",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: { borderRadius: "8px", textTransform: "none", fontWeight: 600 },
        containedPrimary: {
          backgroundColor: tokens.green[500],
          "&:hover": { backgroundColor: tokens.green[600] },
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: tokens.background.paper,
          borderRight: `1px solid ${tokens.background.elevated}`,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.background.paper,
          backgroundImage: "none",
          boxShadow: "none",
          borderBottom: `1px solid ${tokens.background.elevated}`,
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: { backgroundColor: tokens.background.elevated },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: "6px" },
      },
    },
  },
});

// ─── HOOK useMode ─────────────────────────────────────────────────────────────

export const useMode = () => {
  const [mode, setMode] = useState("dark"); // dark par défaut comme le screenshot

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};