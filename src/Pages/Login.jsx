import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [erreur, setErreur] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    setErreur("")
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setErreur(data.error || "Email ou mot de passe incorrect")
        return
      }

      localStorage.setItem("token", data.token)
      navigate("/")
    } catch (err) {
      setErreur("Erreur de connexion au serveur")
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100vh", gap: 2 }}
    >
      <Typography variant="h3">YALAU Fleet</Typography>
      <Typography variant="body1" sx={{ color: "#a0aec0", mb: 2 }}>
        Connectez-vous pour accéder au tableau de bord
      </Typography>

      {erreur && <Alert severity="error" sx={{ width: 300 }}>{erreur}</Alert>}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ width: 300 }}
        size="small"
      />
      <TextField
        label="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ width: 300 }}
        size="small"
        onKeyPress={(e) => e.key === "Enter" && handleLogin()}
      />
      <Button
        variant="contained"
        onClick={handleLogin}
        sx={{ width: 300 }}
      >
        Se connecter
      </Button>
    </Box>
  )
}

export default Login