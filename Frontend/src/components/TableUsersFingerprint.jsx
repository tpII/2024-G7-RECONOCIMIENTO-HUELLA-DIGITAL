import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import EditIcon from "../icons/Edit";
import DeleteIcon from "../icons/Delete";

export default function TableUsersFingerprint() {
  const [usersFingerprint, setUsersFingerprint] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchUsersFingerprint = async () => {
      try {
        const response = await fetch("http://localhost:5050/usersFingerprint/");
        const data = await response.json();
        setUsersFingerprint(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsersFingerprint();
  }, []);

  const columns = [
    { key: "username", label: "Username" },
    { key: "idFingerprint", label: "ID Fingerprint" },
    { key: "actions", label: "Actions" },
  ];

  const handleEdit = (user) => {
    setSelectedUser(user);
    onEditOpen();
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5050/usersFingerprint/startDelete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idFingerprint: selectedUser.idFingerprint }),
        }
      );
      if (response.ok) {
        setUsersFingerprint((prevUsers) =>
          prevUsers.filter((user) => user._id !== selectedUser._id)
        );
        onDeleteClose();
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    console.log("Save changes:", selectedUser);
    onEditClose();
  };
  return (
    <>
      <Table
        aria-label="Tabla de usuarios con acceso al sistema de administración web"
        classNames={{
          base: "bg-green-700/85 rounded-lg w-full",
          wrapper: "p-4 relative overflow-auto",
          table: "rounded-lg",
          th: "p-2 text-center text-lg font-semibold text-white bg-slate-900",
          td: "p-2 text-center text-md text-white",
        }}
        removeWrapper
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn align="center" key={column.key} className="text-white">
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={usersFingerprint}>
          {(user) => (
            <TableRow key={user._id}>
              {columns.map((column) => (
                <TableCell key={column.key} className="text-white">
                  {column.key === "actions" ? (
                    <div className="flex justify-center space-x-2">
                      <Button
                        onClick={() => handleEdit(user)}
                        isIconOnly
                        className="bg-transparent"
                        aria-label={`Editar usuario ${user.username}`}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        onClick={() => handleDelete(user)}
                        isIconOnly
                        className="bg-transparent"
                        aria-label={`Borrar usuario ${user.username}`}
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  ) : (
                    user[column.key]
                  )}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal de Edición */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSave}>
              <ModalHeader className="flex flex-col gap-1">
                Editar Usuario
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Username"
                  value={selectedUser?.username}
                  onChange={(e) =>
                    setSelectedUser((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" type="submit">
                  Guardar
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* Modal de Confirmación de Borrado */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        size="md"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmar Borrado
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que quieres borrar al usuario{" "}
                  {selectedUser?.username}?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="danger" onPress={confirmDelete}>
                  Borrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
