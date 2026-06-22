import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, InputLabel,
  FormControl, Box
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete"; // AJOUTÉ

const EditChauffeurDialog = ({ open, onClose, chauffeur, onRefresh  }) => {

    const [formData, setFormData] = useState({
    nom: "", 
    telephone: "", 
    num_permis: "", 
    camionId: "", 
    statut: "",
  });

   const [camions, setCamions] = useState([]) // AJOUTÉ

   // AJOUTÉ : charge les camions
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/camions`)
      .then(res => res.json())
      .then(data => setCamions(data))
  }, [])

  // Pré-remplit le formulaire avec les données du chauffeur sélectionné
  useEffect(() => {
    if (chauffeur) {
      console.log('chauffeur reçu:', chauffeur)  
      console.log('camionId:', chauffeur.camionId)
      setFormData({
         nom: chauffeur.nom || "",
        telephone: chauffeur.telephone || "",
        num_permis: chauffeur.num_permis || "",
        camionId: chauffeur.camionId ? parseInt(chauffeur.camionId) : "",
        statut: chauffeur.statut || "",
      });
    }
  }, [chauffeur]);

  if (!chauffeur) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // MODIFIÉ : envoie à l'API
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chauffeurs/${chauffeur.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom,
          telephone: formData.telephone,
          numeroPermis: formData.num_permis,
          camionId: formData.camionId ? parseInt(formData.camionId) : null,
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
        Modifier le chauffeur — {chauffeur.nom}
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>

          {/* Nom complet */}
          <TextField
            label="Nom complet"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          {/* Téléphone */}
          <TextField
            label="Téléphone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          {/* Numéro de permis */}
          <TextField
            label="Numéro de permis"
            name="num_permis"
            value={formData.num_permis}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          {/* Véhicule assigné */}
          <Autocomplete
            options={camions}
            value={camions.find(c => c.id === parseInt(formData.camionId)) || null}
            getOptionLabel={(option) => `${option.immatriculation} — ${option.marque}`}
            onChange={(e, newValue) => setFormData({ ...formData, camionId: newValue ? newValue.id : "" })}
            renderInput={(params) => (
              <TextField {...params} label="Véhicule assigné" size="small" />
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
              <MenuItem value="en_mission">En mission</MenuItem>
            </Select>
          </FormControl>

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

export default EditChauffeurDialog;