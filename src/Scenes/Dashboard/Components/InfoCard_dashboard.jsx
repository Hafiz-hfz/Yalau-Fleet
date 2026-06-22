


import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";

// Les Icones : 

import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import LocalGasStationOutlined from "@mui/icons-material/LocalGasStationOutlined";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";







function InfoCard_dashboard() {
      const [selectedCard, setSelectedCard] = React.useState(0);
      const theme = useTheme();
      const [kpi, setKpi] = useState({
      camionsActifs: 0, totalCamions: 0,
      livraisonsJour: 0, volumeMois: 0, coutMois: 0
    })

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/kpi`)
      .then(res => res.json())
      .then(data => setKpi(data))
  }, [])

  const cards = [
  {
    id: 1,
    title: 'CAMIONS ACTIFS',
    description: `${kpi.camionsActifs}/${kpi.totalCamions}`,
    icon : <LocalShippingOutlined sx={{ color: "#4caf50" }}/>
  },
  {
    id: 2,
    title: 'Livraisons du jour',
    description: `${kpi.livraisonsJour}`,
    icon : <AssignmentOutlined  sx={{ color: "#2196f3" }}/>
  },
  {
    id: 3,
    title: 'CARBURANT (MOIS)',
    description:  `${kpi.volumeMois.toLocaleString()} L`,
    icon : <LocalGasStationOutlined  sx={{ color: "#ff9800" }}/>
  },
   {
    id: 4,
    title: 'COÛT CARBURANT (MOIS)',
    description: `${kpi.coutMois.toLocaleString()} FCFA`,
   icon: <AccountBalanceWalletOutlined sx={{ 
    color: "#f44336",
    filter: "drop-shadow(-2px 0 4px rgba(244, 67, 54, 0.4))"
  }} />
  },
];
  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1,
       
      }}
    >
      {cards.map((card, index) => (
        <Card key={card.id} 
              className="w-full"
              sx={{ backgroundColor: theme.palette.background.card ,
                 boxShadow: card.id === 4 ? "-4px 0 12px rgba(244, 67, 54, 0.6)" : "none" // AJOUT
              }}
              
              >
          <CardActionArea
            onClick={() => setSelectedCard(index)}
            data-active={selectedCard === index ? '' : undefined}
            sx={{
              height: '100%',
              // '&[data-active]': {
              //   backgroundColor: 'action.selected',
              //   '&:hover': {
              //     backgroundColor: 'action.selectedHover',
              //   },
              // },
            }}
          >
            <CardContent sx={{ width : '100%', gap : 5, display : "flex"}}>
              <div>
                <Typography variant=""  component="div"
                 sx={{
                  lineHeight: 1.5,
                  FontStyle : "italic",
                  fontSize: "1rem", 
                  // fontWeight: 600,
                  letterSpacing: "02.5px",
                  textTransform: "uppercase",
                  fontWeight: 400,  // normal
                  }} >
                {card.title}
              </Typography>
              <Typography variant="body2" 
              sx={{  
                fontSize: "18px" , 
                color: 'text.primary', 
                }}>
                {card.description}
                
              </Typography>
              </div>
                {/* {card.icon} */}
               <Typography   component="div" sx={{FontStyle : "italic"}} >
                <Box
                    sx={{
                      backgroundColor: "#4cceac20", // ta couleur + "20" à la fin = opacity 12%
                      borderRadius: "8px",
                      p: 1, // padding pour que la couleur entoure bien l'icône
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                   {card.icon} 
                   {/* <LocalShippingOutlined sx={{ color: "#4cceac", fontSize: "28px" }} /> */}
                  </Box>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}

export default InfoCard_dashboard;
