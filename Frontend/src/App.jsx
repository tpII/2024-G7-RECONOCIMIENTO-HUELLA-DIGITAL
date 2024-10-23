import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Home from "./Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const [userCount, setUserCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:5050/api/auth/user-count"
        );
        const data = await response.json();
        setUserCount(data.userCount);
      } catch (error) {
        console.error("Error checking user count:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserCount();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // O cualquier indicador de carga
  }

  return (
    <Router>
      <Routes>
        {userCount === 0 ? (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/signup" />} />
          </>
        ) : (
          <>
          <Route path="/signup" element={<Navigate to="/" />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
