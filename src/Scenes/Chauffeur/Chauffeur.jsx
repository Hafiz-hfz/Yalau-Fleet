import { useState } from "react"
import Button from '@mui/material/Button';
import Info_Chauf from "./Info_Chauf"
import Tableau_Chauf from "./Tableau_Chauf"
import Box from '@mui/material/Box';
import {  useCallback } from "react"


function Chauffeur() {
  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey(k => k + 1)

  return (
    <div>
      <Info_Chauf onRefresh={triggerRefresh} />
      <Tableau_Chauf refreshKey={refreshKey} />
      <Box sx={{ display: 'flex', mt: 3, justifyContent: "space-between" }}>
        <Button variant="outlined">Exporter la liste (CSV)</Button>
        <Button variant="contained">Rapport de conformité</Button>
      </Box>
    </div>
  )
}

export default Chauffeur;