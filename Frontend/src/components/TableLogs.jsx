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
  const rows = [
    {
      key: "1",
      name: "Tony Reichert",
      role: "CEO",
      status: "Active",
    },
    {
      key: "2",
      name: "Zoey Lang",
      role: "Technical Lead",
      status: "Paused",
    },
    {
      key: "3",
      name: "Jane Fisher",
      role: "Senior Developer",
      status: "Active",
    },
    {
      key: "4",
      name: "William Howard",
      role: "Community Manager",
      status: "Vacation",
    },
    {
      key: "5",
      name: "Tony Reichert",
      role: "CEO",
      status: "Active",
    },
    {
      key: "6",
      name: "Zoey Lang",
      role: "Technical Lead",
      status: "Paused",
    },
    {
      key: "7",
      name: "Jane Fisher",
      role: "Senior Developer",
      status: "Active",
    },
    {
      key: "8",
      name: "William Howard",
      role: "Community Manager",
      status: "Vacation",
    },
    {
      key: "9",
      name: "Tony Reichert",
      role: "CEO",
      status: "Active",
    },
    {
      key: "10",
      name: "Zoey Lang",
      role: "Technical Lead",
      status: "Paused",
    },
    {
      key: "11",
      name: "Jane Fisher",
      role: "Senior Developer",
      status: "Active",
    },
    {
      key: "12",
      name: "William Howard",
      role: "Community Manager",
      status: "Vacation",
    },
    {
      key: "13",
      name: "Tony Reichert",
      role: "CEO",
      status: "Active",
    },
    {
      key: "14",
      name: "Zoey Lang",
      role: "Technical Lead",
      status: "Paused",
    },
    {
      key: "15",
      name: "Jane Fisher",
      role: "Senior Developer",
      status: "Active",
    },
    {
      key: "16",
      name: "William Howard",
      role: "Community Manager",
      status: "Vacation",
    },
    {
      key: "17",
      name: "Tony Reichert",
      role: "CEO",
      status: "Active",
    },
    {
      key: "18",
      name: "Zoey Lang",
      role: "Technical Lead",
      status: "Paused",
    },
    {
      key: "19",
      name: "Jane Fisher",
      role: "Senior Developer",
      status: "Active",
    },
    {
      key: "20",
      name: "William Howard",
      role: "Community Manager",
      status: "Vacation",
    },
  ];

  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "role",
      label: "ROLE",
    },
    {
      key: "status",
      label: "STATUS",
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
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell className="text-white">
                  {getKeyValue(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
