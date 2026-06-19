import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, InputLabel,
  FormControl, Box, IconButton, InputAdornment
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { FormHelperText } from "@mui/material";
const AddUserDialog = ({ open, onClose, onRefresh  }) => {

  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    email: "",
    role: "",
    statut: "",
    mot_de_passe: "",
  });

  // Contrôle visibilité du mot de passe
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Gestion des erreurs

  const [errors, setErrors] = useState({});

  const validate = () => {
  const newErrors = {};
  const telRegex = /^01[0-9]{8}$/;
  if (!formData.nom) newErrors.nom = "Le nom est obligatoire";
  // Télephone
 if (!formData.telephone) {
    newErrors.telephone = "Le téléphone est obligatoire";
  } else if (!telRegex.test(formData.telephone)) {
    newErrors.telephone = "Format invalide — ex: 0197656201";
  }
  if (!formData.role) newErrors.role = "Le role est obligatoire";
  if (!formData.statut) newErrors.statut = "Le statut est obligatoire";
  if (!formData.mot_de_passe) newErrors.mot_de_passe = "Le mot de passe est obligatoire"
  // Mail


  return newErrors;
};


 const handleSubmit = async () => {
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const response = await fetch('${import.meta.env.VITE_API_URL}/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: formData.nom,
        telephone: formData.telephone,
        email: formData.email,
        role: formData.role,
        statut: formData.statut,
        password: formData.mot_de_passe,
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

      <DialogTitle>Ajouter un utilisateur</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>


          {/* Nom complet */}
          <TextField
            label="Nom complet"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="ex: Adjovi Marc"
            error={!!errors.nom}
            helperText={errors.nom}
            fullWidth
            size="small"
             onKeyPress={(e) => {
            if (!/[a-zA-ZÀ-ÿ\s]/.test(e.key)) e.preventDefault();
          }}
          />

          {/* Numéro de téléphone */}
          <TextField
            label="Téléphone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="ex: +229 01 97 00 00 00"
            error={!!errors.telephone}
            // helperText={errors.telephone}
            helperText={errors.telephone || "ex: 0197656201"}
            FormHelperTextProps={{ sx: { color: errors.telephone ? "#db4f4a" : "#a0aec0" } }}
            fullWidth
            size="small"
            // Que des chiffres
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />

          {/* Adresse email */}
          <TextField
            label="Email (optionnel)"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ex: nom@gmail.com"
            fullWidth
            size="small"
          
          />

          {/* Rôle — détermine les accès dans l'application */}
          <FormControl fullWidth size="small">
            <InputLabel>Rôle</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Rôle"
              error={!!errors.role}
              helperText={errors.role}
            >
              {/* Manager — accès complet */}
              <MenuItem value="manager">Manager</MenuItem>
              {/* Chauffeur — accès limité à ses livraisons */}
              <MenuItem value="chauffeur">Chauffeur</MenuItem>
            </Select>
          </FormControl>

          {/* Statut du compte */}
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
              <MenuItem value="actif">Actif</MenuItem>
              <MenuItem value="inactif">Inactif</MenuItem>
            </Select>
          </FormControl>

          {/* Mot de passe provisoire — avec toggle visibilité */}
          <TextField
            label="Mot de passe provisoire"
            name="mot_de_passe"
            type={showPassword ? "text" : "password"}
            value={formData.mot_de_passe}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.mot_de_passe}
            helperText={errors.mot_de_passe}
            helperText="L'utilisateur devra le changer à sa première connexion."
            FormHelperTextProps={{ sx: { color: "#a0aec0" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    size="small"
                  >
                    {showPassword
                      ? <VisibilityOffOutlined fontSize="small" />
                      : <VisibilityOutlined fontSize="small" />
                    }
                  </IconButton>
                </InputAdornment>
              )
            }}
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

export default AddUserDialog;