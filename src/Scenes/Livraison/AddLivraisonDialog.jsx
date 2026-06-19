import { useState,useEffect  } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, InputLabel,
  FormControl, Box, Typography
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

// Génère un numéro de livraison automatique (Methode  a ne pas use en prod)
const generateNumLivraison = () => {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `LIV-${num}`;
};

const AddLivraisonDialog = ({ open, onClose,onRefresh  }) => {
  const [camions, setCamions] = useState([])    // AJOUTÉ
  const [chauffeurs, setChauffeurs] = useState([]) // AJOUTÉ


  const [formData, setFormData] = useState({
    num_livraison: generateNumLivraison(), // auto-généré à l'ouverture
    camion: "",
    chauffeur: "",
    ville_depart: "",
    ville_destination: "",
    date: "",
    statut: "",
  });

   // AJOUTÉ : charge camions et chauffeurs ( pour le select)
  useEffect(() => {
    fetch('${import.meta.env.VITE_API_URL}/api/camions')
      .then(res => res.json())
      .then(data => setCamions(data))

    fetch('${import.meta.env.VITE_API_URL}/api/chauffeurs')
      .then(res => res.json())
      .then(data => setChauffeurs(data))
  }, [])

  // Met à jour le champ concerné
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const [errors, setErrors] = useState({});
 const validate = () => {
  const newErrors = {};
    if (!formData.camion) newErrors.camion = "Obligatoire";
    if (!formData.chauffeur) newErrors.chauffeur = "Obligatoire";
    if (!formData.ville_depart) newErrors.ville_depart = "Obligatoire";
    if (!formData.ville_destination) newErrors.ville_destination = "Obligatoire";
    if (!formData.date) newErrors.date = "Obligatoire";
    if (!formData.statut) newErrors.statut = "Obligatoire";
    
    return newErrors;
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const response = await fetch('${import.meta.env.VITE_API_URL}/api/livraisons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        camionId: formData.camion,
        chauffeurId: formData.chauffeur,
        villeDepart: formData.ville_depart,
        villeDestination: formData.ville_destination,
        date: formData.date,
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

      <DialogTitle>Ajouter une livraison</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>

          {/* Numéro de livraison — auto-généré mais modifiable */}
          <TextField
            label="Numéro de livraison"
            name="num_livraison"
            value={formData.num_livraison}
            onChange={handleChange}
            fullWidth
            size="small"
            helperText="Généré automatiquement — vous pouvez le modifier"
            FormHelperTextProps={{ sx: { color: "#a0aec0" } }}
          />

          {/* Camion assigné à la livraison */}

         {/* Camion */}
            <Autocomplete
              options={camions}
              getOptionLabel={(option) => `${option.immatriculation} — ${option.marque}`}
              onChange={(e, newValue) => setFormData({ ...formData, camion: newValue ? newValue.id : "" })}
              renderInput={(params) => (
                <TextField {...params} label="Camion" size="small" error={!!errors.camion} helperText={errors.camion} />
              )}
            />

           
          {/* Chauffeur assigné à la livraison */}
          {/* Chauffeur */}
                <Autocomplete
                  options={chauffeurs}
                  getOptionLabel={(option) => option.nom}
                  onChange={(e, newValue) => setFormData({ ...formData, chauffeur: newValue ? newValue.id : "" })}
                  renderInput={(params) => (
                    <TextField {...params} label="Chauffeur" size="small" error={!!errors.chauffeur} helperText={errors.chauffeur} />
                  )}
                />
             
                              {/* Ville depart */}

           
                <TextField
                  name="ville_depart"
                  label="Ville de départ  "
                  value={formData.ville_depart}
                  onChange={handleChange}
                  size="small"
                  error={!!errors.ville_depart}
                  helperText={errors.ville_depart}
                />
              

          {/* Ville de destination — texte libre */}
          
              <TextField
                name = "ville_destination"
                 label="Ville de destination  "
                 value={formData.ville_destination}
                onChange={handleChange}
                size="small"
                 error={!!errors.ville_destination}
                 helperText={errors.ville_destination}
              />
           
          {/* Date de la livraison */}
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& input[type='date']::-webkit-calendar-picker-indicator": {
                filter: "invert(1)",
                cursor: "pointer",
              }
            }}
          />

          {/* Statut initial de la livraison */}
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
              <MenuItem value="en_attente">En attente</MenuItem>
              <MenuItem value="en_cours">En cours</MenuItem>
              <MenuItem value="livree">Livrée</MenuItem>
              <MenuItem value="annule">Annulé</MenuItem>
              
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

export default AddLivraisonDialog;