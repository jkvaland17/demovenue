import Dataservice from "@/services/requestApi";
import toast from "react-hot-toast";

export const PrintReciept = async (
  id,
  type,
  token,
  setLoading,
  name,
  iType,
  printOnly,
) => {
  try {
    setLoading(true);
    const { data: printeResponse } = await Dataservice.GetTransactionDownload(
      id,
      type,
      iType,
      printOnly,
      token,
    );
    if (printOnly === "printOnly") {
      window.open(printeResponse?.data?.URL, "_blank");
      setLoading(false);
      return;
    }
    const url = window.URL.createObjectURL(new Blob([printeResponse]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name ? name : "transaction_receipt.pdf");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    toast.success("Reciept downloaded successfully");
    setLoading(false);
  } catch (error) {
    console.log(error);
    toast.error("download failed");
    setLoading(false);
  }
};

export const PrintReceiptAll = async (
  filterData,
  selectedKeys,
  allData,
  setLoading,
  token,
  api,
  name,
) => {
  try {
    const rowData =
      selectedKeys === "all"
        ? allData?.map((ele) => ele._id)
        : [...selectedKeys];

    setLoading(true);
    const data = {
      ids: rowData,
      ...filterData,
    };

    const { data: printeResponse } = await Dataservice.GetDownloadExcel(
      token,
      data,
      api,
    );

    window.open(printeResponse?.data?.URL, "_blank");
    const url = window.URL.createObjectURL(new Blob([printeResponse]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name ? name : "Summery_slip.pdf");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    toast.success("Summery Slip downloaded successfully");
    setLoading(false);
  } catch (error) {
    console.log(error);
    toast.error("download failed");
    setLoading(false);
  }
};
