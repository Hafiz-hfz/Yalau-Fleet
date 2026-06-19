import { Box, Card, Typography } from "@mui/material"
import Activity from "./Activity"
import Carte from "./Carte"
import PieChartWithCenterLabel from "./Graph"
import Conso_Carburan from "./Conso_Carburan"

function Container_dashboard () {
    return (
        <div className="mt-12">
            <Box display={"flex"}  gap={2} flexWrap="wrap" >
                {/* Left */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '2.5' } }}>
                    
                    <Card sx={{ borderRadius: "12px", overflow: "hidden" }}>
                        {/* En-tête */}
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ px: 2, py: 3 }}
                        >
                            
                            <Typography variant="h5">Position des camions en temps réel</Typography>
                            
                            <Box display="flex" alignItems="center" gap={1}>
                            {/* ce que tu veux à droite : badge, icône, légende... */}
                            <Typography variant="body2" sx={{ color: "#4cceac" }}>● EN ROUTE</Typography>
                            <Typography variant="body2" sx={{ color: "#6870fa" }}>● LIVRAISON</Typography>
                            </Box>
                        </Box>

                        <Carte/>
                    </Card>
                </Box>
                {/* Right */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1.5' } }}>
                    
                    <Activity/>
                </Box>
            </Box>

                <div className="mt-12">

                     <Box  display={"flex"}  gap={2} flexWrap="wrap">
                        <Box sx={{ flex: { xs: '1 1 100%', md: '2' } }}>
                           <Conso_Carburan/>
                        {/* composant */}
                        </Box>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '2' } }}>
                            <Card sx={{ borderRadius: "12px" }}>

                                {/* En-tête */}
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ px: 2, py: 1.5 }}
                                >
                                    <Typography variant="h3">Statut de la flotte</Typography>
                                </Box>

                                {/* Contenu centré */}
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{ height: "350px" }}
                                >
                                    <PieChartWithCenterLabel />
                                </Box>

                            </Card>
                        </Box>
                    </Box>
                </div>
        </div>
    )
}

export default Container_dashboard