import React from "react";
import { Card, Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import BuildOutlined from "@mui/icons-material/BuildOutlined";
import LocalGasStationOutlined from "@mui/icons-material/LocalGasStationOutlined";
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";


// Activit style ,  Choisit l'icône et la couleur selon le type/statut/action

const getActiviteStyle = (activite) => {
  if (activite.statut === 'deleted') {
    return { icon: <WarningAmberOutlined />, bg: "#cb312c" }
  }
  switch (activite.type) {
    case 'livraison':
      return activite.statut === 'livre'
        ? { icon: <CheckCircleOutlined />, bg: "#213f37" }
        : { icon: <AssignmentOutlined />, bg: "#6870fa" }
    case 'ravitaillement':
      return { icon: <LocalGasStationOutlined />, bg: "#6870fa" }
    case 'approvisionnement':
      return { icon: <LocalGasStationOutlined />, bg: "#4cceac" }
    case 'camion':
      return { icon: <BuildOutlined />, bg: "#66666620" }
    case 'chauffeur':
      return { icon: <LocationOnOutlined />, bg: "#6870fa" }
    default:
      return { icon: <AssignmentOutlined />, bg: "#66666620" }
  }
}

// Formate l'heure / "Hier"
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const heure = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  if (isToday) return heure
  if (isYesterday) return `Hier, ${heure}`
  return `${date.toLocaleDateString('fr-FR')}, ${heure}`
}
function Activity() {
  const [activites, setActivites] = useState([])

  useEffect(() => {
    fetch('${import.meta.env.VITE_API_URL}/api/dashboard/activites')
      .then(res => res.json())
      .then(data => setActivites(data))
      .catch(err => console.error('Erreur:', err))
  }, [])

  

  return (
    <Card sx={{ borderRadius: "12px" }}>
      {/* En-tête */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 2, py: 1.5,  borderBottom: "1px solid #334155" }}
      >
        <Typography variant="h3">Activités Récente</Typography>
      </Box>

      {/* Corps scrollable — hauteur fixe */}
      <Box sx={{ height: "363px", overflowY: "auto", px: 2, py: 1 }}>
        {activites.map((activite, index) => {
          const style = getActiviteStyle(activite)
          return (
            <div className="flex mt-10 gap-4" key={activite.id}>
              <div>
                {React.cloneElement(style.icon, {
                  sx: {
                    ml: 2,
                    fontSize: "20px",
                    backgroundColor: style.bg,
                    borderRadius: "50%",
                    p: 0.4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                })}
                {index < activites.length - 1 && (
                  <div className="w-px h-full ml-7 mt-1 bg-text-muted" />
                )}
              </div>
              <div>
                <h6>{activite.titre}</h6>
                <p className="text-sm text-text-muted">
                  {activite.description} <br />
                  {formatDate(activite.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
        {activites.length === 0 && (
          <Typography sx={{ color: "#666", textAlign: "center", mt: 4 }}>
            Aucune activité récente
          </Typography>
        )}
      </Box>
    </Card>
  )
}

export default Activity






















// Origine


// import React from "react";
// import { useState, useEffect } from "react";
// import { Box, Typography } from "@mui/material";
// import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
// import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
// import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
// import BuildOutlined from "@mui/icons-material/BuildOutlined";
// import LocalGasStationOutlined from "@mui/icons-material/LocalGasStationOutlined";
// import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";

// Choisit l'icône et la couleur selon le type/statut/action


// Formate l'heure / "Hier"
// const formatDate = (dateStr) => {
//   const date = new Date(dateStr)
//   const now = new Date()
//   const isToday = date.toDateString() === now.toDateString()
//   const yesterday = new Date(now)
//   yesterday.setDate(now.getDate() - 1)
//   const isYesterday = date.toDateString() === yesterday.toDateString()

//   const heure = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

//   if (isToday) return heure
//   if (isYesterday) return `Hier, ${heure}`
//   return `${date.toLocaleDateString('fr-FR')}, ${heure}`
// }


// function Activity () {
//       const [activites, setActivites] = useState([])
//      useEffect(() => {
//         fetch('${import.meta.env.VITE_API_URL}/api/dashboard/activites')
//         .then(res => res.json())
//         .then(data => setActivites(data))
//         .catch(err => console.error('Erreur:', err))
//     }, [])
//     return (
//          <Box sx={{ overflowY: "auto", flex: 1, px: 1, py: 2 }}>
//       {activites.map((activite, index) => {
//         const style = getActiviteStyle(activite)
//         return (
//           <div className="flex mt-10 gap-4" key={activite.id}>
//             <div>
//               {React.cloneElement(style.icon, {
//                 sx: {
//                   ml: 2,
//                   fontSize: "20px",
//                   backgroundColor: style.bg,
//                   borderRadius: "50%",
//                   p: 0.4,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }
//               })}
//               {index < activites.length - 1 && (
//                 <div className="w-px h-full ml-7 mt-1 bg-text-muted" />
//               )}
//             </div>
//             <div>
//               <h6>{activite.titre}</h6>
//               <p className="text-sm text-text-muted">
//                 {activite.description} <br />
//                 {formatDate(activite.createdAt)}
//               </p>
//             </div>
//           </div>
//         )
//       })}
//       {activites.length === 0 && (
//         <Typography sx={{ color: "#666", textAlign: "center", mt: 4 }}>
//           Aucune activité récente
//         </Typography>
//       )}
//     </Box>

//     )
// }
 
// export default Activity