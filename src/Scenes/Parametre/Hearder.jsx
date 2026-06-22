import { Card, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import LocalGasStationOutlined from "@mui/icons-material/LocalGasStationOutlined";
import { useState, useEffect } from "react";
// input number
import {TextField , Button, InputAdornment } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';



function Heard () {
      const [seuilAlerte, setSeuilAlerte] = useState(0)
      const [prixParLitre, setPrixParLitre] = useState(0)

       // Charge les paramètres au démarrage
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/parametres`)
        .then(res => res.json())
        .then(data => {
            setSeuilAlerte(data.seuilAlerte)
            setPrixParLitre(data.prixParLitre)
        })
    }, [])

     // Sauvegarde
        const handleSave = async () => {
            await fetch(`${import.meta.env.VITE_API_URL}/api/parametres`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seuilAlerte, prixParLitre })
            })
        }
    return (
        <div>
              <Card sx={{p:3}}>
                    <Box>
                         <Typography variant="h3"> <LocalGasStationOutlined/> Carburant & Alertes  </Typography> 
                        {/* CHamps  */}
                <Box display={'flex'} sx={{justifyContent: "space-between", mt:4}}>
                    <div>
                        <TextField
                            label="Seuil d'alerte stock bas"
                            InputLabelProps={{
                                sx: { color: "#fff" }
                            }}
                            type="number"
                            value={seuilAlerte}
                             onChange={(e) => setSeuilAlerte(e.target.value)}
                            size="small"
                            helperText="Une alerte sera déclanchée quand le stock descend sous ce seuil."
                            FormHelperTextProps={{
                                sx: { color: "#fff" }  // gris plus clair, lisible sur fond sombre
                            }}
                                                
                            InputProps={{
                                endAdornment: <InputAdornment position="end">L</InputAdornment>
                            }}
                        />
                    </div>
                    <div>
                        <TextField
                            label="Prix au litre"
                            InputLabelProps={{
                                sx: { color: "#fff" }
                            }}
                            type="number"
                             value={prixParLitre}
                             onChange={(e) => setPrixParLitre(e.target.value)}
                            size="small"
                            helperText="Utilisé pour calculer automatiquement les coûts de ravitaillement."
                            FormHelperTextProps={{
                                sx: { color: "#fff" }  // gris plus clair, lisible sur fond sombre
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">FCFA</InputAdornment>
                        }}
                        />
                    </div>
    </Box>
     <Box display={'flex'} sx={{justifyContent: "space-between", mt:4}}>
        <div></div>
         <div>
             <Button onClick={handleSave}
                                     component="label"
                                     role={undefined}
                                      variant="contained"
                                     tabIndex={-1}
                                     startIcon={<SaveIcon />}
                                   > 
                                  Enregistrer les modifications
                                   </Button>
         </div>
     </Box>
 </Box>
 </Card>
  </div>
    )
}

export default Heard