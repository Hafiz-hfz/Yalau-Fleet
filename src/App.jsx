import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react'
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import './App.css'
import Topbar from './Components/TopBar';
import SideBar from './Components/SideBar';
import Dash from './Scenes/Dashboard/dash';
import Flottes from './Scenes/Flottes/Flottes';
import Chauffeur from './Scenes/Chauffeur/Chauffeur';
import Livraisons from './Scenes/Livraison/Livraison';
import Carburant from './Scenes/Carburant/Carburant';
import Parametres from './Scenes/Parametre/parametres';
import Login from './Pages/Login'; // AJOUTÉ
import { AuthProvider } from './context/AuthContext'; // AJOUTÉ
import ProtectedRoute from './components/ProtectedRoute'; // AJOUTÉ

// AJOUTÉ : layout principal (sidebar + topbar), affiché seulement si connecté
function AppLayout() {
  return (
    <Box display="flex" height="100vh">
      <SideBar />
      <Box display="flex" flexDirection="column" flex={1} overflow="auto">
        <Topbar />
        <Box flex={1} p={2}>
          <Routes>
            <Route path="/" element={<Dash />} />
            <Route path="/Flottes" element={<Flottes />} />
            <Route path="/Chauffeur" element={<Chauffeur />} />
            <Route path="/Livraisons" element={<Livraisons />} />
            <Route path="/Carburant" element={<Carburant />} />
            <Route path="/parametres" element={<Parametres />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  const [theme, colorMode] = useMode();

  useEffect(() => {
    const root = document.documentElement;
    theme.palette.mode === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
  }, [theme.palette.mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider> {/* AJOUTÉ */}
          <BrowserRouter>
            <Routes>
              {/* AJOUTÉ : route publique de connexion, sans sidebar/topbar */}
              <Route path="/login" element={<Login />} />

              {/* MODIFIÉ : tout le reste passe par ProtectedRoute */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App