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

const ViewVehiculeDialog = ({ open, onClose, vehicule }) => {

  // Si aucun véhicule sélectionné — ne rien afficher
  if (!vehicule) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

      <DialogTitle>
        Détails du véhicule — {vehicule.immatriculation}
      </DialogTitle>

      <DialogContent>
        <Box mt={1}>

          {/* Informations principales */}
          <Typography
            variant="caption"
            sx={{ color: "#4cceac", fontWeight: 600, letterSpacing: 1 }}
          >
            INFORMATIONS GÉNÉRALES
          </Typography>

          <InfoRow label="Immatriculation" value={vehicule.immatriculation} />
          <Divider sx={{ borderColor: "#1e2a3a" }} />
          <InfoRow label="Marque / Modèle" value={vehicule.marque_modele} />
          <Divider sx={{ borderColor: "#1e2a3a" }} />
          <InfoRow label="Capacité de charge" value={`${vehicule.capacite} tonnes`} />
          <Divider sx={{ borderColor: "#1e2a3a" }} />

          {/* Affectation */}
          <Typography
            variant="caption"
            sx={{ color: "#4cceac", fontWeight: 600, letterSpacing: 1, mt: 2, display: "block" }}
          >
            AFFECTATION
          </Typography>

          <InfoRow label="Chauffeur assigné" value={vehicule.chauffeur} />
          <Divider sx={{ borderColor: "#1e2a3a" }} />
          <InfoRow label="Dernière position" value={vehicule.derniere_position} />
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
            {/* Badge statut coloré */}
            <Box sx={{
              px: 1.5, py: 0.3,
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 600,
              backgroundColor:
                vehicule.statut === "actif" ? "#4cceac20" :
                vehicule.statut === "en maintenance" ? "#db4f4a20" : "#f0a50020",
              color:
                vehicule.statut === "actif" ? "#4cceac" :
                vehicule.statut === "en maintenance" ? "#db4f4a" : "#f0a500",
            }}>
              {vehicule.statut}
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

export default ViewVehiculeDialog;