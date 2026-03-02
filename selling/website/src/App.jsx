import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Documentation from "./pages/Documentation"
import "./index.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<Documentation />} />
        {/* We can add deeper /docs/* routes as needed */}
      </Routes>
    </Router>
  )
}

export default App
