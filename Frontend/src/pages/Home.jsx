import Navbar from "../components/Navbar.jsx";

export default function Home() {
  return (
    <div className="overflow-hidden absolute top-0 left-0 h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Navbar />
      <main className="pt-6 px-6">
        <div className="mx-auto max-w-[83rem]">
          <div className="flex space-x-8">
            <div className="flex-1 rounded-lg border bg-gray-100/90 text-gray-900 shadow">
              <div className="p-6">
                <h2 className="text-2xl font-semibold">Accesos de personas</h2>
                <div className="mt-4">
                  {/* Content for accesos de personas */}
                  <p>
                    Aquí va el contenido para la sección de accesos de personas.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-[38%] rounded-lg border bg-gray-100/90 text-gray-900 shadow">
              <div className="p-6">
                <h2 className="text-2xl font-semibold">Usuarios autorizados</h2>
                <div className="mt-4">
                  {/* Content for usuarios autorizados */}
                  <p>
                    Aquí va el contenido para la sección de usuarios
                    autorizados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
