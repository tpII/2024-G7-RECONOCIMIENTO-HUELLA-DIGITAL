import UserIcon from "../icons/UserIcon";
import Fingerprint from "../icons/Fingerprint";

export default function Navbar() {
  return (
    <>
      <nav className="m-6 top-0 left-0 right-0">
        <div className="mx-auto w-3/4 rounded-full bg-gray-100/90 backdrop-blur-md shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Sección izquierda: Logo y nombre */}
              <div className="flex-shrink-0 flex items-center">
                <Fingerprint />
                <span className="font-bold text-xl text-gray-800">
                  DigitShield
                </span>
              </div>

              {/* Sección central: Menú */}
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Inicio
                  </a>
                  <span className="text-gray-400 text-base">|</span>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Usuarios registrados
                  </a>
                </div>
              </div>

              {/* Sección derecha: Icono de perfil */}
              <div className="flex-shrink-0">
                <button className="bg-gray-100 p-2 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                  <span className="sr-only">Ver perfil</span>
                  <UserIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
