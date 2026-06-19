import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, InputLabel,
  FormControl, Box, IconButton, InputAdornment
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";

const EditUserDialog = ({ open, onClose, user, onRefresh }) => { // AJOUTÉ onRefresh

  const [formData, setFormData] = useState({
    nom: "", telephone: "", email: "", role: "", statut: "", mot_de_passe: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || "",
        telephone: user.telephone || "",
        email: user.email || "",
        role: user.role || "",
        statut: user.statut || "",
        mot_de_passe: "",
      });
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // MODIFIÉ : envoie à l'API
  const handleSubmit = async () => {
    try {
      const body = {
        nom: formData.nom,
        telephone: formData.telephone,
        email: formData.email,
        role: formData.role,
        statut: formData.statut,
      }
      // AJOUTÉ : inclut le mot de passe seulement s'il est renseigné
      if (formData.mot_de_passe) body.password = formData.mot_de_passe

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
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
      <DialogTitle>Modifier l'utilisateur — {user.nom}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>

          <TextField
            label="Nom complet" name="nom"
            value={formData.nom} onChange={handleChange}
            fullWidth size="small"
          />

          <TextField
            label="Téléphone" name="telephone"
            value={formData.telephone} onChange={handleChange}
            fullWidth size="small"
            onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault() }}
          />

          <TextField
            label="Email" name="email" type="email"
            value={formData.email} onChange={handleChange}
            fullWidth size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Rôle</InputLabel>
            <Select name="role" value={formData.role} onChange={handleChange} label="Rôle">
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="chauffeur">Chauffeur</MenuItem>
              <MenuItem value="gestionnaire">Gestionnaire</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Statut</InputLabel>
            <Select name="statut" value={formData.statut} onChange={handleChange} label="Statut">
              <MenuItem value="actif">Actif</MenuItem>
              <MenuItem value="inactif">Inactif</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Nouveau mot de passe (optionnel)"
            name="mot_de_passe"
            type={showPassword ? "text" : "password"}
            value={formData.mot_de_passe} onChange={handleChange}
            fullWidth size="small"
            helperText="Laisser vide pour ne pas modifier le mot de passe."
            FormHelperTextProps={{ sx: { color: "#a0aec0" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                    {showPassword ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
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

export default EditUserDialog;