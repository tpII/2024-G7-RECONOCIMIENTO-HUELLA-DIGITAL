import { useNavigate } from "react-router-dom";
import { useState } from "react"; 


export default function Home() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5050/api/auth/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100 dark:bg-gray-900">
        <p>Hola</p>

        {/* button logout */}
        <button onClick={handleSubmit}>Logout</button>
      </div>
  )
}