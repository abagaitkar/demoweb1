import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

const App = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/dashboard";

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        {showNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Login />} />
          {/* Protected Dashboard Route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
