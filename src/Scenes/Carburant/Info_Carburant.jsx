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
import {   Select, MenuItem, TextField , InputAdornment } from "@mui/material";

// Les Icones : 
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import { CalendarMonthOutlined } from "@mui/icons-material";
import { SearchOutlined } from "@mui/icons-material";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import LocalGasStationOutlined from "@mui/icons-material/LocalGasStationOutlined";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { FilterListOutlined } from "@mui/icons-material";
import { InfoOutlined } from "@mui/icons-material";


// Btn Ajouter Ravitaillemnt

import { styled } from '@mui/material/styles';
import AddRavitaillementDialog from "./AddRavitaillementDialog";



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






function Info_Carburant({onRefresh}) {
  //   trie
  const [statut, setStatut] = useState("");
const [date, setDate] = useState("");

  const [selectedCard, setSelectedCard] = React.useState(0);
  const theme = useTheme();
  const [open, setOpen] = useState(false); // Dialogue fermeture
  // Cards
  const [stock, setStock] = useState({ stockActuel: 0 })
  const [evolution, setEvolution] = useState(0)
  const [coutMois, setCoutMois] = useState(0)
const [seuilAlerte, setSeuilAlerte] = useState(0)
const [volumeMois, setVolumeMois] = useState(0)
  

 useEffect(() => {
    fetch('${import.meta.env.VITE_API_URL}/api/carburant/stock')
      .then(res => res.json())
      .then(data => setStock(data))
    fetch('${import.meta.env.VITE_API_URL}/api/carburant/stock-evolution')
      .then(res => res.json())
      .then(data => setEvolution(data.evolution))
    fetch('${import.meta.env.VITE_API_URL}/api/carburant/cout-mois')
     .then(res => res.json()).then(data => setCoutMois(data.coutTotal))
    fetch('${import.meta.env.VITE_API_URL}/api/parametres')
      .then(res => res.json()).then(data => setSeuilAlerte(data.seuilAlerte))
    fetch('${import.meta.env.VITE_API_URL}/api/carburant/volume-mois')
      .then(res => res.json()).then(data => setVolumeMois(data.volumeTotal))

  }, [])

  const pourcentageSeuil = seuilAlerte > 0 ? Math.round((stock.stockActuel / seuilAlerte) * 100) : 0


  const cards = [
  {
    id: 1,
    title: ' Stock  Cotonou',
    description: `${stock.stockActuel} L`, 
    icon : "Litres",
    icon1 :  <Typography sx={{ color: evolution >= 0 ? "#0ec82d" : "#db4f4a", fontSize: "13px" }}>
  {evolution >= 0 ? "↑" : "↓"} {Math.abs(evolution)}% vs semaine dernière
</Typography>
  },
  
  {
    id: 2,
    title: 'Cout du mois',
    description: `${coutMois.toLocaleString()} FCFA`,
    icon: "Fcfa",
    icon1: seuilAlerte > 0 ? (
      <Typography sx={{ 
        color: pourcentageSeuil >= 100 ? "#0ec82d" : pourcentageSeuil >= 50 ? "#f0a500" : "#db4f4a", 
        fontSize: "13px" 
      }}>
        <InfoOutlined sx={{ fontSize: "20px" }} />
        {pourcentageSeuil >= 100 
          ? `Stock OK — ${pourcentageSeuil}% du seuil` 
          : pourcentageSeuil >= 50 
          ? `Attention — ${pourcentageSeuil}% du seuil` 
          : `Critique — ${pourcentageSeuil}% du seuil`}
      </Typography>
    ) : (
      <Typography sx={{ color: "#a0aec0", fontSize: "13px" }}>Aucun seuil défini</Typography>
    )
     
  },
  {
    id: 3,
    title: 'Conso Moy',
    description: '32.4',
    icon : "L/100Km",
    icon1 : <Typography sx={{ color:  "#f5cece" ,fontSize: "13px" }}> <TrendingUpOutlined sx={{ color: "#f52a2a", fontSize: "20px" }} />Conso en hausse</Typography>

  },
   {
      id: 4,
      title: 'Volume Total',
      description: `${volumeMois.toLocaleString()} L`,
      icon: 'Litres',
      icon1: <Typography sx={{ color: "#eeecec", fontSize: "13px" }}>
        <CalendarMonthOutlined sx={{ color: "#5b5858", fontSize: "20px" }} />
        30 derniers jours
      </Typography>
    }
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
              <Typography variant="h3">Gestion de Carburation</Typography> 
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
                        Nouveau Ravitaillement
                        
                      </Button>
                      <AddRavitaillementDialog 
                      open={open} 
                      onClose={() => setOpen(false)}
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
                    <Typography variant=""  component="div"
                      sx={{
                        lineHeight: 0.9,
                        FontStyle : "italic",
                        mt:2,
                        fontSize: "0.6rem", 
                        color : "#0ec82d",
                        letterSpacing: "0.5px",
                        fontWeight: 400,  // normal
                        }} > {card.icon1}
                    </Typography>
                    </div>
                     
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

          {/* Section de Trie */}

          {/* <Box display="flex" sx={{mt:5}} alignItems="center" gap={1.5}> */}

                {/* Label */}
                {/* <Box display="flex" alignItems="center" gap={0.5} sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                    <FilterListOutlined fontSize="small" />
                    <Typography variant="body2">Filtrer par :</Typography>
                </Box> */}

                {/* Tri par statut */}
                {/* <Select size="small" value={statut} onChange={(e) => setStatut(e.target.value)} displayEmpty>
                    
                    <MenuItem value="stock interne">Stock interne</MenuItem>
                    <MenuItem value="station externe">Station externe</MenuItem>
                    <MenuItem value="ville">Ville</MenuItem>
                    <MenuItem value="periode">Période (date)</MenuItem>
                </Select> */}

                {/* Date */}
                {/* <TextField
                    type="date"
                    size="small"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                /> */}

                    {/* Recherche */}
                {/* <TextField
                size="small"
                placeholder="Rechercher un camion..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchOutlined fontSize="small" />
                    </InputAdornment>
                    ),
                }}
                /> */}

                {/* </Box> */}

    </Box>
  );
}

export default Info_Carburant;
