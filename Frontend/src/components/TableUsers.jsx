/* eslint-disable react/prop-types */
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

export default function TableUsers({ isCreateOpen, onCreateClose }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });
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
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/auth/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
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

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5050/api/auth/users/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedUser),
        }
      );
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
        onEditClose();
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
    console.log("Save changes:", selectedUser);
    onEditClose();
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5050/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const createdUser = await response.json();
        setUsers((prevUsers) => [...prevUsers, createdUser]);
        setNewUser({ username: "", email: "", password: "" });
        onCreateClose();
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5050/api/auth/users/${selectedUser._id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setUsers((prevUsers) =>
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
        <TableBody items={users}>
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
                <Input
                  label="Email"
                  type="email"
                  value={selectedUser?.email}
                  onChange={(e) =>
                    setSelectedUser((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Nueva contraseña"
                  onChange={(e) =>
                    setSelectedUser((prev) => ({
                      ...prev,
                      password: e.target.value,
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
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                />
                <Input
                  label="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Contraseña"
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
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
