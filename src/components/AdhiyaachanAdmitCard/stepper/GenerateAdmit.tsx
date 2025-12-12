import { CallDownloadSampleAdmitExcel } from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import DynamicTable from "@/components/Table/DynamicTable";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Tab,
  Tabs,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const GenerateAdmit: React.FC<any> = ({ formMethods, setProfileFile }) => {
  const { control, register, watch, setValue } = formMethods;
  const [isSampleDownloading, setIsSampleDownloading] =
    useState<boolean>(false);
  const [profilePreview, setProfilePreview] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const [generateOptions, setGenerateOptions] = useState<any>([]);
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState<"manual" | "auto">("manual");

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

  const downloadExcel = (fileUrl: string) => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "admit_card_data.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    if (activeTab === "manual") {
      // Clear auto tab data
      setValue("options", []);
      // setGenerateOptions([]);
    }
    if (activeTab === "auto") {
      // Clear manual tab data
      setProfileFile(null);
      setProfilePreview(null);
      setValue("file", null);
      setData([]);
    }
  }, [activeTab]);

  return (
    <Card className="mb-5">
      <CardBody>
        <Tabs
          aria-label="Options"
          color="primary"
          size="md"
          className="flex flex-col"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as "manual" | "auto")}
        >
          <Tab key="manual" title="Manual Generate Admit Card">
            <div className="flex justify-between mob:flex-col">
              <h2 className="mb-4 text-xl font-semibold mob:mb-1 mob:text-lg">
                Upload excel for Admit Card Generation
              </h2>

              <div className="flex gap-3 mob:mb-4">
                <Button
                  className="mob:w-full"
                  color="success"
                  size="sm"
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

              {/* <div className="flex w-full justify-end gap-3">
                  <Button
                    size="sm"
                  color="secondary"
                  isDisabled
                    // isDisabled={!profilePreview && true}
                    isLoading={isLoading}
                    className="px-8 mob:w-full"
                  >
                    Generate Admit Card
                  </Button>
                </div> */}
            </div>
          </Tab>
          <Tab key="auto" title="Auto Generate Admit Card">
            <CheckboxGroup
              onChange={(e) => {
                setGenerateOptions(e);
                setValue("options", e);
              }}
            >
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

            {/* <div className="flex justify-end">
                <Button
                  color="secondary"
                  size="sm"
                  variant="solid"
                  isDisabled={generateOptions?.length === 0}
                  isLoading={isGenerating}
                  className="mt-6 w-fit px-8"
                  // onPress={autoGenAdmitCard}
                >
                  Generate Admit Card
                </Button>
              </div> */}
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default GenerateAdmit;
