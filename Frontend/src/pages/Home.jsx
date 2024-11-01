import Navbar from "../components/Navbar.jsx";

export default function Home() {
  return (
<div className="md:overflow-hidden overflow-auto absolute top-0 left-0 h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Navbar />
      <main className="pt-6 px-6 md:h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="mx-auto max-w-[83rem] w-full">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 h-full">
            <div className="flex-1 rounded-lg border bg-gray-100/90 text-gray-900 shadow md:max-h-[calc(100vh-8rem)] overflow-auto">
              <div className="p-6">
                <h2 className="text-2xl font-semibold">Accesos de personas</h2>
                <div className="mt-4">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officiis eum illum, aliquid quas officia repellat, iste eaque sunt reprehenderit ipsa quidem distinctio deleniti dolorem reiciendis dignissimos id commodi possimus optio?
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Non incidunt eius reiciendis quidem pariatur cupiditate architecto sint ea dolorem recusandae libero, assumenda eligendi modi dolorum nihil nemo voluptatibus excepturi amet!
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem blanditiis error in odit incidunt dignissimos dolorem nam non, animi vitae nemo! Odit rerum consequuntur incidunt neque fugiat temporibus repudiandae voluptate.
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam tempore, harum soluta laudantium maiores alias, officiis ex vel ipsa id consequuntur asperiores in provident, animi incidunt deleniti facilis consequatur cupiditate.
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor, ratione eos placeat voluptatibus error dolorum ullam excepturi ducimus, omnis repellendus soluta quaerat deleniti quasi quisquam dolore consequuntur cumque dignissimos reiciendis!
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa commodi nam magnam nisi. Numquam neque nostrum corrupti aperiam distinctio laboriosam perspiciatis natus, non molestiae facilis, debitis vel magnam nemo veniam!
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum, hic assumenda tenetur maiores, esse magnam, dicta optio voluptatum non nam illum cumque eum dolor eaque amet quas repellendus harum iure.
                  <p>
                    Aquí va el contenido para la sección de accesos de personas.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[38%] rounded-lg border bg-gray-100/90 text-gray-900 shadow md:max-h-[calc(100vh-8rem)] overflow-auto">
              <div className="p-6">
                <h2 className="text-2xl font-semibold">Usuarios autorizados</h2>
                <div className="mt-4">
                  {/* Content for usuarios autorizados */}
                  <p>
                    Aquí va el contenido para la sección de usuarios autorizados.
                  </p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, quibusdam. Dolore, repellendus quo! Quas natus eum repellat, eos maiores, accusamus, quod dolorem consequatur amet aspernatur voluptatem labore! Quisquam, nemo repellat.
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, quibusdam. Dolore, repellendus quo! Quas natus eum repellat, eos maiores, accusamus, quod dolorem consequatur amet aspernatur voluptatem labore! Quisquam, nemo repellat.
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, quibusdam. Dolore, repellendus quo! Quas natus eum repellat, eos maiores, accusamus, quod dolorem consequatur amet aspernatur voluptatem labore! Quisquam, nemo repellat.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}