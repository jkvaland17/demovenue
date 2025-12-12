"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import React, { useCallback, useEffect, useState } from "react";
import {
  CallAutoGenAdmitCard,
  CallDownloadSampleAdmitExcel,
  CallGetAdmitCardStats,
  CallGetAdvByCourse,
  CallGetAllCourses,
  CallUploadAdmitCardExcel,
} from "@/_ServerActions";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { AdmitCardDownload } from "@/Utils/AdmitCardDownload";
import * as XLSX from "xlsx";
import GlobalAdvertisementFields from "@/components/Fields";
import DynamicTable from "@/components/Table/DynamicTable";
import FlatCard from "@/components/FlatCard";
import { useAdvertisement } from "@/components/AdvertisementContext";
import { useSessionData } from "@/Utils/hook/useSessionData";
import CardGrid from "@/components/kushal-components/CardGrid";
import { handleCommonErrors } from "@/Utils/HandleError";
import Admitcard from "@/app/admin/screening-admitCard/admit-card/admitcard/page"
import { stat } from "fs";

type FormData = {
  advertisement: string;
  labelId: string;
  file: any;
};

const Add = () => {
  const { currentAdvertisementID } = useAdvertisement();
  const { token } = useSessionData();
  const {
    register,
    // handleSubmit,
    // watch,
    setValue,
    // formState: { errors },
  } = useForm<FormData>();

  const [isSampleDownloading, setIsSampleDownloading] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  // const [allCourses, setAllCourses] = useState<any>();
  const [allAdvertisements, setAllAdvertisements] = useState<any[]>([]);
  const [profilePreview, setProfilePreview] = useState<any>(null);
  const [profileFile, setProfileFile] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  // const [selectAdvertisement, setSelectAdvertisement] = useState<any>("");
  // const [stage, setStage] = useState<any>("1");
  const [currentUser, setCurrentUser] = useState<string>("");
  const [data, setData] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [generateOptions, setGenerateOptions] = useState<any>([]);
  const [stats, setStats] = useState<any>({
    totalCandidates: 0,
    maleCandidates: 0,
    femaleCandidates: 0,
    SC: 0,
    ST: 0,
    OBC: 0,
    GENERAL: 0,
    date: 0,
    district: 0,
    center: 0,
    shifts: 0,
  });

  const cardData = [
    {
      title: "Total no. of Candidates",
      value: stats?.totalCandidates,
    },
    {
      title: "No of Male Candidates",
      value: stats?.maleCandidates,
    },
    {
      title: "No. of Female Candidates",
      value: stats?.femaleCandidates,
    },
  ];
  const cardData2 = [
    {
      title: "Date",
      value: stats?.date,
    },
    {
      title: "District",
      value: stats?.district,
    },
    {
      title: "Center",
      value: stats?.center,
    },
    {
      title: "Shifts",
      value: stats?.shifts,
    },
  ];
  const category = [
    {
      title: "SC",
      value: stats?.SC,
    },
    {
      title: "ST",
      value: stats?.ST,
    },
    {
      title: "OBC",
      value: stats?.OBC,
    },
    {
      title: "General",
      value: stats?.GENERAL,
    },
  ];

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("excel", profileFile);
      formData.append("advertisementId", currentAdvertisementID);
      // formData.append("stage", stage);
      console.log("formData", formData);

      const responseData = (await CallUploadAdmitCardExcel(formData)) as any;
      console.log("response", responseData);
      if (responseData?.data) {
        toast.success(responseData?.data?.message);
        setValue("file", null);
        setProfilePreview(null);
        setData([]);
      }
      if (responseData?.error) {
        toast.error(responseData?.error);
        setValue("file", null);
        setProfilePreview(null);
        // setSelectAdvertisement("");
      }

      setIsLoading(false);
    } catch (error) {
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
      setIsLoading(false);
    }
  };

  const handleLogoChange = async (e: any) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileFile(e.target.files[0]);
      setProfilePreview(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const sheetData = XLSX.utils.sheet_to_json(sheet) as any;
          setData(sheetData);
        } catch (error) {
          console.error("Error processing file: ", error);
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = (error) => {
        console.error("File reading error: ", error);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setProfilePreview(null);
      setData([]);
    }
  };
  useEffect(() => {
    if (currentUser) DownloadAdmitCard(currentUser);
  }, [currentUser]);

  const DownloadAdmitCard = async (id: any) => {
    AdmitCardDownload(id, "admitCard", token, setLoading, "AdmitCard.pdf");
  };

  const RenderPrintBtn = ({ id }: { id: string }) => {
    return (
      <div
        className="flex cursor-pointer items-start gap-x-2"
        onClick={() => setCurrentUser(id)}
      >
        <i className="fa-solid fa-download" />
      </div>
    );
  };

  const renderCell = useCallback((dataRows: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "CANDIDATE_ID":
        return (
          <div className="flex flex-col gap-y-2">{dataRows.CANDIDATE_ID}</div>
        );
      case "NAME":
        return <div className="flex items-start gap-x-2">{dataRows.NAME}</div>;

      case "POST_NAME":
        return (
          <div className="flex items-start gap-x-2">{dataRows.POST_NAME}</div>
        );
      case "Action":
        return <RenderPrintBtn id={dataRows.APPLICATION} />;
    }
  }, []);

  // const downloadExcel = () => {
  //   let fileUrl: any = "/file/Admit_SR.xlsx";
  //   const link = document.createElement("a");
  //   link.href = fileUrl;
  //   link.setAttribute("download", fileUrl.split("/").pop());
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  // };

  const autoGenAdmitCard = async () => {
    try {
      if (currentAdvertisementID === "") {
        toast.error("Please select Advertisement");
        return;
      }
      setIsGenerating(true);
      const obj = { advertisementId: currentAdvertisementID };
      const { data, error } = (await CallAutoGenAdmitCard(obj)) as any;
      console.log("autoGenAdmitCard", { data, error });

      if (data) {
        toast.success(data?.message);
        setIsGenerating(false);
      }
      if (error) {
        toast.error(error);
        setIsGenerating(false);
      }
    } catch (error) {
      console.log(error);
      setIsGenerating(false);
    }
  };

  // const getAllCourse = async () => {
  //   try {
  //     const { data, error } = (await CallGetAllCourses()) as any;
  //     console.log("getAllCourse", { data, error });

  //     if (data) {
  //       setAllCourses(data?.data);
  //     }
  //     if (error) {
  //       toast.error(error);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   getAllCourse();
  // }, []);

  // const getAllAdvertisements = async () => {
  //   try {
  //     const query = `parentMasterId=679cfae430000d1df590aac5`;
  //     const { data, error } = (await CallGetAdvByCourse(query)) as any;
  //     // console.log("getAllAdvertisements", { data, error });

  //     if (data) {
  //       setAllAdvertisements(data?.data);
  //     }
  //     if (error) {
  //       toast.error(error);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   getAllAdvertisements();
  // }, []);

  const getAllStats = async () => {
    try {
      const query = `advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetAdmitCardStats(query)) as any;
      console.log("getAllStats", { data, error });

      if (data) {
        setStats(data?.data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (currentAdvertisementID) {
      getAllStats();
    }
  }, [currentAdvertisementID]);

  const downloadExcel = (fileUrl: string) => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "admit_card_data.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSampleExcel = async () => {
    setIsSampleDownloading(true);
    try {
      const { data, error } = (await CallDownloadSampleAdmitExcel()) as any;
      console.log("downloadSampleExcel", { data, error });

      if (data?.fileUrl) {
        downloadExcel(data?.fileUrl);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsSampleDownloading(false);
  };


  return (
    <>
      {loading && (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      )}

      <FlatCard heading="Overview">
        <CardGrid columns={4} data={cardData} />

        <h2 className="my-4 text-xl font-semibold">Category</h2>
        <CardGrid columns={4} data={category} />

        <h2 className="my-4 text-xl font-semibold">Other Details</h2>
        <CardGrid columns={4} data={cardData2} />
      </FlatCard>

      {/* <Tabs  aria-label="Options" color="primary" className="flex flex-col" size="lg">
        <Tab key="manual" title="Manual Generate Admit Card">
          <FlatCard>
            <div className="flex justify-between mob:flex-col">
              <h2 className="mb-4 text-xl font-semibold mob:text-lg mob:mb-1">
                Upload excel for Admit Card Generation
              </h2>

              <div className="flex gap-3 mob:mb-4">
                <Button
                className="mob:w-full"
                  color="success"
                  onPress={downloadSampleExcel}
                  isLoading={isSampleDownloading}
                >
                  Download Excel Format
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label>Upload file</label>
                {profilePreview ? (
                  <div className="relative mt-2 w-fit">
                    <div className="h-9 rounded-md bg-slate-100 p-10">
                      {profilePreview.name}
                    </div>
                    <div
                      onClick={() => {
                        setValue("file", null);
                        setProfilePreview(null);
                        setData([]);
                      }}
                      className="absolute right-1 top-1 w-fit cursor-pointer"
                    >
                      <i className="fa-solid fa-circle-xmark text-gray-800" />
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 flex w-full items-center justify-center">
                    <label
                      htmlFor="dropzone-file-excel"
                      className="flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
                    >
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <svg
                          className="mb-4 h-8 w-8 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop excel
                        </p>
                        <p className="text-xs text-gray-500">XLSX, XLS, CSV</p>
                      </div>
                      <input
                        {...register("file")}
                        id="dropzone-file-excel"
                        type="file"
                        className="hidden"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleLogoChange}
                      />
                    </label>
                  </div>
                )}
              </div>

              {data?.length > 0 && <DynamicTable data={data} />}

              <div className="flex w-full justify-end gap-3">
                <Button
                  color="secondary"
                  isDisabled={!profilePreview && true}
                  isLoading={isLoading}
                  onPress={() => onSubmit()}
                  className="px-8 mob:w-full"
                >
                  Generate Admit Card
                </Button>
              </div>
            </div>
          </FlatCard>
        </Tab>
        <Tab key="auto" title="Auto Generate Admit Card">
          <FlatCard heading="Admit Card Generation">
            <CheckboxGroup onChange={(e) => setGenerateOptions(e)}>
              <Checkbox value="female">
                उ०प्र० की महिला अभ्यर्थी (महिला अभ्यर्थियों को गृह जनपद आवंटित
                किया जायेगा।)
              </Checkbox>
              <Checkbox value="male">
                उ०प्र० की पुरूष अभ्यर्थी (पुरूष अभ्यर्थियों को य उनके गृह मण्डल
                के निकटस्थ का जनपद आवंटित किया जायेगा।)
              </Checkbox>
              <Checkbox value="borderStates">
                सीमावर्ती राज्यों के पुरुष / महिला अभ्यर्थी (उत्तर प्रदेश राज्य
                से सटे हुए राज्यों / केन्द्रशासित प्रदेश (उत्तराखण्ड हिमाचल
                प्रदेश, हरियाणा, राजस्थान, मध्यप्रदेश, छत्तीसगढ़ झारखण्ड बिहार
                एवं दिल्ली) के पुरूष / महिला अभ्यर्थियों को उनके राज्य की सीमा
                से सटे मण्डल का कोई जनपद आवंटित किया जायेगा।)
              </Checkbox>
              <Checkbox value="nonBorderStates">
                सीमावर्ती राज्यों से भिन्न राज्यों के पुरुष / महिला अभ्यर्थी
                (ऐसे अभ्यर्थियों को सीटों की उपलब्धता के अनुसार जनपद आवंटित किया
                जायेगा।)
              </Checkbox>
            </CheckboxGroup>

            <div className="flex justify-end">
              <Button
                color="secondary"
                variant="solid"
                isDisabled={generateOptions?.length === 0}
                isLoading={isGenerating}
                className="mt-6 w-fit px-8"
                // onPress={autoGenAdmitCard}
              >
                Generate Admit Card
              </Button>
            </div>
          </FlatCard>
        </Tab>
      </Tabs> */}
      <Admitcard/>
    </>
  );
};

export default Add;
