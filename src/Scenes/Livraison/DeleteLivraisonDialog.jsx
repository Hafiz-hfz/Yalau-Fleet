import {
  Dialog, DialogContent, DialogActions,
  Button, Box, Typography
} from "@mui/material";
import { WarningAmberOutlined } from "@mui/icons-material";

const DeleteLivraisonDialog = ({ open, onClose, livraison, onConfirm }) => {

  if (!livraison) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>

      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={2}>

          <WarningAmberOutlined sx={{ color: "#db4f4a", fontSize: "48px" }} />

          <Typography variant="h6" textAlign="center">
            Supprimer cette livraison ?
          </Typography>

          <Typography variant="body2" textAlign="center" sx={{ color: "#a0aec0" }}>
            Vous êtes sur le point de supprimer la livraison <strong style={{ color: "#e0e0e0" }}>{livraison.num_livraison}</strong>. Cette action est irréversible.
          </Typography>

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "center", gap: 1 }}>
        <Button onClick={onClose} variant="outlined" fullWidth>
          Annuler
        </Button>
        <Button
          onClick={() => { onConfirm(livraison); onClose(); }}
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

export default DeleteLivraisonDialog;