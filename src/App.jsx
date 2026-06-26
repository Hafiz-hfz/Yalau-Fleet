import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react'
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import './App.css'
import Topbar from './Components/TopBar';
import SideBar from './Components/SideBar';
import Dash from './Scenes/Dashboard/Dash';
import Flottes from './Scenes/Flottes/Flottes';
import Chauffeur from './Scenes/Chauffeur/Chauffeur';
import Livraisons from './Scenes/Livraison/Livraison';
import Carburant from './Scenes/Carburant/Carburant';
import Parametres from './Scenes/Parametre/parametres';
import Login from './Pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

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
  )
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
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App














































// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useEffect } from 'react'
// import { ColorModeContext, useMode } from "./theme";
// import { ThemeProvider, CssBaseline, Box } from "@mui/material";
// import './App.css'
// import Topbar from './Components/TopBar';
// import SideBar from './Components/SideBar';
// import Dash from './Scenes/Dashboard/Dash';
// import Flottes from './Scenes/Flottes/Flottes';
// import Chauffeur from './Scenes/Chauffeur/Chauffeur';
// import Livraisons from './Scenes/Livraison/Livraison';
// import Carburant from './Scenes/Carburant/Carburant';
// import Parametres from './Scenes/Parametre/parametres';


// function App() {
//   const [theme, colorMode] = useMode();
//   console.log(import.meta.env.VITE_API_URL)
//   useEffect(() => {
//     const root = document.documentElement;
//     theme.palette.mode === "dark"
//       ? root.classList.add("dark")
//       : root.classList.remove("dark");
//   }, [theme.palette.mode]);

//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <BrowserRouter>
//           <Box display="flex" height="100vh">
//             <SideBar />
//             <Box display="flex" flexDirection="column" flex={1} overflow="auto">
//               <Topbar />
//               <Box flex={1} p={2}>
//                 <Routes>
//                   <Route path="/" element={<Dash />} />
//                   <Route path="/Flottes" element={<Flottes />} />
//                   <Route path="/Chauffeur" element={<Chauffeur />} />
//                   <Route path="/Livraisons" element={<Livraisons />} />
//                   <Route path="/Carburant" element={<Carburant />} />
//                   <Route path="/parametres" element={<Parametres />} />
//                 </Routes>
//               </Box>
//             </Box>
//           </Box>
//         </BrowserRouter>
//       </ThemeProvider>
//     </ColorModeContext.Provider>
//   );
// }

// export default App