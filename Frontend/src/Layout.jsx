/* eslint-disable react/prop-types */
import NavbarMain from "./components/NavbarMain";
import React from "react";

export default function Layout({ children, userData }) {
  return (
    <div className="md:overflow-hidden overflow-auto absolute top-0 left-0 h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500 via-gray-800 to-black">
      <NavbarMain userData={userData}/>
      <main className="pt-6 px-6 md:h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="mx-auto max-w-[90rem] w-full">
          {React.cloneElement(children, { userData })}
        </div>
      </main>
    </div>
  );
}
