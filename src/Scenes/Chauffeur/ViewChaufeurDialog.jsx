import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Divider
} from "@mui/material";

// Composant réutilisable pour afficher une ligne d'info
const InfoRow = ({ label, value }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
    <Typography variant="body2" sx={{ color: "#a0aec0" }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ color: "#e0e0e0", fontWeight: 500 }}>
      {value || "—"}
    </Typography>
  </Box>
);

const ViewChauffeurDialog = ({ open, onClose, chauffeur }) => {

  if (!chauffeur) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

      <DialogTitle>
        Détails du chauffeur — {chauffeur.nom}
      </DialogTitle>

      <DialogContent>
        <Box mt={1}>

          {/* Informations personnelles */}
          <Typography
            variant="caption"
            sx={{ color: "#4cceac", fontWeight: 600, letterSpacing: 1 }}
          >
            INFORMATIONS PERSONNELLES
          </Typography>

          <InfoRow label="Nom complet" value={chauffeur.nom} />
          <Divider sx={{ borderColor: "#1e2a3a" }} />
          <InfoRow label="Téléphone" value={chauffeur.telephone} />
          <Divider sx={{ borderColor: "#1e2a3a" }} />
          <InfoRow label="Numéro de permis" value={chauffeur.num_permis} />
          <Divider sx={{ borderColor: "#1e2a3a" }} />

          {/* Affectation */}
          <Typography
            variant="caption"
            sx={{ color: "#4cceac", fontWeight: 600, letterSpacing: 1, mt: 2, display: "block" }}
          >
            AFFECTATION
          </Typography>

          <InfoRow label="Camion assigné" value={chauffeur.camion_affecte} />
          <Divider sx={{ borderColor: "#1e2a3a" }} />

          {/* Statut */}
          <Typography
            variant="caption"
            sx={{ color: "#4cceac", fontWeight: 600, letterSpacing: 1, mt: 2, display: "block" }}
          >
            STATUT
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
            <Typography variant="body2" sx={{ color: "#a0aec0" }}>
              Statut actuel
            </Typography>
            <Box sx={{
              px: 1.5, py: 0.3,
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 600,
              backgroundColor:
                chauffeur.statut?.toLowerCase() === "disponible" ? "#4cceac20" :
                chauffeur.statut?.toLowerCase() === "en mission" ? "#6870fa20" : "#f0a50020",
              color:
                chauffeur.statut?.toLowerCase() === "disponible" ? "#4cceac" :
                chauffeur.statut?.toLowerCase() === "en mission" ? "#6870fa" : "#f0a500",
            }}>
              {chauffeur.statut}
            </Box>
          </Box>

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Fermer
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default ViewChauffeurDialog;