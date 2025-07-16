import { Box, Input } from '@mui/joy';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


function Login() {


    //password input state
    const [passwordinput, setpasswordinput] = useState("");
    //navigator object
    const navigate = useNavigate();
    //alert for wrong password
    const [alert, setalert] = useState(false);
    //add a md5 hash later b179a8cb8ecdc798e5533f3bdeca3df7
    function submit() {
        if (passwordinput == "login") {
            navigate("/home");
        } else {
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
                    p: 2,
                }}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        //Login Function
                        submit();
                    }}
                    style={{
                        height: "auto",
                        width: "90%",
                        maxWidth: "400px",
                        minWidth: "300px",
                        padding: "2rem",
                        borderRadius: "20px",
                        backgroundColor: "white",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1.5rem",
                    }}
                >
                    <Box
                        sx={{
                            textAlign: "center",
                            width: "100%",
                            borderBottom: "1px solid #ccc",
                            paddingBottom: "1rem",
                        }}
                    >
                        <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                            Rechnix
                        </p>
                        <p style={{ margin: 0, fontSize: "0.95rem", color: "#666" }}>
                            Bitte Passwort eingeben
                        </p>
                    </Box>
                    <Input
                        type="password"
                        placeholder="Passwort"
                        variant="outlined"
                        value={passwordinput}
                        onChange={(e) => { setpasswordinput(e.target.value) }}
                        sx={{ width: "100%" }}
                    />
                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "0.75rem 1.5rem",
                            fontSize: "1rem",
                            cursor: "pointer",
                            width: "100%",
                        }}
                    >
                        Einloggen
                    </button>
                </form>
            </Box>
        </>
    )
}

export default Login
