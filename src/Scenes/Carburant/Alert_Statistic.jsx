import { Box, Card, Typography } from "@mui/material"
import Paper from '@mui/material/Paper';
import LinearProgress from "@mui/material/LinearProgress"
import { useState,useEffect  } from "react";

// icone
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Alert from '@mui/material/Alert';

function Alert_Statistic () {
      const [stock, setStock] = useState({ stockActuel: 0 })
      const [seuilAlerte, setSeuilAlerte] = useState(0)
      const [topConsommateurs, setTopConsommateurs] = useState([])
      const [statsType, setStatsType] = useState({ 
        interne: { litres: 0, cout: 0 }, 
        externe: { litres: 0, cout: 0 } 
})

       useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/carburant/stock`)
      .then(res => res.json())
      .then(data => setStock(data))

    fetch(`${import.meta.env.VITE_API_URL}/api/parametres`)
      .then(res => res.json())
      .then(data => setSeuilAlerte(data.seuilAlerte))
    fetch(`${import.meta.env.VITE_API_URL}/api/carburant/top-consommateurs`)
      .then(res => res.json()).then(data => setTopConsommateurs(data))
    fetch(`${import.meta.env.VITE_API_URL}/api/carburant/stats-type`)
        .then(res => res.json())
        .then(data => setStatsType(data))
  }, [])

  const stockBas = stock.stockActuel < seuilAlerte && seuilAlerte > 0
    return (
       <Card sx={{ borderRadius: "12px" }}>
       
                                       {/* En-tête */}
             <Box
                 display="flex"
                 justifyContent="space-between"
                 alignItems="center"
                 sx={{ px: 2, py: 1.5 }}
             >
                <Typography variant="h3">Alertes & Statistiques</Typography>
             </Box>
       
            {/* Contenu centré */}
            <Box
                 display="flex"
                sx={{ height: "350px" }}
             >
                 {/* Barre de progresse */}
            <Box> 
                <div className="p:2">
                     
                    {stockBas ? (
                    <Alert severity="warning" sx={{ py: 1, px: 1, fontSize: "0.9rem", borderRadius: 10 }}>
                        Stock bas — {stock.stockActuel}L restants, pensez à réapprovisionner
                    </Alert>
                    ) : (
                    <Alert severity="success" sx={{ py: 1, px: 1, fontSize: "0.9rem", borderRadius: 10 }}>
                        Stock suffisant — {stock.stockActuel}L disponibles
                    </Alert>
                    )}
                     
                </div>
                                                        

                <div className="mt-3">
                        TOP CONSOMMATEURS DU MOIS
                        {/* Les Barres de progresses */}
                        {/* Bar 1 */}
                        {topConsommateurs.map((camion, index) => {
                            const max = topConsommateurs[0]?.totalLitres || 1
                            const pourcentage = (camion.totalLitres / max) * 100

                            return (
                                <Box key={index}>
                                <Box display="flex" justifyContent="space-between" mb={0.5} mt={2}>
                                    <Typography variant="body1">{camion.immatriculation}</Typography>
                                    <Typography variant="body2">
                                    <span style={{ color: "#4cceac", fontWeight: 600 }}>{camion.totalLitres} L</span>
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={pourcentage}
                                    sx={{
                                    height: 10,
                                    borderRadius: "5px",
                                    backgroundColor: "#3a1e1e",
                                    "& .MuiLinearProgress-bar": {
                                        backgroundColor: "#4cceac",
                                        borderRadius: "5px",
                                    }
                                    }}
                                />
                                </Box>
                            )
                            })}
                        
                         
                </div>
            </Box>                        
            </Box>

            <Box mt={-6} sx={{  display:"flex", justifyContent:"space-between" }} >
                        <Card sx={{ borderRadius: "12px", width: "40%" }}>
                        <Typography variant="h6">Stocks Internes</Typography>
                        <div>
                            {statsType.interne.litres} L <br />
                            <span>{(statsType.interne.cout || 0).toLocaleString()} FCFA</span>
                        </div>
                        </Card>

                        <Card sx={{ borderRadius: "12px", width: "40%" }}>
                        <Typography variant="h6">Station Externe</Typography>
                        {statsType.externe.litres} L <br />
                        {(statsType.externe.cout || 0).toLocaleString()} FCFA
                        </Card>
            </Box>
        </Card>    
    )
}

export default Alert_Statistic