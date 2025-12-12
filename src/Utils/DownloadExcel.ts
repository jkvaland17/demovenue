import toast from "react-hot-toast";
import {
  CallDownloadKushalExcel,
  CallDownloadKushalPdf,
} from "@/_ServerActions";

export const DownloadKushalExcel = async (
  query?: string,
  name?: string,
  setLoading?: any,
) => {
  setLoading((prev: any) => ({
    ...prev,
    excel: true,
  }));
  try {
    const { data, error } = (await CallDownloadKushalExcel(query)) as any;
    if (data) {
      toast.success(data?.message);
      const link = document.createElement("a");
      link.href = data.fileUrl;
      link.setAttribute("download", `${name}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    if (error) {
      toast.error(error);
    }
    setLoading((prev: any) => ({
      ...prev,
      excel: false,
    }));
  } catch (error) {
    setLoading((prev: any) => ({
      ...prev,
      excel: false,
    }));
  }
};

export const DownloadKushalPdf = async (
  query: string,
  name: string,
  setLoading: any,
) => {
  try {
    setLoading((prev: any) => ({
      ...prev,
      pdf: true,
    }));
    const { data, error } = (await CallDownloadKushalPdf(query)) as any;
    if (data) {
      toast.success(data?.message);
      const link = document.createElement("a");
      link.href = data.fileUrl;
      link.setAttribute("target", "_blank");
      link.setAttribute("download", `${name}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    if (error) {
      toast.error(error);
    }
    setLoading((prev: any) => ({
      ...prev,
      pdf: false,
    }));
  } catch (error) {
    setLoading((prev: any) => ({
      ...prev,
      pdf: false,
    }));
  }
};

export const DownloadKushalAdmitCard = async (query: string, name: string) => {
  await toast.promise(
    (async () => {
      const { data, error } = (await CallDownloadKushalPdf(query)) as any;

      if (error) throw new Error(error);

      const link = document.createElement("a");
      link.href = data.fileUrl;
      link.setAttribute("target", "_blank");
      link.setAttribute("download", `${name}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })(),
    {
      loading: "Downloading Admit Card...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `Error downloading PDF: ${error.message}`,
    },
  );
};
