import { NavLink } from "react-router-dom";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useTheme } from "@mui/material/styles";




import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import LocalGasStationOutlined from "@mui/icons-material/LocalGasStationOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
const menuItems = [
  { text: "Dashboard",   icon: <DashboardOutlined />,       path: "/" },
  { text: "Flotte",      icon: <LocalShippingOutlined />,   path: "/Flottes" },
  { text: "Chauffeurs",  icon: <PeopleOutlined />,          path: "/Chauffeur" },
  { text: "Livraisons",  icon: <AssignmentOutlined />,      path: "/Livraisons" },
  { text: "Carburant",   icon: <LocalGasStationOutlined />, path: "/Carburant" },
  { text: "Paramètres",  icon: <SettingsOutlined />,        path: "/parametres" },
];

const drawerWidth = 240;

export default function SideBar() {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
             position: 'relative', // ← ajoute cette ligne
               height: '100vh',
                backgroundColor: theme.palette.background.card,
            backgroundImage: "none", // ← important en dark mode

          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box display="flex" alignItems="center" justifyContent="center"  className = "gap-2" sx={{ }} >
              
          <div><LocalShippingOutlined /></div>
          <div className="text-xl">
            YALAU Fleet
            <p>Operational Control</p>
          </div>
        </Box>
        <Toolbar />
        <Divider />
         <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <NavLink
                    to={item.path}
                    style={{ textDecoration: "none", width: "100%" }}
                  >
                    {({ isActive }) => (
                      <ListItemButton
                        sx={{
                          backgroundColor: isActive ? "background.elevated" : "transparent",
                          borderLeft: isActive ? "3px solid #4cceac" : "3px solid transparent",
                          "&:hover": { backgroundColor: "background.elevated" },
                        }}
                      >
                        <ListItemIcon
                          sx={{ color: isActive ? "#4cceac" : "text.secondary" }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={{ color: isActive ? "#4cceac" : "text.primary" }}
                        />
                      </ListItemButton>
                    )}
                  </NavLink>
                </ListItem>
              ))}
            </List>
        <Divider />
        {/* <List>
          {['Paramètre'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <SettingsOutlined>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </SettingsOutlined>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
      </Drawer>
     
        
       
      
    </Box>
  );
}




