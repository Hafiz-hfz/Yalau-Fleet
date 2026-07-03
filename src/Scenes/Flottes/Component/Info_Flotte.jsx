import { createSvgIcon } from '@mui/material/utils';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useTheme } from "@mui/material/styles";




// Les Icones : 
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import BuildOutlined from "@mui/icons-material/BuildOutlined";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";

// Btn Ajouter Vehicule

import { styled } from '@mui/material/styles';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddVehiculeDialog from '../AddVehiculeDialoge';
import { useState, useEffect } from "react";

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

// : Export exel
 


function Info_Flotte({ onRefresh }) {
  const [selectedCard, setSelectedCard] = React.useState(0);
  const theme = useTheme();
  const [open, setOpen] = useState(false); // Dialogue fermeture
  const [kpi, setKpi] = useState({ total: 0, operationnels: 0, enMaintenance:0,enRoute:0 })

  // Calcule pour les taux disponibilité et en mission

  
  
  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/camions/kpi`)
    .then(res => res.json())
    .then(data => setKpi(data))
}, [])

  const cards = [
    {
      id: 1,
      title: 'Total Véhicules',
      description: `${kpi.total}`,
      icon: <LocalShippingOutlined />
    },
    {
      id: 2,
      title: 'Opérationnels',
       description: `${kpi.operationnels}`,
      icon: (
       
          <CheckCircleOutlined sx={{ color: "#4caf50" }} />
       
      )
    },
    {
      id: 3,
      title: 'En Panne',
      description: `${kpi.enMaintenance}`,
      icon :     <BuildOutlined sx={{ color: "#db4f4a" }} />
    },
     {
      id: 4,
      title: 'En route',
      description: `${kpi.enRoute}`,
      icon : <LocalShippingOutlined sx={{ color: "#6870fa" }} />
    },
     {
      id: 5,
      title: 'Taux de Disponibilité',
      description: `${kpi.enRoute}` ,
      icon: <LocalShippingOutlined sx={{ color: "#6870fa" }} />
    },
    {
      id: 6,
      title: 'Taux d\'utilisation',
      description: `${kpi.enRoute}` ,
      icon: <LocalShippingOutlined sx={{ color: "#6870fa" }} />
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
              <Typography variant="h3">Aperçu de la Flottes</Typography> 
              <Typography variant ="body1" srx = {{mt:6}} > Visualisation en temps réel de 124 véhicules actifs </Typography>
            </div>
            <div> 
                
                <Button  onClick={() => setOpen(true)}
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<PlusIcon />}
                      >
                        Ajouter un Véhicules
                      </Button>
                <AddVehiculeDialog open={open} 
                  onClose={() => setOpen(false)}
                    onRefresh={onRefresh}  // passe au dialog  // pour rafraichir les donner
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
                      <Typography variant="overline"  component="div"
                      sx={{
                        lineHeight: 1.8,
                        FontStyle : "italic",
                        fontSize: "1rem", 
                        // fontWeight: 600,
                        letterSpacing: "1px",
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
    </Box>
  );
}

export default Info_Flotte;
