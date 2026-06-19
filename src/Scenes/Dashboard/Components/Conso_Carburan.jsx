import { Box, Card, Typography } from "@mui/material"
import GraphRavitaillements from "./GraphRavitaillements"
function Conso_Carburan () {

    return (
        <Card sx={{ borderRadius: "12px" }}>

                                {/* En-tête */}
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ px: 2, py: 1.5 }}
                                >
                                    <Typography variant="h3">Consommation Carburant</Typography>
                                </Box>

                                {/* Contenu centré */}
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{ height: "350px" }}
                                >
                                    <GraphRavitaillements/>
                                </Box>
                            </Card>    
    )

}

export default Conso_Carburan