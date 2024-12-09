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
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Estado para verificar si los datos están cargados

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Realizar una solicitud GET a la API de logs
        const response = await fetch("http://localhost:5050/logs");
        const data = await response.json();

        // Ordenar los datos por timestamp en orden descendente
        const sortedData = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setRows(sortedData); // Actualiza el estado con los datos ordenados
        setIsDataLoaded(true); // Indicar que los datos se han cargado
      } catch (error) {
        console.error("Error fetching logs:", error); // Manejo de errores
      }
    };

    fetchData(); // Llamar la función asincrónica
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
      key: "username",
      label: "USERNAME",
    },
  ];

  if (!isDataLoaded) {
    return <div>Cargando...</div>; // Mostrar un mensaje mientras se cargan los datos
  }

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

            // Convertir timestamp a UTC-3
            const timestampUTC3 = new Date(item.timestamp).toLocaleString(
              "es-AR",
              {
                timeZone: "America/Argentina/Buenos_Aires",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }
            );

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
                      : column.key === "timestamp"
                      ? timestampUTC3 // Mostrar el timestamp convertido
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