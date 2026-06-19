import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, InputLabel,
  FormControl, Box, Grid
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const AddVehiculeDialog = ({ open, onClose, onRefresh  }) => {
  
  const [formData, setFormData] = useState({
    immatriculation: "",
    marque: "",
    capaciteCharges: "",
    chauffeur: "",
    statut: "",
    derniere_position: "",
  });

 
  // Met à jour le champ concerné quand l'utilisateur tape
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Erreur
    const [errors, setErrors] = useState({});
  const validate = () => {
  const newErrors = {};
  if (!formData.immatriculation) newErrors.immatriculation = "Obligatoire";
  if (!formData.marque) newErrors.marque = "Obligatoire";
  if (!formData.capaciteCharges) newErrors.capaciteCharges = "Obligatoire";
  if (!formData.statut) newErrors.statut = "Obligatoire";
  // (SUPPRIMÉ) : derniere_position et chauffeur (pas encore dans le schéma)
  return newErrors;
};

  
  // Soumission du formulaire
const handleSubmit = async () => { // MODIFIÉ : ajout async
  const newErrors = validate();
  console.log('formData envoyé:', formData) 

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    // AJOUTÉ : envoi des données à l'API Express
    const response = await fetch('${import.meta.env.VITE_API_URL}/api/camions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        immatriculation: formData.immatriculation,
        marque: formData.marque,
        capaciteCharges: parseFloat(formData.capaciteCharges), // AJOUTÉ : converti en nombre
        statut: formData.statut,
      })
    })

    if (!response.ok) throw new Error('Erreur serveur') // AJOUTÉ : gestion erreur
    onRefresh() 
    onClose()
  } catch (error) {
    console.error('Erreur:', error) // AJOUTÉ : log erreur
  }
};

  return (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
     <DialogTitle>Ajouter un véhicule</DialogTitle>
           <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>

          {/* Immatriculation — identifiant principal du camion */}
          <TextField
            label="Immatriculation"
            name="immatriculation"
            value={formData.immatriculation}
            onChange={handleChange}
            placeholder="ex: BJ-1234"
            fullWidth
            size="small"
            error={!!errors.immatriculation}
            helperText={errors.immatriculation}
          />

          {/* Marque et modèle du véhicule */}
          <TextField
            label="Marque / Modèle"
            name="marque"
            value={formData.marque}
            onChange={handleChange}
            placeholder="ex: Isuzu NPR"
            fullWidth
            size="small"
             error={!!errors.marque}
            helperText={errors.marque}
          />

          {/* Capacité de charge en tonnes */}
          <TextField
            label="Capacité de charge"
            name="capaciteCharges"
            type="number"
            value={formData.capaciteCharges}
            onChange={handleChange}
            placeholder="ex: 5"
            fullWidth
            size="small"
            InputProps={{ endAdornment: "tonnes" }}
             error={!!errors.capaciteCharges}
            helperText={errors.capaciteCharges}
          />

          {/* Chauffeur assigné — sera un dropdown dynamique(ceux qui sont dans la base)plus tard */}
          {/* <Autocomplete
            options={["Kouadio", "Mensah", "Adjovi" ]}
            value={formData.chauffeur}
            onChange={(e, newValue) => setFormData({ ...formData, chauffeur: newValue })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chauffeur assigné  "
                size="small"
                error={!!errors.chauffeur}
                helperText={errors.chauffeur}
              />
            )}
          /> */}
             

          {/* Statut actuel du véhicule */}
          <FormControl fullWidth size="small">
            <InputLabel>Statut</InputLabel>
            <Select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              label="Statut"
               error={!!errors.statut}
             helperText={errors.statut}
            >
               {/* MODIFIÉ : valeurs alignées avec le schéma Prisma */}
              <MenuItem value="disponible">Disponible</MenuItem>
              <MenuItem value="en_route">En route</MenuItem>
              <MenuItem value="en_panne">En panne</MenuItem>
            </Select>
          </FormControl>

          {/* Dernière position connue — texte libre, sera GPS plus tard */}
          {/* <TextField
            label="Dernière position connue"
            name="derniere_position"
            value={formData.derniere_position}
            onChange={handleChange}
            placeholder="ex: Zone Industrielle Akpakpa"
            fullWidth
            size="small"
           
          /> */}
        </Box>
      </DialogContent>

      {/* Boutons d'action */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {/* Annuler — ferme sans sauvegarder */}
        <Button onClick={onClose} variant="outlined">
          Annuler
        </Button>
        {/* Enregistrer — soumet le formulaire */}
        <Button onClick={handleSubmit} variant="contained">
          Enregistrer
        </Button>
      </DialogActions>

  </Dialog>
  )
};

export default AddVehiculeDialog;