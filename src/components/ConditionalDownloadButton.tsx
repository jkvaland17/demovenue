import { Button, Spinner } from "@nextui-org/react";
import React from "react";

type Props = {
  excelFunction?: () => void;
  pdfFunction?: () => void;
  pdfUrl?: string;
  excelLoader?: boolean;
  pdfLoader?: boolean;
  hideExcel?: boolean;
};

const ConditionalDownloadButton: React.FC<Props> = ({
  excelFunction,
  pdfFunction,
  pdfUrl,
  excelLoader,
  pdfLoader,
  hideExcel,
}) => {
  const downloadPdfFromUrl = async () => {
    if (!pdfUrl) return;
    try {
      const res = await fetch(pdfUrl);
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF download error:", err);
    }
  };

  return (
    <div className="flex items-end gap-2">
      {!hideExcel && (
        <Button
          color="success"
          className="text-white mob:w-full"
          onPress={excelFunction}
          startContent={
            pdfLoader ? (
              <Spinner color="default" size="sm" />
            ) : (
              <span className="material-symbols-rounded">picture_as_pdf</span>
            )
          }
        >
          Download Excel
        </Button>
      )}

      <Button
        className="mob:w-full"
        color="primary"
        onPress={pdfUrl ? downloadPdfFromUrl : pdfFunction}
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

export default ConditionalDownloadButton;
