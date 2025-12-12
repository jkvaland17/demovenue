// TableComponent.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableRow,
  TableCell,
} from "@nextui-org/table";

interface TableComponentProps {
  columns: { name: string; uid: string }[];
  items: any[];
}

const TableComponent: React.FC<TableComponentProps> = ({ columns, items }) => {
  return (
    <Table>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.name}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.id as number}>
            {Object.entries(item).map(([key, value]) => (
              <TableCell key={key}>
                {key === "actions" ? (
                  <button>Actions</button>
                ) : (
                  (value as string | React.ReactNode)
                )}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
