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

  useEffect(() => {
    // Realizar una solicitud GET a la API local
    fetch("http://localhost:5050/logs")
      .then((response) => response.json()) // Suponiendo que la respuesta es JSON
      .then((data) => setRows(data)) // Actualiza el estado con los datos recibidos
      .catch((error) => console.error("Error fetching data:", error)); // Manejo de errores
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
      label: "USER FINGERPRINT ID",
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
