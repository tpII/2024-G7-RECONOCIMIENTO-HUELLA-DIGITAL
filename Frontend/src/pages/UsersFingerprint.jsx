import { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Link,
} from "@nextui-org/react";
import Plus from "../icons/Plus";
import TableUsersFingerprint from "../components/TableUsersFingerprint";

export default function UsersFingerprint() {

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();


  return (
    <div className="flex flex-col space-y-4 h-full">
      <div className="flex-1 rounded-xl bg-gray-50/80 text-gray-900 shadow overflow-auto mb-10">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-slate-800 via-green-800 to-green-500">
              Usuarios registrados en el Sistema
            </h2>
            <Button
              isIconOnly
              as={Link}
              className="bg-slate-300"
              onClick={onCreateOpen}
            >
              <Plus />
            </Button>
          </div>
          <div className="mt-4">
            <TableUsersFingerprint />
          </div>
        </div>
      </div>

      {/* Modal de Creación */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="3xl">
        <ModalContent>
          {(onClose) => (
            <form>
              <ModalHeader className="flex flex-col gap-1">
                Crear Usuario
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Username"
                  placeholder="Ingrese el nombre de usuario"
                  size="lg"
                />
                <Input
                  label="Email"
                  placeholder="Ingrese el correo electrónico"
                  size="lg"
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Ingrese la contraseña"
                  size="lg"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} size="lg">
                  Cancelar
                </Button>
                <Button color="primary" type="submit" size="lg">
                  Crear
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
