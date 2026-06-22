import { createSvgIcon } from '@mui/material/utils';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
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
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
// Btn Ajouter Vehicule

import { styled } from '@mui/material/styles';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddChauffeurDialog from './AddChauffeurDialoge';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Plus Icon


const PlusIcon = createSvgIcon(
  // credit: plus icon from https://heroicons.com
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>,
  'Plus',
);





function Info_Chauf({onRefresh} ) {
  const [selectedCard, setSelectedCard] = React.useState(0);
  const theme = useTheme();
  const [open, setOpen] = useState(false); // Dialogue fermeture
  
  const [kpi, setKpi] = useState({ disponibilite: 0, disponibles: 0, total: 0,  evolutionDispo: 0, enMission: 0 })

useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/chauffeurs/kpi`)
    .then(res => res.json())
    .then(data => setKpi(data))
}, [])

  const cards = [
    {
      id: 1,
      title: 'Disponibilité',
      description: `${kpi.disponibilite}%`,
      icon: <Typography sx={{ color: kpi.evolutionDispo >= 0 ? "#0ec82d" : "#db4f4a", fontSize: "13px" }}>
              {kpi.evolutionDispo >= 0 ? "↑" : "↓"} {Math.abs(kpi.evolutionDispo)}% vs hier
            </Typography>
    },
    {
      id: 2,
      title: 'Temps de conduite Moy.',
      description: '6h15m',
      icon : 'Optimal'
    },
    {
      id: 3,
      title: 'En Mission',
      description: `${kpi.enMission}`,
      icon: <FiberManualRecordIcon sx={{ fontSize: "10px", color: kpi.enMission > 0 ? "#4cceac" : "#666666" }} />
    },
     {
      id: 4,
      title: 'Chauffeurs Disponibles',
      description: `${kpi.disponibles}`,
      icon: <Typography sx={{ color: "#0ec82d", fontSize: "13px" }}>
        sur {kpi.total} au total
      </Typography>
    },
  ];
  
  return (

    <Box>

          <Box 
            sx = {{
              mt:3,
              display : 'flex',
              justifyContent: "space-between",
            }}
          > 
            
            <div> 
              <Typography variant="h3">Gestion des Chauffeurs</Typography> 
              <Typography variant ="body1" srx = {{mt:6}} > 124 Chauffeurs au Total 
                <Box 
                        sx={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          border: "2px solid #22c55e",
                          backgroundColor: "transparent",
                        }}
                      />  86 actifs </Typography>
            </div>
            <div> 
                
                <Button onClick={() => setOpen(true)}
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<PlusIcon />}
                      >
                        Ajouter un Chauffeur
                      </Button>
                <AddChauffeurDialog 
                    open={open} 
                    onClose={() => setOpen(false)}   
                    onRefresh={onRefresh}   
              />
              
            </div>

          </Box>



          {/*  Les Cards */}
          <Box sx={{
              width: '100%',
              display: 'grid',
              mt:3,
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 1,}}>
            {cards.map((card, index) => (
              <Card key={card.id} 
                    className="w-full"
                    sx={{ backgroundColor: theme.palette.background.card }}
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
                        lineHeight: 1.8,
                        FontStyle : "italic",
                        fontSize: "1rem", 
                        // fontWeight: 600,
                        letterSpacing: "0.5px",
                        // textTransform: "uppercase",
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

    </Box>
  );
}

export default Info_Chauf;
