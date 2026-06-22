import { useState, useEffect } from "react";
import { createSvgIcon } from '@mui/material/utils';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useTheme } from "@mui/material/styles";
import {   Select, MenuItem, TextField } from "@mui/material";

// Les Icones : 
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import LocalGasStationOutlined from "@mui/icons-material/LocalGasStationOutlined";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { FilterListOutlined } from "@mui/icons-material";
import TrendingDownOutlined from "@mui/icons-material/TrendingDownOutlined";

// Btn Ajouter Livraison

import { styled } from '@mui/material/styles';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddLivraisonDialog from "./AddLivraisonDialog";

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



function Info_Livraison({onRefresh}) {
const [selectedCard, setSelectedCard] = React.useState(0);
  const theme = useTheme();
  const [open, setOpen] = useState(false); // Dialogue fermeture
const [kpi, setKpi] = useState({ total24h: 0, totalHier: 0, evolution: 0, enCours: 0, coutMoyen: 0,  tauxReussite: 0,  evolutionCout: 0 })  


  
useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/livraisons/kpi`)
  .then(res => res.json())
  .then(data => setKpi(data))
}, [])

const cards = [
  {
    id: 1,
    title: 'Livraison Totales (24H)',
    description: `${kpi.total24h}`,
    icon: <Typography sx={{ color: kpi.evolution >= 0 ? "#0ec82d" : "#db4f4a", fontSize: "13px" }}>
            {kpi.evolution >= 0 ? "↑" : "↓ -"} {Math.abs(kpi.evolution)}% vs hier
        </Typography>
  },
  {
    id: 2,
    title: 'Livraison En Cours',
    description: `${kpi.enCours}`,
    icon: <FiberManualRecordIcon sx={{ 
      fontSize: "10px", 
      color: kpi.enCours > 0 ? "#4cceac" : "#666666",
      animation: kpi.enCours > 0 ? "pulse 1.5s infinite" : "none"
    }} />
  },
  {
    id: 3,
    title: 'Coût Carburant Moyen',
    description: `${kpi.coutMoyen.toLocaleString()} FCFA`,
    icon: <Typography sx={{ color: kpi.evolutionCout <= 0 ? "#0ec82d" : "#db4f4a", fontSize: "13px" }}>
            {kpi.evolutionCout <= 0 ? "↓" : "↑"} {Math.abs(kpi.evolutionCout)}% / mois
          </Typography>
  },
   {
    id: 4,
    title: 'Taux De Réussite',
    description: `${kpi.tauxReussite}%`,
    icon : kpi.tauxReussite >= 75 
            ? <TrendingUpOutlined sx={{ color: "#4cceac" }} />
            : <TrendingDownOutlined sx={{ color: "#db4f4a" }} />
  },
];

  
  

//   trie
  const [statut, setStatut] = useState("");
const [date, setDate] = useState("");
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
              <Typography variant="h3">Gestion des Livraisons</Typography> 
              <Typography variant ="body1" sx = {{mt:2}} component="div" > Suivi en temps réel des flux logistiques et 
                coût opérationnels.  </Typography>
            </div>
            <div> 
                
                <Button onClick={() => setOpen(true)}
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<PlusIcon />}
                      >
                        Ajouter un Livraison
                      </Button>
                <AddLivraisonDialog open={open} onClose={() => setOpen(false)}
                  onRefresh={onRefresh}  // AJOUTÉ
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

export default Info_Livraison;
