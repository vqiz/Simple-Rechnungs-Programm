import {
  Box,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  Card,
  Button
} from '@mui/joy';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Key } from '../Scripts/Cryptor';
function Login() {
  const [passwordinput, setpasswordinput] = useState("");
  const navigate = useNavigate();
  const [alert, setalert] = useState(false);

  function submit() {
    if (passwordinput === "login") {
      Key.set("login");
      navigate("/home");
    } else {
      console.log("falsches passwort");
      setalert(true);
    }
  }

  return (
    <>
      <header>
        <title>Rechnix</title>
      </header>

      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "neutral.100",
          p: 2,
        }}
      >
        {alert && (
          <Modal open onClose={() => setalert(false)}>
            <ModalDialog variant="soft">
              <ModalClose />
              <Typography startDecorator={<WarningAmberIcon/>} level="h5" fontWeight="lg">
                Falsches Passwort
              </Typography>
              <Typography level="body-md">
                Bitte versuchen Sie es erneut.
              </Typography>
            </ModalDialog>
          </Modal>
        )}

        <Card
          variant="outlined"
          sx={{
            p: 3,
            width: "100%",
            maxWidth: 400,
            boxShadow: "lg",
            borderRadius: "lg",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Typography level="h4" fontWeight="lg">
              Rechnix
            </Typography>
            <Typography level="body-sm" color="neutral">
              Bitte Passwort eingeben
            </Typography>
          </Box>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <Input
              type="password"
              placeholder="Passwort"
              variant="soft"
              value={passwordinput}
              onChange={(e) => setpasswordinput(e.target.value)}
              sx={{ width: "100%" }}
            />
            <Button
              type="submit"
              color="primary"
              variant="solid"
              sx={{ py: 1.5 }}
            >
              Einloggen
            </Button>
          </form>
        </Card>
      </Box>
    </>
  );
}

export default Login;