import Box from '@mui/material/Box';
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import Heard from './Hearder';
import Tableau_Param from './Tableau_Param';
import { useState, useEffect } from "react";

import { Typography } from '@mui/material';
function Parametres () {
     const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey(k => k + 1)
    return (
        <div>  
               <Typography variant="h3" sx={{mb:2}}>  <SettingsOutlined  sx={{ color: "#4cceac" }}/>  Parametres  </Typography> 
               <div>
                    <Heard/>
                    <Tableau_Param  refreshKey={refreshKey}/>
               </div>
        </div>
    )
}

export default Parametres