import LinearProgress from "@mui/material/LinearProgress"
import { Box, Card, Typography } from "@mui/material"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import Card from '@mui/material/Card';
// btn apro
import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AddApproDialog from "./AddApproDialog";
import { useState,useEffect  } from "react";



// Tableau
function createData(date, quantite, prix,total) {
  return { date, quantite, prix, total };
}

 

function Gestion_Stock_Ctn () {
    const [open, setOpen] = useState(false); // Dialogue fermeture
    const [rows, setRows] = useState([])
    const [stock, setStock] = useState({ stockActuel: 0, totalAchete: 0 }); // AJOUTÉ
    const [stockMois, setStockMois] = useState({ totalAchete: 0, totalDistribue: 0, stockRestant: 0 })

      // AJOUTÉ : charge les appros et le stock
  const fetchAppros = () => {
    fetch('${import.meta.env.VITE_API_URL}/api/carburant/appro')
      .then(res => res.json())
      .then(data => {
        const formatted = data.slice(0, 3).map(a => createData(
          // slice reduit a 3 ligne
          new Date(a.date).toLocaleDateString('fr-FR'),
          a.litres,
          a.prixParLitre,
          a.coutTotal
        ))
        setRows(formatted)
      })

    fetch('${import.meta.env.VITE_API_URL}/api/carburant/stock')
      .then(res => res.json())
      .then(data => setStock(data))
  }

  // Calcul pourcentage
const pourcentageUtilise = stockMois.totalAchete > 0 
  ? Math.round((stockMois.totalDistribue / stockMois.totalAchete) * 100) 
  : 0

  useEffect(() => {
    fetchAppros()
    fetch('${import.meta.env.VITE_API_URL}/api/carburant/stock-mois')
    .then(res => res.json())
    .then(data => setStockMois(data))

  }, [])

    return (
        <Card sx={{ borderRadius: "12px" }}>

            {/* En-tête */}
                  <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ px: 2, py: 1.5 }}
                          >
                                    <Typography variant="h3">Gestion Du Stock Cotonou</Typography>
                                </Box>

                                {/* Contenu centré */}
                                <Box
                                    display="flex"
                                    sx={{ height: "350px" }}
                                >
                                    {/* Barre de progresse */}
                                    <Box sx={{ width: "100%", mt:3 }}>
                                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                                            <Typography variant="body1">Utilisation du stock ce mois</Typography>
                                            <Typography variant="body2">
                                             <span style={{ color: "#4cceac", fontWeight: 600 }}> Reste {stockMois.stockRestant}L</span> / {stockMois.totalAchete}L
                                            </Typography>
                                        </Box>
                                        <LinearProgress 
                                            // variant="determinate" 
                                            // value={64}
                                            variant="determinate"
                                            // value={stock.totalAchete > 0 ? (stock.stockActuel / stock.totalAchete) * 100 : 0}
                                            value = {pourcentageUtilise}
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
                                        {/* Capcite */}
                                        <Typography variant="caption" sx={{ color: "#4cceac", float: "right", mt: 0.5 }}>
                                          {pourcentageUtilise}% UTILISÉ CE MOIS
                                        </Typography>
                                        {/* Tableau */}
                                            
                                        <TableContainer  component={Paper}>
                                              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                  <TableRow>
                                                    <TableCell>DATE</TableCell>
                                                    <TableCell align="right">QUANTITE (L)</TableCell>
                                                    <TableCell align="right">PRIX/L</TableCell>
                                                    <TableCell align="right">TOTAL&nbsp;FCFA</TableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                  {rows.map((row) => (
                                                    <TableRow
                                                      key={row.name}
                                                      sx={{  '& td, & th': { borderBottom: '1px solid #334155' },
                                                                '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                      <TableCell align="right">{row.date}</TableCell>
                                                      <TableCell align="right">{row.quantite}</TableCell>
                                                      <TableCell align="right">{row.prix}</TableCell>
                                                      <TableCell align="right">{row.total}</TableCell>
                                                    </TableRow>
                                                  ))}
                                                </TableBody>
                                              </Table>
                                            </TableContainer>

                                                {/* btn apro */}
                                                
                                                  <center>
                                                    <Button onClick={() => setOpen(true)}
                                                     sx={{mt:3, width:"90%"}}  variant="outlined" startIcon={<AddOutlinedIcon />}>
                                                      Ajouter un approvisionnement
                                                     </Button>
                                                     {/* Dialog */}
                                                    <AddApproDialog 
                                                      onRefresh={fetchAppros} 
                                                    open={open} 
                                                    onClose={() => setOpen(false)}
                                                     />
                                                     
                                                  </center>
                                        </Box>
                                        
                                </Box>
                            </Card>    
    )

}

export default Gestion_Stock_Ctn