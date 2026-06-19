import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, InputLabel,
  FormControl, Box, Typography
} from "@mui/material";
import { FormHelperText } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect } from "react"; // MODIFIÉ

const AddRavitaillementDialog = ({ open, onClose, onRefresh}) => {
  




   const [camions, setCamions] = useState([])
  const [chauffeurs, setChauffeurs] = useState([])
  const [livraisons, setLivraisons] = useState([])

  useEffect(() => {
    fetch('${import.meta.env.VITE_API_URL}/api/camions')
      .then(res => res.json()).then(data => setCamions(data))

    fetch('${import.meta.env.VITE_API_URL}/api/chauffeurs')
      .then(res => res.json()).then(data => setChauffeurs(data))

    fetch('${import.meta.env.VITE_API_URL}/api/livraisons')
      .then(res => res.json()).then(data => setLivraisons(data))
  }, [])

  const [formData, setFormData] = useState({
    camion: "",
    chauffeur: "",
    litres: "",
    type: "",
    ville: "",
    date: "",
    cout: "",
    recu: null,
    livraison_liee: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion de l'upload du reçu
  const handleFileChange = (e) => {
    setFormData({ ...formData, recu: e.target.files[0] });
  };

 

 
  const [errors, setErrors] = useState({});
 const validate = () => {
  const newErrors = {};
    if (!formData.camion) newErrors.camion = "Obligatoire";
    if (!formData.chauffeur) newErrors.chauffeur = "Obligatoire";
    if (!formData.litres || formData.litres <= 0) newErrors.litres = "Doit être un nombre superieur à 0";
    if (!formData.type) newErrors.type = "Obligatoire";
    if (!formData.ville) newErrors.ville = "Obligatoire";
    if (!formData.date) newErrors.date = "Obligatoire";
    // if (!formData.cout) newErrors.cout = "Obligatoire";
    

    // Seulement si station externe
    if (formData.type === "station externe") {
      if (!formData.cout || formData.cout <= 0) newErrors.cout = "Obligatoire pour une station externe et doit être un nombre superieur à 0 ";
      if (!formData.recu) newErrors.recu = "Le reçu est obligatoire pour une station externe";
    }

    return newErrors;
  };

  // Pour obliger les submits
const handleSubmit = async () => {
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const formPayload = new FormData() // AJOUTÉ : pour gérer l'upload fichier
    formPayload.append('camionId', formData.camion)
    formPayload.append('chauffeurId', formData.chauffeur)
    formPayload.append('litres', formData.litres)
    formPayload.append('type', formData.type)
    formPayload.append('ville', formData.ville)
    formPayload.append('date', formData.date)
    formPayload.append('statut', 'en_attente')
    if (formData.cout) formPayload.append('cout', formData.cout)
    if (formData.recu) formPayload.append('recu', formData.recu)
    if (formData.livraison_liee) formPayload.append('livraisonId', formData.livraison_liee)

    const response = await fetch('${import.meta.env.VITE_API_URL}/api/carburant', {
      method: 'POST',
      body: formPayload // PAS de Content-Type header — FormData le gère automatiquement
    })
    if (!response.ok) throw new Error('Erreur serveur')
    onRefresh()
    onClose()
  } catch (error) {
    console.error('Erreur:', error)
  }
}


  // Détermine si c'est une station externe — affiche champs supplémentaires
  const isStationExterne = formData.type === "station_externe";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

      <DialogTitle>Ajouter un ravitaillement</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>


          <Autocomplete
          options={camions}
          getOptionLabel={(option) => `${option.immatriculation} — ${option.marque}`}
          onChange={(e, newValue) => setFormData({ ...formData, camion: newValue ? newValue.id : "" })}
          renderInput={(params) => (
            <TextField {...params} label="Camion" size="small" error={!!errors.camion} helperText={errors.camion} />
          )}
        />
          {/* Chauffeur concerné */}
          {/* Chauffeur */}
            <Autocomplete
              options={chauffeurs}
              getOptionLabel={(option) => option.nom}
              onChange={(e, newValue) => setFormData({ ...formData, chauffeur: newValue ? newValue.id : "" })}
              renderInput={(params) => (
                <TextField {...params} label="Chauffeur" size="small" error={!!errors.chauffeur} helperText={errors.chauffeur} />
              )}
            />
          {/* Quantité de carburant prise */}
          <TextField
            label="Litres"
            name="litres"
            type="number"
            value={formData.litres}
            onChange={handleChange}
            placeholder="ex: 120"
            fullWidth
            size="small"
            InputProps={{ endAdornment: "L" }}
            error={!!errors.litres}
            helperText={errors.litres|| "ex: 0197656201"}
            // Que des chiffres
              onKeyPress={(e) => {
              // Autorise chiffres, point et virgule / Bloque si un séparateur décimal existe déjà
              const valeur = e.target.value;
              if (!/[0-9.,]/.test(e.key)) e.preventDefault();
              if ((e.key === "." || e.key === ",") && (valeur.includes(".") || valeur.includes(","))) {
                e.preventDefault();
              }
            }
          }
          />

          {/* Type de ravitaillement — détermine les champs suivants */}
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Type"
              error={!!errors.type}
              helperText={errors.type}
            >
              <MenuItem value="stock_interne">Stock interne (Cotonou)</MenuItem>
              <MenuItem value="station_externe">Station externe</MenuItem>
            </Select>
            <FormHelperText>{errors.type}</FormHelperText>
          </FormControl>

          {/* Ville du ravitaillement */}
              <TextField
                label="Ville"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                fullWidth
                size="small"
                error={!!errors.ville}
                helperText={errors.ville}
              />


          {/* Date du ravitaillement */}
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& input[type='date']::-webkit-calendar-picker-indicator": {
                filter: "invert(1)",
                cursor: "pointer",
              }
            }}
            error={!!errors.date}
            helperText={errors.date}
          />

          {/* Coût — visible seulement si station externe */}
          {isStationExterne && (
            <TextField
              label="Coût"
              name="cout"
              type="number"
              onKeyPress={(e) => {
              // Autorise chiffres, point et virgule / Bloque si un séparateur décimal existe déjà
              const valeur = e.target.value;
              if (!/[0-9]/.test(e.key)) e.preventDefault();
              
            }
            }
              value={formData.cout}
              onChange={handleChange}
              placeholder="ex: 78000"
              fullWidth
              size="small"
              InputProps={{ endAdornment: "FCFA" }}
              error={!!errors.cout}
              helperText={errors.cout}
              
              
            />
          )}

          {/* Upload reçu — visible seulement si station externe */}
          {isStationExterne && (
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#a0aec0", mb: 0.5 }}
              >
                Reçu de la station (obligatoire)
              </Typography>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                style={{ color: "#e0e0e0" }}
              />
              {/* Affiche le nom du fichier sélectionné */}
              {formData.recu && (
                <Typography variant="caption" sx={{ color: "#4cceac", mt: 0.5, display: "block" }}>
                  ✓ {formData.recu.name}
                </Typography>
              )}
            </Box>
          )}

          {/* Livraison liée — optionnel, relie le carburant à une livraison */}
          <Autocomplete
            options={livraisons}
            getOptionLabel={(option) => `${option.numeroLivraison} — ${option.villeDepart} → ${option.villeDestination}`}
            onChange={(e, newValue) => setFormData({ ...formData, livraison_liee: newValue ? newValue.id : "" })}
            renderInput={(params) => (
              <TextField {...params} label="Livraison liée (optionnel)" size="small" />
            )}
          />

        </Box>
      </DialogContent>

      {/* Boutons d'action */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Enregistrer
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default AddRavitaillementDialog;