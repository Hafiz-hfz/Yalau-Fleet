import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography
} from "@mui/material";
import { WarningAmberOutlined } from "@mui/icons-material";

const DeleteChauffeurDialog = ({ open, onClose, chauffeur, onConfirm }) => {

  if (!chauffeur) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>

      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={2}>

          {/* Icône avertissement */}
          <WarningAmberOutlined sx={{ color: "#db4f4a", fontSize: "48px" }} />

          {/* Message de confirmation */}
          <Typography variant="h6" textAlign="center">
            Supprimer ce chauffeur ?
          </Typography>

          <Typography variant="body2" textAlign="center" sx={{ color: "#a0aec0" }}>
            Vous êtes sur le point de supprimer <strong style={{ color: "#e0e0e0" }}>{chauffeur.nom}</strong>. Cette action est irréversible.
          </Typography>

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "center", gap: 1 }}>
        {/* Annuler — ferme sans supprimer */}
        <Button onClick={onClose} variant="outlined" fullWidth>
          Annuler
        </Button>
        {/* Confirmer la suppression */}
        <Button
          onClick={() => { onConfirm(chauffeur); onClose(); }}
          variant="contained"
          color="error"
          fullWidth
        >
          Supprimer
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default DeleteChauffeurDialog;