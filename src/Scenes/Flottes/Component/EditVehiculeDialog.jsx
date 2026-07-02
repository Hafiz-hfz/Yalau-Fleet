import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, InputLabel,
  FormControl, Box
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";


const EditVehiculeDialog = ({ open, onClose, vehicule,onRefresh }) => {

  const [formData, setFormData] = useState({
    immatriculation: "",
    marque_modele: "",
    capacite: "",
    chauffeur: "",
    statut: "",
    derniere_position: "",
  });

  // MODIFIÉ : pré-remplit avec les bons noms de champs
    useEffect(() => {
      if (vehicule) {
        setFormData({
          immatriculation: vehicule.immatriculation || "",
          marque_modele: vehicule.marque_modele || "",   
          capacite: vehicule.capacite || "",
          statut: vehicule.statut || "",
        });
      }
    }, [vehicule]);  // se déclenche chaque fois qu'un nouveau véhicule est sélectionné

    const [chauffeurs, setChauffeurs] = useState([])
useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/chauffeurs`)
    .then(res => res.json())
    .then(data => setChauffeurs(data))
}, [])

  if (!vehicule) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // MODIFIÉ : envoie la modification à l'API
const handleSubmit = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/camions/${vehicule.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        immatriculation: formData.immatriculation,
        marque: formData.marque_modele,
        capaciteCharges: parseFloat(formData.capacite),
        statut: formData.statut,
      })
    })
    if (!response.ok) throw new Error('Erreur serveur')
    onRefresh()  // AJOUTÉ
    onClose()
  } catch (error) {
    console.error('Erreur:', error)
  }
}

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

      <DialogTitle>
        Modifier le véhicule — {vehicule.immatriculation}
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>

          {/* Immatriculation */}
          <TextField
            label="Immatriculation"
            name="immatriculation"
            value={formData.immatriculation}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          {/* Marque / Modèle */}
          <TextField
            label="Marque / Modèle"
            name="marque_modele"
            value={formData.marque_modele}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          {/* Capacité de charge */}
          <TextField
            label="Capacité de charge"
            name="capacite"
            type="number"
            value={formData.capacite}
            onChange={handleChange}
            fullWidth
            size="small"
            InputProps={{ endAdornment: "tonnes" }}
          />

          {/* Chauffeur assigné */}
          <Autocomplete
              options={chauffeurs}
              value={chauffeurs.find(c => c.id === formData.camionId) || null}
              getOptionLabel={(option) => `${option.nom}`}
              onChange={(e, newValue) => setFormData({ ...formData, chauffeur: newValue ? newValue.id : "" })}
              renderInput={(params) => (
                <TextField {...params} label="Chauffeur assigné" size="small" />
              )}
            />

           

          {/* Statut */}
          <FormControl fullWidth size="small">
            <InputLabel>Statut</InputLabel>
            <Select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              label="Statut"
            >
              <MenuItem value="disponible">Disponible</MenuItem>
              <MenuItem value="en_route">En route</MenuItem>
              <MenuItem value="en_panne">En panne</MenuItem>
            </Select>
          </FormControl>

          {/* Dernière position */}
          <TextField
            label="Dernière position connue"
            name="derniere_position"
            value={formData.derniere_position}
            onChange={handleChange}
            fullWidth
            size="small"
          />

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Enregistrer les modifications
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default EditVehiculeDialog;