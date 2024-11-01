import { Card, CardHeader, CardFooter, Input, Button, CardBody } from "@nextui-org/react";
import {  useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5050/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Importante para enviar cookies
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="justify-center">
          <h1 className="text-2xl text-center">Login 👋</h1>
        </CardHeader>
        <CardBody className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                label="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                label="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full" type="submit">
                Login
              </Button>
            </CardFooter>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}