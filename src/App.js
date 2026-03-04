import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Shell/Layout';
import Dashboard from './pages/Dashboard';
import Login from "./pages/Login.jsx";


import KundenVerwaltung from './components/Tabs/KundenVerwaltung';
import ProdukteVerwalten from './components/Tabs/ProdukteVerwalten';
import Unternehmen from './components/Tabs/Unternehmen';
import RechnungenVerwalten from './components/Tabs/RechnungenVerwalten';
import RechnungsViewerTab from './components/Tabs/RechnungsViewerTab';
import RechnungErstellen from './components/Tabs/RechnungErstellen';
import LieferantenVerwaltung from './components/Tabs/LieferantenVerwaltung';
import AusgabenVerwaltung from './components/Tabs/AusgabenVerwaltung';
import Statistiken from './components/Tabs/Statistiken';
import Mahnungen from './components/Tabs/Mahnungen';
import Datensicherung from './components/Tabs/Datensicherung';


import KundenViewer from "./viewer/KundenViewer.jsx";
import LieferantenViewer from "./viewer/LieferantenViewer.jsx";
import FileViewer from "./viewer/FileViewer.jsx";
import AusgabenViewer from "./viewer/AusgabenViewer.jsx";

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />


          <Route path="/" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />


          <Route path="/invoices" element={
            <Layout>
              <RechnungenVerwalten />
            </Layout>
          } />


          <Route path="/invoices/:id" element={
            <Layout>
              <RechnungenVerwalten />
            </Layout>
          } />


          <Route path="/invoices/create" element={
            <Layout>
              <RechnungErstellen />
            </Layout>
          } />
          <Route path="/invoices/create/:userId" element={
            <Layout>
              <RechnungErstellen />
            </Layout>
          } />


          <Route path="/mahnungen" element={
            <Layout>
              <Mahnungen />
            </Layout>
          } />


          <Route path="/clients" element={
            <Layout>
              <KundenVerwaltung />
            </Layout>
          } />


          <Route path="/products" element={
            <Layout>
              <ProdukteVerwalten />
            </Layout>
          } />


          <Route path="/settings" element={
            <Layout>
              <Unternehmen />
            </Layout>
          } />


          <Route path="/backup" element={
            <Layout>
              <Datensicherung />
            </Layout>
          } />


          <Route path="/suppliers" element={
            <Layout>
              <LieferantenVerwaltung />
            </Layout>
          } />


          <Route path="/expenses" element={
            <Layout>
              <AusgabenVerwaltung />
            </Layout>
          } />


          <Route path="/statistics" element={
            <Layout>
              <Statistiken />
            </Layout>
          } />


          <Route path="/kunden-viewer/:id" element={<KundenViewer />} />
          <Route path="/lieferanten-viewer/:id" element={<LieferantenViewer />} />
          <Route path="/view-file/:item/:kundenid" element={<FileViewer />} />
          <Route path="/ausgaben-viewer/:id" element={<AusgabenViewer />} />


          <Route path="/reload" element={<Layout><Dashboard /></Layout>} />

        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
