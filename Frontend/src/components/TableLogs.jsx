import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";

export default function TableLogs() {
  const [rows, setRows] = useState([]); // Estado para almacenar los datos de la tabla
  const [usernames, setUsernames] = useState({}); // Estado para almacenar los nombres de usuario por ID

  useEffect(() => {
    // Realizar una solicitud GET a la API de logs
    fetch("http://localhost:5050/logs")
      .then((response) => response.json()) // Suponiendo que la respuesta es JSON
      .then((data) => {
        setRows(data); // Actualiza el estado con los datos recibidos

        // Extraer los IDs únicos
        const uniqueIds = [
          ...new Set(data.map((item) => item.idUserFingerprint)),
        ];

        // Crear un mapeo inicial para IDs -1 con nombre "NN"
        const initialNameMap = {};
        uniqueIds.forEach((id) => {
          if (id === '-1') {
            initialNameMap[id] = "NN";
          }
        });

        // Filtrar IDs válidos (excluir -1)
        const validIds = uniqueIds.filter((id) => id !== '-1');
        // Crear solicitudes para obtener los nombres de usuario
        const fetchNames = validIds.map(
          (id) =>
            fetch(`http://localhost:5050/usersFingerprint/getName/${id}`)
              .then((response) => response.text()) // Parsear como texto porque la API devuelve un string
              .then((username) => ({ id, name: username })) // Asociar el ID con el nombre de usuario
        );

        // Ejecutar todas las solicitudes y combinar los resultados con el mapeo inicial
        Promise.all(fetchNames)
          .then((results) => {
            const nameMap = { ...initialNameMap };
            results.forEach(({ id, name }) => {
              nameMap[id] = name;
            });
            setUsernames(nameMap); // Guarda el mapeo de nombres en el estado
          })
          .catch((error) => console.error("Error fetching usernames:", error));
      })
      .catch((error) => console.error("Error fetching logs:", error)); // Manejo de errores
  }, []); // El array vacío asegura que solo se ejecute al montar el componente

  const columns = [
    {
      key: "success",
      label: "STATUS",
    },
    {
      key: "timestamp",
      label: "TIMESTAMP",
    },
    {
      key: "idUserFingerprint",
      label: "USERNAME",
    },
  ];

  return (
    <>
      <Table
        aria-label="Example table with dynamic content"
        classNames={{
          base: "bg-green-700/85 rounded-lg mt-6",
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
        <TableBody items={rows}>
          {(item) => {
            const isAuthorized = item.success; // `success` es el valor que determina el color
            const username = usernames[item.idUserFingerprint] || "Cargando..."; // Obtener el nombre del estado o mostrar "Cargando..."

            return (
              <TableRow
                key={item._id}
                className={`${
                  isAuthorized ? "bg-green-700/85" : "bg-red-700/85"
                }`}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className="text-white">
                    {column.key === "success"
                      ? isAuthorized
                        ? "Autorizado"
                        : "No autorizado"
                      : column.key === "idUserFingerprint"
                      ? username // Mostrar el nombre del usuario
                      : getKeyValue(item, column.key)}
                  </TableCell>
                ))}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </>
  );
}
