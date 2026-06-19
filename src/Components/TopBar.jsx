import { AppBar, Toolbar, Box, IconButton, InputBase } from "@mui/material";
import { Search, NotificationsOutlined, HelpOutlineOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import DarkModeToggle from "./DarkModeToggle";

const Topbar = () => {
  const theme = useTheme();

  return (
    <AppBar position="static" elevation={0} 
      sx={{
           width: "100%",
          //  backgroundColor: theme.palette.background.top
         }}>
      <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>

        {/* Barre de recherche */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            backgroundColor: theme.palette.background.card,
            borderRadius: "8px",
            px: 2,
            py: 0.5,
            width: "300px",
          }}
        >
          <Search sx={{ color: theme.palette.text.secondary }} />
          <InputBase
            placeholder="Rechercher des véhicules ou chauffeurs..."
            sx={{ color: theme.palette.text.primary, width: "100%" }}
          />
        </Box>

        {/* Actions droite */}
        <Box display="flex" alignItems="center" gap={1}>
          <DarkModeToggle />
          <IconButton>
            <NotificationsOutlined />
          </IconButton>
          <IconButton>
            <HelpOutlineOutlined />
          </IconButton>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Topbar;