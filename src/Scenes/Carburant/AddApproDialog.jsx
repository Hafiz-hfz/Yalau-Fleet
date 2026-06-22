import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography
} from "@mui/material";

const AddApproDialog = ({ open, onClose, onRefresh  }) => {

  const [formData, setFormData] = useState({
    date: "",
    quantite: "",
    prix_litre: "",
    fournisseur: "",
    note: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



   const [errors, setErrors] = useState({});
   const validate = () => {
    const newErrors = {};

      if (!formData.quantite || formData.quantite <= 0) newErrors.quantite = "Doit être un nombre superieur à 0";
      if (!formData.prix_litre || formData.prix_litre <= 0) newErrors.prix_litre = "Doit être un nombre superieur à 0";
      if (!formData.date) newErrors.date = "Obligatoire";
  
      return newErrors;
    };
  // Total calculé automatiquement — quantité × prix/litre
  const total = formData.quantite && formData.prix_litre
    ? (parseFloat(formData.quantite) * parseFloat(formData.prix_litre)).toLocaleString()
    : "—";

   const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/carburant/appro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          litres: parseFloat(formData.quantite),
          prixParLitre: parseFloat(formData.prix_litre),
          date: formData.date,
          fournisseur: formData.fournisseur || null,
          note: formData.note || null,
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

      <DialogTitle>Ajouter un approvisionnement</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>

          {/* Date d'achat du carburant */}
          <TextField
            label="Date d'achat"
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

          {/* Quantité de carburant achetée */}
          <TextField
            label="Quantité achetée"
            name="quantite"
            type="number"
            value={formData.quantite}
            onChange={handleChange}
            placeholder="ex: 5000"
            fullWidth
            size="small"
            InputProps={{ endAdornment: "L" }}
            error={!!errors.quantite}
            helperText={errors.quantite}
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

          {/* Prix par litre au moment de l'achat */}
          <TextField
            label="Prix par litre"
            name="prix_litre"
            type="number"
            value={formData.prix_litre}
            onChange={handleChange}
            placeholder="ex: 650"
            fullWidth
            size="small"
            InputProps={{ endAdornment: "FCFA" }}
            error={!!errors.prix_litre}
            helperText={errors.prix_litre|| "ex: 0197656201"}
            // Que des chiffre 
            onKeyPress={(e) => {
              // Autorise chiffres, point et virgule / Bloque si un séparateur décimal existe déjà
              const valeur = e.target.value;
              if (!/[0-9]/.test(e.key)) e.preventDefault();
            }
            }
          />

          {/* Total calculé automatiquement — lecture seule */}
          <Box
            sx={{
              backgroundColor: "#1e2a3a",
              borderRadius: "8px",
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "#a0aec0" }}>
              Total calculé
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#4cceac", fontWeight: 600 }}
            >
              {total} FCFA
            </Typography>
          </Box>

          {/* Fournisseur ou station où YALAU a acheté */}
          <TextField
            label="Fournisseur / Station"
            name="fournisseur"
            value={formData.fournisseur}
            onChange={handleChange}
            placeholder="ex: Station Total Akpakpa"
            fullWidth
            size="small"
          />

          {/* Note ou remarque optionnelle */}
          <TextField
            label="Note / Remarque (optionnel)"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="ex: Achat urgent suite à stock bas"
            fullWidth
            size="small"
            multiline
            rows={2}
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

export default AddApproDialog;