import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErreur("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // adapte selon ta route principale
    } catch (error) {
      setErreur("Email ou mot de passe incorrect");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100vh", gap: 2 }}
    >
      <Typography variant="h3">YALAU Fleet — Connexion</Typography>

      {erreur && <Alert severity="error">{erreur}</Alert>}

      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ width: 300 }}
      />
      <TextField
        label="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ width: 300 }}
      />
      <Button variant="contained" onClick={handleLogin} sx={{ width: 300 }}>
        Se connecter
      </Button>
    </Box>
  );
}

export default Login;