import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, InputLabel,
  FormControl, Box, Typography
} from "@mui/material";

const EditRavitaillementDialog = ({ open, onClose, ravitaillement, onRefresh }) => {

  const [formData, setFormData] = useState({
    camionId: "", chauffeurId: "", litres: "", type: "",
    ville: "", date: "", cout: "", livraisonId: "",
  });

  const [camions, setCamions] = useState([])
  const [chauffeurs, setChauffeurs] = useState([])
  const [livraisons, setLivraisons] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/camions`).then(res => res.json()).then(setCamions)
    fetch(`${import.meta.env.VITE_API_URL}/api/chauffeurs`).then(res => res.json()).then(setChauffeurs)
    fetch(`${import.meta.env.VITE_API_URL}/api/livraisons`).then(res => res.json()).then(setLivraisons)
  }, [])

  useEffect(() => {
    if (ravitaillement) {
      setFormData({
        camionId: ravitaillement.camionId || "",
        chauffeurId: ravitaillement.chauffeurId || "",
        litres: ravitaillement.litres || "",
        type: ravitaillement.type || "",
        ville: ravitaillement.ville || "",
        date: ravitaillement.rawDate || "",
        cout: ravitaillement.cout || "",
        livraisonId: ravitaillement.livraisonId || "",
      });
    }
  }, [ravitaillement]);

  if (!ravitaillement) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStationExterne = formData.type === "station_externe";

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/carburant/${ravitaillement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          camionId: parseInt(formData.camionId),
          chauffeurId: parseInt(formData.chauffeurId),
          litres: parseFloat(formData.litres),
          type: formData.type,
          ville: formData.ville,
          date: formData.date,
          cout: formData.cout ? parseFloat(formData.cout) : null,
          livraisonId: formData.livraisonId ? parseInt(formData.livraisonId) : null,
        })
      })
      if (!response.ok) throw new Error('Erreur serveur')
      onRefresh()
      onClose()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier le ravitaillement</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>

          {/* Camion */}
          <Autocomplete
            options={camions}
            value={camions.find(c => c.id === parseInt(formData.camionId)) || null}
            getOptionLabel={(option) => `${option.immatriculation} — ${option.marque}`}
            onChange={(e, newValue) => setFormData({ ...formData, camionId: newValue ? newValue.id : "" })}
            renderInput={(params) => <TextField {...params} label="Camion" size="small" />}
          />

          {/* Chauffeur */}
          <Autocomplete
            options={chauffeurs}
            value={chauffeurs.find(c => c.id === parseInt(formData.chauffeurId)) || null}
            getOptionLabel={(option) => option.nom}
            onChange={(e, newValue) => setFormData({ ...formData, chauffeurId: newValue ? newValue.id : "" })}
            renderInput={(params) => <TextField {...params} label="Chauffeur" size="small" />}
          />

          {/* Litres */}
          <TextField
            label="Litres" name="litres" type="number"
            value={formData.litres} onChange={handleChange}
            fullWidth size="small" InputProps={{ endAdornment: "L" }}
          />

          {/* Type */}
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select name="type" value={formData.type} onChange={handleChange} label="Type">
              <MenuItem value="stock_interne">Stock interne (Cotonou)</MenuItem>
              <MenuItem value="station_externe">Station externe</MenuItem>
            </Select>
          </FormControl>

          {/* Ville */}
          <TextField
            label="Ville" name="ville"
            value={formData.ville} onChange={handleChange}
            fullWidth size="small"
          />

          {/* Date */}
          <TextField
            label="Date" name="date" type="date"
            value={formData.date} onChange={handleChange}
            fullWidth size="small" InputLabelProps={{ shrink: true }}
            sx={{ "& input[type='date']::-webkit-calendar-picker-indicator": { filter: "invert(1)", cursor: "pointer" } }}
          />

          {/* Coût — seulement si station externe */}
          {isStationExterne && (
            <TextField
              label="Coût" name="cout" type="number"
              value={formData.cout} onChange={handleChange}
              fullWidth size="small" InputProps={{ endAdornment: "FCFA" }}
            />
          )}

          {/* Livraison liée */}
          <Autocomplete
            options={livraisons}
            value={livraisons.find(l => l.id === parseInt(formData.livraisonId)) || null}
            getOptionLabel={(option) => `${option.numeroLivraison} — ${option.villeDepart} → ${option.villeDestination}`}
            onChange={(e, newValue) => setFormData({ ...formData, livraisonId: newValue ? newValue.id : "" })}
            renderInput={(params) => <TextField {...params} label="Livraison liée (optionnel)" size="small" />}
          />

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">Enregistrer les modifications</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRavitaillementDialog;