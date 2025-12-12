import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import moment from "moment";
import React, { useState } from "react";

type Props = {
  columnsArray: { title: string; key: string }[];
  rowsArray: any[];
};

const DpcModalTable: React.FC<Props> = ({ columnsArray, rowsArray }) => {
  const [columns, setColumns] = useState<{ title: string; key: string }[]>(
    columnsArray ?? [],
  );
  const [rows, setRows] = useState<any[]>(rowsArray ?? []);

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "fromYear":
        return <p>{cellValue ? moment(cellValue).format("DD-MM-YYYY") : "-"}</p>;
      case "toYear":
        return <p>{cellValue ? moment(cellValue).format("DD-MM-YYYY") : "-"}</p>;
        case "dateOfChargeSheet":
          return (
            <p>
              {item?.departmentalProceedings?.dateOfChargeSheet ? moment(
                item?.departmentalProceedings?.dateOfChargeSheet,
              ).format("DD-MM-YYYY"):"-"}
            </p>
          );
      case "dateOfIntimation":
        return (
          <p>
            {item?.unsatisfactoryAdverseRemarks?.dateOfIntimation ? moment(
              item?.unsatisfactoryAdverseRemarks?.dateOfIntimation,
            ).format("DD-MM-YYYY"):"-"}
          </p>
        );
      case "dateOfReceipt":
        return (
          <p>
            {item?.unsatisfactoryAdverseRemarks?.dateOfReceiptOfAppeal ? moment(
              item?.unsatisfactoryAdverseRemarks?.dateOfReceiptOfAppeal,
            ).format("DD-MM-YYYY"): "-"}
          </p>
        );
      case "dateOfDisposal":
        return (
          <p>
            {item?.unsatisfactoryAdverseRemarks?.dateOfDisposalWithResult ? moment(
              item?.unsatisfactoryAdverseRemarks?.dateOfDisposalWithResult,
            ).format("DD-MM-YYYY"):"-"}
          </p>
        );

      case "orderNumberMajor":
        return <p>{item?.orderNumber || "-"}</p>;
      case "dateOfPunishmentMajor":
        return <p>{item?.dateOfPunishment ? moment(item?.dateOfPunishment).format("DD-MM-YYYY") : "-"}</p>;
      case "dateOfIntimationMajor":
        return <p>{item?.dateOfIntimation ? moment(item?.dateOfIntimation).format("DD-MM-YYYY") : "-"}</p>;
      case "natureOfPunishmentMajor":
        return <p>{item?.natureOfPunishment || "-"}</p>;

      case "orderNumberMinor":
        return <p>{item?.orderNumber || "-"}</p>;
      case "dateOfPunishmentMinor":
        return <p>{item?.dateOfPunishment ? moment(item?.dateOfPunishment).format("DD-MM-YYYY"):"-"}</p>;
      case "dateOfIntimationMinor":
        return <p>{item?.dateOfIntimation ? moment(item?.dateOfIntimation).format("DD-MM-YYYY"):"-"}</p>;
      case "natureOfPunishmentMinor":
        return <p>{item?.natureOfPunishment}</p>;

      case "dateOfIntimationIntegrity":
        return <p>{item?.dateOfIntimation ? moment(item?.dateOfIntimation).format("DD-MM-YYYY") : "-"}</p>;
      case "dateOfReceiptOfRepresentationIntegrity":
        return (
          <p>
            {item?.dateOfReceiptOfRepresentation ? moment(item?.dateOfReceiptOfRepresentation).format("DD-MM-YYYY") : "-"}
          </p>
        );
      case "dateOfDisposalOfRepresentationIntegrity":
        return (
          <p>
            {item?.dateOfDisposalOfRepresentation ? moment(item?.dateOfDisposalOfRepresentation).format("DD-MM-YYYY"): "-"}
          </p>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table removeWrapper color="default">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            align={column.key === "actions" ? "center" : "start"}
            className="text-wrap"
          >
            {column.title}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={rows} emptyContent="No data">
        {(item) => (
          <TableRow key={item?._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DpcModalTable;
