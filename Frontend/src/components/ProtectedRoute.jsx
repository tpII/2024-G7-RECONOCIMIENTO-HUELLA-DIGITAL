/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/auth/check-auth", {
          method: "GET",
          credentials: "include", // Importante para enviar cookies
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUserData(data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // O cualquier indicador de carga
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {React.cloneElement(children, { userData })}
    </>
  );
}