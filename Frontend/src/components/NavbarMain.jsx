import { useState, useEffect } from "react";
import Fingerprint from "../icons/Fingerprint";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarMenuItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function NavbarMain({ userData }) {
  const [error, setError] = useState("");
  const [isPushEnabled, setIsPushEnabled] = useState(false); // Nuevo estado para rastrear notificaciones
  const navigate = useNavigate();

  // Chequear si las notificaciones ya están habilitadas al cargar el componente
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsPushEnabled(!!subscription); // Si hay una suscripción, las notificaciones están activadas
        });
      });
    }
  }, []);

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

  const enablePushNotifications = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BJcOL27Rzi1QTsAfjwmbKlkxa7dz3JHHWLFAwguOReRI_M9E0jA0ZEbWL9WyL4g-2mjezA_AwXmb0M62GQCF4m4"
        ),
      });

      const response = await fetch("http://localhost:5050/webPush/subscribe/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      setIsPushEnabled(true); // Actualizar el estado
      alert("Push notifications enabled");
    } catch (error) {
      setError(error.message);
    }
  };

  const disablePushNotifications = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        const response = await fetch(
          "http://localhost:5050/webPush/unsubscribe/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(subscription),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Something went wrong");
        }
      }

      setIsPushEnabled(false); // Actualizar el estado
      alert("Push notifications disabled");
    } catch (error) {
      setError(error.message);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = ["Inicio", "Usuarios registrados", "Log Out"];

  return (
    <div className="w-full flex justify-center mx-auto">
      <div className="max-w-7xl w-full m-4">
        <Navbar
          onMenuOpenChange={setIsMenuOpen}
          className="rounded-full bg-gray-200/90"
        >
          <NavbarContent>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="sm:hidden text-slate-900"
            />
            <NavbarBrand>
              <Fingerprint />
              <p className=" ml-1 font-bold text-xl text-slate-900">
                DigitShield
              </p>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
              <Link href="/" className="text-slate-900">
                Inicio
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/usersFingerprint" className="text-slate-900">
                Usuarios registrados
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent as="div" justify="end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  color="foreground"
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  textValue={userData.user.email}
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{userData.user.email}</p>
                </DropdownItem>

                <DropdownItem
                  key="push"
                  color={isPushEnabled ? "warning" : "success"}
                  onClick={
                    isPushEnabled
                      ? disablePushNotifications
                      : enablePushNotifications
                  }
                >
                  {isPushEnabled
                    ? "Disable Push Notifications"
                    : "Enable Push Notifications"}
                </DropdownItem>

                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={handleSubmit}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
          <NavbarMenu className="mt-4 max-h-fit max-w-[75%] mx-auto p-6">
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link className="w-full" href="#" size="lg" color="foreground">
                  {item}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </Navbar>
      </div>
    </div>
  );
}
