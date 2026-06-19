import { useContext } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { LightModeOutlined, DarkModeOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../theme";

const DarkModeToggle = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isDark = theme.palette.mode === "dark";

  return (
    <Tooltip title={isDark ? "Mode clair" : "Mode sombre"}>
      <IconButton onClick={colorMode.toggleColorMode}>
        {isDark
          ? <LightModeOutlined sx={{ color: "#f0a500" }} />
          : <DarkModeOutlined sx={{ color: "#6870fa" }} />
        }
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;