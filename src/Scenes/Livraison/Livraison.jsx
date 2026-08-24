import { useState } from "react"
import Button from '@mui/material/Button';
import Info_Livraison from "./Info_Livraison"
import Tableau_Livraison from "./Tableau_Livraison"
import Box from '@mui/material/Box';

function Livraisons() {
  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey(k => k + 1)

  return (
    <div>
      <div>
        <Info_Livraison onRefresh={triggerRefresh} />
        <Tableau_Livraison refreshKey={refreshKey} />
      </div>
      <Box sx={{ display: 'flex', mt: 3, justifyContent: "space-between" }}>
        {/* <Button variant="outlined">Exporter la liste (CSV)</Button> */}
      </Box>
    </div>
  )
}

export default Livraisons;