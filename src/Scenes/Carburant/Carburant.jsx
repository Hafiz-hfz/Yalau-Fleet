
import Button from '@mui/material/Button';
import Info_Carburant from "./Info_Carburant"
import Tableau_Carburant from "./Tableau_Carburant"
import Gestion_Stock_Ctn from "./Gestion_Stock_Ctn"
// import footer from "./footer"

import Box from '@mui/material/Box';
import { useState } from "react";
import Alert_Statistic from './Alert_Statistic';


function Carburant () {
    // const [search, setSearch] = useState("");
      const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey(k => k + 1)
    return (
        <div>
            <div>
                 <Info_Carburant onRefresh={triggerRefresh} />
                 <Tableau_Carburant refreshKey={refreshKey} />
            </div>
            <Box display="flex" gap={2}>
                <Box sx={{  width: "50%"}} >
                    <Gestion_Stock_Ctn />
                </Box>
                <Box sx={{  width: "50%"}} >
                    <Alert_Statistic />
                </Box>
            </Box>
        </div>
    )
}

export default Carburant;