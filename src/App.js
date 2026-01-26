import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Shell/Layout';
import Dashboard from './pages/Dashboard';
import Login from "./pages/Login.jsx";

// Import legacy components to use in new routes
import KundenVerwaltung from './components/Tabs/KundenVerwaltung';
import ProdukteVerwalten from './components/Tabs/ProdukteVerwalten';
import Unternehmen from './components/Tabs/Unternehmen';
import RechnungsViewerTab from './components/Tabs/RechnungsViewerTab';
import RechnungErstellen from './components/Tabs/RechnungErstellen';
import LieferantenVerwaltung from './components/Tabs/LieferantenVerwaltung';

// Keep old viewers for specific item views (might need adjustment to work within Layout or standalone)
import KundenViewer from "./viewer/KundenViewer.jsx";
import LieferantenViewer from "./viewer/LieferantenViewer.jsx";
import FileViewer from "./viewer/FileViewer.jsx";

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Wrapper for main application routes */}
          <Route path="/" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />

          {/* Invoices List */}
          <Route path="/invoices" element={
            <Layout>
              <RechnungsViewerTab />
            </Layout>
          } />

          {/* Invoice Creation - Optional new route or sub-route */}
          <Route path="/invoices/create" element={
            <Layout>
              <RechnungErstellen />
            </Layout>
          } />

          {/* Clients */}
          <Route path="/clients" element={
            <Layout>
              <KundenVerwaltung />
            </Layout>
          } />

          {/* Products */}
          <Route path="/products" element={
            <Layout>
              <ProdukteVerwalten />
            </Layout>
          } />

          {/* Settings */}
          <Route path="/settings" element={
            <Layout>
              <Unternehmen />
            </Layout>
          } />

          {/* Suppliers (Lieferanten) - Adding route for completeness */}
          <Route path="/suppliers" element={
            <Layout>
              <LieferantenVerwaltung />
            </Layout>
          } />

          {/* Legacy Routes - Specific Viewers */}
          {/* These might need to be wrapped in Layout if you want sidebar there too, 
              but for now keeping them as standalone or matching original behavior */}
          <Route path="/kunden-viewer/:id" element={<KundenViewer />} />
          <Route path="/lieferanten-viewer/:id" element={<LieferantenViewer />} />
          <Route path="/view-file/:item/:kundenid" element={<FileViewer />} />

          {/* Fallback for reloading / redirects */}
          <Route path="/reload" element={<Layout><Dashboard /></Layout>} />

        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
