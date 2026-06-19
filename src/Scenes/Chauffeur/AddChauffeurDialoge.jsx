import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, InputLabel,
  FormControl, Box
} from "@mui/material";
import { useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";

const AddChauffeurDialog = ({ open, onClose , onRefresh  }) => {

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    num_permis: "",
    vehicule: "",
    statut: "",
  });

   const [camions, setCamions] = useState([])

useEffect(() => {
  fetch('${import.meta.env.VITE_API_URL}/api/camions')
    .then(res => res.json())
    .then(data => setCamions(data))
}, [])


  // Met à jour le champ concerné
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [errors, setErrors] = useState({});
   const validate = () => {
    const newErrors = {};
  const telRegex = /^01[0-9]{8}$/;
      if (!formData.nom) newErrors.nom = "Obligatoire";
      // Télephone
 if (!formData.telephone) {
    newErrors.telephone = "Le téléphone est obligatoire";
  } else if (!telRegex.test(formData.telephone)) {
    newErrors.telephone = "Format invalide — ex: 0197656201";
  }
      if (!formData.num_permis) newErrors.num_permis = "Obligatoire";
      if (!formData.vehicule) newErrors.vehicule = "Obligatoire";    
      if (!formData.statut) newErrors.statut = "Obligatoire";
      return newErrors;
    };

  // Soumission du formulaire
 const handleSubmit = async () => {
  console.log('vehicule selectionné:', formData.vehicule)
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const response = await fetch('${import.meta.env.VITE_API_URL}/api/chauffeurs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: formData.nom,
        telephone: formData.telephone,
        numeroPermis: formData.num_permis,  // nom aligné avec le schéma
        camionId: formData.vehicule ? parseInt(formData.vehicule) : null,
        statut: formData.statut,
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

      <DialogTitle>Ajouter un chauffeur</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>

          {/* Nom complet du chauffeur */}
          <TextField
            label="Nom complet"
            name="nom"
            value={formData.nom_complet}
            onChange={handleChange}
            placeholder="ex: Kouadio Jean"
            fullWidth
            size="small"
            error={!!errors.nom}
            helperText={errors.nom}
          />

          {/* Numéro de téléphone */}
          <TextField
            label="Téléphone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="ex: +229 97 00 00 00"
            fullWidth
            size="small"
            error={!!errors.telephone}
            helperText={errors.telephone}
            FormHelperTextProps={{ sx: { color: errors.telephone ? "#db4f4a" : "#a0aec0" } }}
            fullWidth
            size="small"
            // Que des chiffres
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
          />

          {/* Numéro de permis de conduire */}
          <TextField
            label="Numéro de permis"
            name="num_permis"
            value={formData.num_permis}
            onChange={handleChange}
            placeholder="ex: BJ-2024-00123"
            fullWidth
            size="small"
            error={!!errors.num_permis}
            helperText={errors.num_permis}
          />

          {/* Véhicule assigné — sera dynamique avec les vrais camions */}
        <Autocomplete
          options={camions}
          getOptionLabel={(option) => `${option.immatriculation} — ${option.marque}`}
          onChange={(e, newValue) => setFormData({ ...formData, vehicule: newValue ? newValue.id : "" })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Véhicule assigné"
              size="small"
              error={!!errors.vehicule}
              helperText={errors.vehicule}
            />
          )}
          
        />
           
              
             

          {/* Statut du chauffeur */}
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
              <MenuItem value="disponible">Disponible</MenuItem>
              <MenuItem value="en_mission">En misson</MenuItem>
              
            </Select>
          </FormControl>

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
  );
};

export default AddChauffeurDialog;