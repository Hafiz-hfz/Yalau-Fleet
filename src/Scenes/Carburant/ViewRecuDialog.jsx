import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Divider
} from "@mui/material";
import { DownloadOutlined } from "@mui/icons-material";

const ViewRecuDialog = ({ open, onClose, ravitaillement }) => {

  if (!ravitaillement) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

      <DialogTitle>
        Reçu — {ravitaillement.camion}
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>

          {/* Informations contextuelles */}
          <Box
            sx={{
              backgroundColor: "#1e2a3a",
              borderRadius: "8px",
              px: 2, py: 1.5,
            }}
          >
            <Box display="flex" justifyContent="space-between" py={0.5}>
              <Typography variant="body2" sx={{ color: "#a0aec0" }}>Camion</Typography>
              <Typography variant="body2" sx={{ color: "#e0e0e0", fontWeight: 500 }}>{ravitaillement.camion}</Typography>
            </Box>
            <Divider sx={{ borderColor: "#0f1621" }} />
            <Box display="flex" justifyContent="space-between" py={0.5}>
              <Typography variant="body2" sx={{ color: "#a0aec0" }}>Chauffeur</Typography>
              <Typography variant="body2" sx={{ color: "#e0e0e0", fontWeight: 500 }}>{ravitaillement.chauffeur}</Typography>
            </Box>
            <Divider sx={{ borderColor: "#0f1621" }} />
            <Box display="flex" justifyContent="space-between" py={0.5}>
              <Typography variant="body2" sx={{ color: "#a0aec0" }}>Date</Typography>
              <Typography variant="body2" sx={{ color: "#e0e0e0", fontWeight: 500 }}>{ravitaillement.date}</Typography>
            </Box>
            <Divider sx={{ borderColor: "#0f1621" }} />
            <Box display="flex" justifyContent="space-between" py={0.5}>
              <Typography variant="body2" sx={{ color: "#a0aec0" }}>Montant</Typography>
              <Typography variant="body2" sx={{ color: "#4cceac", fontWeight: 600 }}>
                {ravitaillement.cout ? `${ravitaillement.cout.toLocaleString()} FCFA` : "—"}
              </Typography>
            </Box>
          </Box>

          {/* Image du reçu */}
          <Box
            sx={{
              backgroundColor: "#1e2a3a",
              borderRadius: "8px",
              overflow: "hidden",
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {ravitaillement.recu_fichier ? (
              // Affiche la vraie image si elle existe
               <img
             src={`${import.meta.env.VITE_API_URL}/uploads/${ravitaillement.recu}`}
              alt="Reçu carburant"
              style={{ width: "100%", objectFit: "contain" }}
            />
            ) : (
              // Placeholder pour le MVP
              <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                <Typography variant="body2" sx={{ color: "#a0aec0" }}>
                  Aperçu du reçu
                </Typography>
                <Box
                  sx={{
                    width: "200px",
                    height: "250px",
                    backgroundColor: "#0f1621",
                    borderRadius: "8px",
                    border: "1px dashed #334155",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#666666" }}>
                    Image du reçu
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" fullWidth>
          Fermer
        </Button>
        {/* Bouton télécharger — actif seulement si fichier existe */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<DownloadOutlined />}
          disabled={!ravitaillement.recu}
          href={`${import.meta.env.VITE_API_URL}/uploads/${ravitaillement.recu}`}
          download
        >
          Télécharger
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default ViewRecuDialog;