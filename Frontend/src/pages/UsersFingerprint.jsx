import { useState } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Link } from "@nextui-org/react";
import Plus from "../icons/Plus";
import TableUsersFingerprint from "../components/TableUsersFingerprint";

export default function UsersFingerprint() {
  const [username, setUsername] = useState('');
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5050/usersFingerprint/startRegistration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Registration started:", data);
        onCreateClose();
      } else {
        console.error("Failed to start registration");
      }
    } catch (error) {
      console.error("Error starting registration:", error);
    }
  };

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
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleCreate}>
              <ModalHeader className="flex flex-col gap-1">
                Crear Usuario
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese el nombre de usuario"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" type="submit">
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