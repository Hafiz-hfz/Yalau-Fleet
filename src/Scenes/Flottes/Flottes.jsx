
import { useState, useCallback } from "react"
import Info_Flotte from "./Component/Info_Flotte"
import Tableau_Flotte from "./Component/Tableau_Flotte"
// AJOUTÉ : fetchCamions remonté ici
 
function Flottes () {
     const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey(k => k + 1)

    return (
        <div>
           <Info_Flotte onRefresh={triggerRefresh} />
        <Tableau_Flotte refreshKey={refreshKey} />
            
        </div>
    )
}

export default Flottes;