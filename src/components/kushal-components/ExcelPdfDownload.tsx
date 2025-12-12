import { Button, Spinner } from "@nextui-org/react";
import React from "react";

type Props = {
  excelFunction?: () => void;
  pdfFunction?: () => void;
  excelLoader?: boolean;
  pdfLoader?: boolean;
};

const ExcelPdfDownload: React.FC<Props> = ({
  excelFunction,
  pdfFunction,
  excelLoader,
  pdfLoader,
}) => {
  return (
    <div className="flex items-end gap-2">
      <Button
        color="success"
        className="text-white mob:w-full"
        onPress={excelFunction}
        // className="text-white"
        startContent={
          excelLoader ? (
            <Spinner color="default" size="sm" />
          ) : (
            <span className="material-symbols-rounded">description</span>
          )
        }
      >
        Download Excel
      </Button>
      <Button
        className="mob:w-full"
        color="primary"
        onPress={pdfFunction}
        startContent={
          pdfLoader ? (
            <Spinner color="default" size="sm" />
          ) : (
            <span className="material-symbols-rounded">picture_as_pdf</span>
          )
        }
      >
        Download PDF
      </Button>
    </div>
  );
};

export default ExcelPdfDownload;

