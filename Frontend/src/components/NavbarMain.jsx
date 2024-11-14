/* eslint-disable react/prop-types */
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NavbarMain({userData}) {
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = ["Inicio", "Usuarios registrados", "Log Out"];

  return (
    <div className="w-full flex justify-center mx-auto">
      <div className="max-w-7xl w-full m-4">
        <Navbar onMenuOpenChange={setIsMenuOpen} className="rounded-full bg-gray-200/90">
          <NavbarContent>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="sm:hidden text-slate-900"
            />
            <NavbarBrand>
              <Fingerprint />
              <p className=" ml-1 font-bold text-xl text-slate-900">DigitShield</p>
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
                <DropdownItem key="profile" className="h-14 gap-2" textValue={userData.user.email}>
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{userData.user.email}</p>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={handleSubmit}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
          <NavbarMenu className="mt-4 max-h-fit max-w-[75%] mx-auto p-6">
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="w-full"
                  href="#"
                  size="lg"
                  color="foreground"
                >
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
