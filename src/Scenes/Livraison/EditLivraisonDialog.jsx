import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, InputLabel,
  FormControl, Box
} from "@mui/material";

const EditLivraisonDialog = ({ open, onClose, livraison,onRefresh }) => {

 const [formData, setFormData] = useState({
    camionId: "", chauffeurId: "", ville_depart: "", ville_destination: "", date: "", statut: "", client: "",
  });

const [camions, setCamions] = useState([])     // AJOUTÉ
  const [chauffeurs, setChauffeurs] = useState([]) // AJOUTÉ

   // AJOUTÉ : charge camions et chauffeurs
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/camions`)
      .then(res => res.json())
      .then(data => setCamions(data))

    fetch(`${import.meta.env.VITE_API_URL}/api/chauffeurs`)
      .then(res => res.json())
      .then(data => setChauffeurs(data))
  }, [])


   // MODIFIÉ : pré-remplit correctement
  useEffect(() => {
    if (livraison) {
      setFormData({
        camionId: livraison.camionId || "",
        client: livraison.client || "", // AJOUTÉ
        chauffeurId: livraison.chauffeurId || "",
        ville_depart: livraison.depart || "",
        ville_destination: livraison.destination || "",
       date: livraison.rawDate || "",
        statut: livraison.statut || "",
      });
    }
  }, [livraison]);

  if (!livraison) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // Modification
   const handleSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/livraisons/${livraison.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          camionId: parseInt(formData.camionId),
          chauffeurId: parseInt(formData.chauffeurId),
          client: formData.client || null, // AJOUTÉ
          villeDepart: formData.ville_depart,
          villeDestination: formData.ville_destination,
          date: formData.date,
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
        Modifier la livraison — {livraison.num_livraison}
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>

          {/* Numéro de livraison — modifiable */}
          <TextField
            label="Numéro de livraison"
            name="num_livraison"
            value={formData.num_livraison}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          {/* Camion assigné */}
           {/* Camion */}
          <Autocomplete
            options={camions}
            value={camions.find(c => c.id === parseInt(formData.camionId)) || null}
            getOptionLabel={(option) => `${option.immatriculation} — ${option.marque}`}
            onChange={(e, newValue) => setFormData({ ...formData, camionId: newValue ? newValue.id : "" })}
            renderInput={(params) => (
              <TextField {...params} label="Camion" size="small" />
            )}
          />


          {/* Chauffeur assigné */}
           <Autocomplete
            options={chauffeurs}
            value={chauffeurs.find(c => c.id === parseInt(formData.chauffeurId)) || null}
            getOptionLabel={(option) => option.nom}
            onChange={(e, newValue) => setFormData({ ...formData, chauffeurId: newValue ? newValue.id : "" })}
            renderInput={(params) => (
              <TextField {...params} label="Chauffeur" size="small" />
            )}
          />

          {/* Client */}

          <TextField
            label="Client"
            name="client"
            value={formData.client}
            onChange={handleChange}
            placeholder="ex: Société XYZ"
            fullWidth
            size="small"
          />


          {/* Ville de départ */}
           <TextField
            label="Ville de départ"
            name="ville_depart"
            value={formData.ville_depart}
            onChange={handleChange}
            fullWidth size="small"
          />


          {/* Ville de destination */}
            <TextField
            label="Ville de destination"
            name="ville_destination"
            value={formData.ville_destination}
            onChange={handleChange}
            fullWidth size="small"
          />


          {/* Date */}
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
          />

         
          {/* Statut */}
          <FormControl fullWidth size="small">
            <InputLabel>Statut</InputLabel>
            <Select name="statut" value={formData.statut} onChange={handleChange} label="Statut">
             <MenuItem value="en_attente">En attente</MenuItem>
              <MenuItem value="en_cours">En cours</MenuItem>
              <MenuItem value="livree">Livrée</MenuItem>
              <MenuItem value="annule">Annulé</MenuItem>
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

export default EditLivraisonDialog;