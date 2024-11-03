import "./App.css";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useHref,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./Layout.jsx";
import { NextUIProvider } from "@nextui-org/react";
import UsersFingerprint from "./pages/UsersFingerprint.jsx";

export default function App() {
  const [userCount, setUserCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <NextUIProvider navigate={navigate} useHref={useHref}>
      <Routes>
        {userCount === 0 ? (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/signup" />} />
          </>
        ) : (
          <>
            <Route path="/signup" element={<Navigate to="/" />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/usersFingerprint"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UsersFingerprint />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </>
        )}
      </Routes>
    </NextUIProvider>
  );
}
