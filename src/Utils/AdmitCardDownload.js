import Dataservice from "@/services/requestApi";
import toast from "react-hot-toast";

export const AdmitCardDownload = async (id, type, token, setLoading, name) => {
  // console.log("all props", id, type, token, setLoading, name);

  try {
    setLoading(true);
    const formData = { applicationId: id };
    const { data: printResponse } = await Dataservice.AdmitCardDownload(
      formData,
      token,
    );
    console.log("printResponse", printResponse);
    // const url = window.URL.createObjectURL(new Blob([printResponse]));
    // const link = document.createElement("a");
    // link.href = url;
    // link.setAttribute("download", name);
    // document.body.appendChild(link);
    // link.click();
    // link.parentNode.removeChild(link);
    // toast.success("Admit Card downloaded successfully");
    setLoading(false);
  } catch (error) {
    console.log(error);
    toast.error("download failed");
    setLoading(false);
  }
};

export const CallDownloadScoreCard = async (
  id,
  type,
  token,
  setLoading,
  name,
) => {
  try {
    setLoading(true);
    const { data: printResponse } = await Dataservice.DownloadScoreCard(
      id,
      token,
    );
    const url = window.URL.createObjectURL(new Blob([printResponse]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    toast.success("Admit Card downloaded successfully");
    setLoading(false);
  } catch (error) {
    console.log(error);
    toast.error("download failed");
    setLoading(false);
  }
};
