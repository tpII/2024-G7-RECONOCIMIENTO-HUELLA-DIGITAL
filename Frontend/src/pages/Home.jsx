import Navbar from "../components/Navbar.jsx";

export default function Home() {
  return (
    <div className="overflow-hidden absolute top-0 left-0 h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Navbar />
      <div className=" flex justify-center items-center h-full">
        <div className="flex space-x-4 w-full max-w-5xl">
          <div className="flex-2 rounded-lg border bg-card text-card-foreground shadow flex-grow">
            <div className="p-6">
              <h2 className="text-2xl font-semibold">Accesos de personas</h2>
              <div className="mt-4">
                {/* Content for accesos de personas */}
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-lg border bg-card text-card-foreground shadow flex-grow-0">
            <div className="p-6">
              <h2 className="text-2xl font-semibold">Usuarios autorizados</h2>
              <div className="mt-4">
                {/* Content for usuarios autorizados */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}