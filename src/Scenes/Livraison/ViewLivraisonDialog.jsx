import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Divider
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { ContentCopyOutlined } from "@mui/icons-material";
import { LocationOnOutlined } from "@mui/icons-material";

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

const ViewLivraisonDialog = ({ open, onClose, livraison }) => {

  if (!livraison) return null;

  // Couleurs du statut
  const getStatutStyle = (statut) => {
    switch (statut?.toLowerCase()) {
      case "livré":
        return { bg: "#4cceac20", color: "#4cceac" };
      case "en route":
        return { bg: "#6870fa20", color: "#6870fa" };
      case "en attente":
        return { bg: "#f0a50020", color: "#f0a500" };
      case "annulé":
        return { bg: "#db4f4a20", color: "#db4f4a" };
      default:
        return { bg: "#66666620", color: "#666666" };
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

      <DialogTitle>
        Détails de la livraison — {livraison.num_livraison}
      </DialogTitle>

      <DialogContent>
        <Box mt={1}>

          {/* Informations générales */}
          <Typography
            variant="caption"
            sx={{ color: "#4cceac", fontWeight: 600, letterSpacing: 1 }}
          >
            INFORMATIONS GÉNÉRALES
          </Typography>

          <InfoRow label="Numéro de livraison" value={livraison.num_livraison} />
          <Divider sx={{ borderColor: "#1e2a3a" }} />
          <InfoRow label="Date" value={livraison.date} />
          <Divider sx={{ borderColor: "#1e2a3a" }} />

          {/* Affectation */}
          <Typography
            variant="caption"
            sx={{ color: "#4cceac", fontWeight: 600, letterSpacing: 1, mt: 2, display: "block" }}
          >
            AFFECTATION
          </Typography>

          <InfoRow label="Camion" value={livraison.camion} />
          <Divider sx={{ borderColor: "#1e2a3a" }} />
          <InfoRow label="Chauffeur" value={livraison.chauffeur} />
          <Divider sx={{ borderColor: "#1e2a3a" }} />

          {/* Trajet */}
          <Typography
            variant="caption"
            sx={{ color: "#4cceac", fontWeight: 600, letterSpacing: 1, mt: 2, display: "block" }}
          >
            TRAJET
          </Typography>

          <InfoRow label="Ville de départ" value={livraison.depart} />
          <Divider sx={{ borderColor: "#1e2a3a" }} />
          <InfoRow label="Ville de destination" value={livraison.destination} />
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
              backgroundColor: getStatutStyle(livraison.statut).bg,
              color: getStatutStyle(livraison.statut).color,
            }}>
              {livraison.statut}
            </Box>
          </Box>

            {/* Position Actuel */}

            <Typography variant="caption"
                sx={{ color: "#4cceac", fontWeight: 600, letterSpacing: 1, mt: 2, display: "block" }}>
                POSITION ACTUELLE
                </Typography>

                <InfoRow label="Dernière position" value={livraison.position?.label} />
                <InfoRow label="Mise à jour" value={livraison.position?.updatedAt} />

                {/* Lien Google Maps */}
                {/* {livraison.position?.lat && ( */}
                <Box py={1}>
                    <Button
                    size="small"
                    variant="outlined"
                    // Une fois que on aura gps
                    // href={`https://maps.google.com/?q=${livraison.position.lat},${livraison.position.lng}`}
                     href={`https://maps.google.com/?q=6.3654,2.4183`}
                    target="_blank"
                    startIcon={<LocationOnOutlined />}
                    sx={{ color: "#4cceac", borderColor: "#4cceac" }}
                    >
                    Voir sur Google Maps
                    </Button>
                </Box>
                {/* )} */}

          {/* lien  Suivi GPS pour client */}
            <Typography variant="caption"
            sx={{ color: "#4cceac", fontWeight: 600, letterSpacing: 1, mt: 2, display: "block" }}>
            SUIVI EN TEMPS RÉEL
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
            <Typography variant="body2" sx={{ color: "#a0aec0", fontSize: "0.75rem" }}>
                {`https://track.yalau.bj/${livraison.num_livraison}`}
            </Typography>
            <IconButton size="small" onClick={() => navigator.clipboard.writeText(`https://track.yalau.bj/${livraison.num_livraison}`)}>
                <ContentCopyOutlined fontSize="small" sx={{ color: "#4cceac" }} />
            </IconButton>
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

export default ViewLivraisonDialog;