import { Box, Input } from "@mui/joy";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login  from "./pages/Login.jsx";

import "./App.css";
import Home from "./pages/Home.jsx";
import KundenViewer from "./viewer/KundenViewer.jsx";
import RechnungsViewer from "./viewer/RechnungsViewer.jsx";
import LieferantenViewer from "./viewer/LieferantenViewer.jsx";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home/:selected/:selectedUserRechnung" element={<Home />} />
        <Route path="/kunden-viewer/:id" element={<KundenViewer />}/>
        <Route path="/lieferanten-viewer/:id" element={<LieferantenViewer/>}/>
      </Routes>
    </Router>
  );
}

export default App;
