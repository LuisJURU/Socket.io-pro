import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Admin from "./pages/Admin";
import Client from "./pages/Client";


function App() {
    return (
        <Router>
            <nav>
                <Link to="/admin">Administrador</Link>
                <Link to="/client">Cliente</Link>
            </nav>
            <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/client" element={<Client />} />
            </Routes>
        </Router>
    );
}

export default App;
