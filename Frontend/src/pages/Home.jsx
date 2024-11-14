import Plus from "../icons/Plus.jsx";
import { Link, Button } from "@nextui-org/react";
import TableUsers from "../components/TableUsers.jsx";
import TableLogs from "../components/TableLogs.jsx";
import { useDisclosure } from "@nextui-org/react";

export default function Home() {
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 h-full">
      <div className="flex-1 rounded-xl bg-gray-50/80 text-gray-900 shadow md:max-h-[calc(100vh-8rem)] overflow-auto mb-10">
        <div className="p-6">
          <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-slate-800 via-green-800 to-green-500">
            Accesos de personas
          </h2>
          <div className="mt-4">
            <TableLogs />
          </div>
        </div>
      </div>

      <div className="w-full md:w-[38%] rounded-lg bg-gray-50/80 text-gray-900 shadow md:max-h-[calc(100vh-8rem)] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-slate-800 via-green-800 to-green-500">
              Usuarios autorizados
            </h2>
            <Button isIconOnly as={Link} className="bg-slate-300" onClick={onCreateOpen}>
              <Plus />
            </Button>
          </div>
          <div className="mt-4">
            <TableUsers isCreateOpen={isCreateOpen} onCreateClose={onCreateClose} />
          </div>
        </div>
      </div>
    </div>
  );
}