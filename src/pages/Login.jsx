import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key } from '../Scripts/Cryptor';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

function Login() {
  const [passwordinput, setpasswordinput] = useState("");
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();

  function submit(e) {
    if (e) e.preventDefault();

    if (passwordinput === "login") { // Simple password check from original code
      Key.set("login");
      navigate("/"); // Navigate to new Dashboard
    } else {
      console.log("falsches passwort");
      setAlert(true);
    }
  }

  return (
    <div className="swiss-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--swiss-gray-50)', height: '100vh', width: '100vw' }}>
      <div className="swiss-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', mb: '32px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Rechnix</h1>
          <p style={{ color: 'var(--swiss-gray-500)', fontSize: '14px' }}>Bitte melden Sie sich an</p>
        </div>

        {alert && (
          <div style={{
            backgroundColor: '#ff3b3015',
            color: '#ff3b30',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <WarningAmberIcon style={{ marginRight: '8px', fontSize: '20px' }} />
            Falsches Passwort
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500 }}>Passwort</label>
            <input
              type="password"
              value={passwordinput}
              onChange={(e) => { setpasswordinput(e.target.value); setAlert(false); }}
              placeholder="Passwort eingeben"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--swiss-gray-200)',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--swiss-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--swiss-gray-200)'}
            />
          </div>

          <button
            type="submit"
            className="swiss-btn swiss-btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            Anmelden
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;