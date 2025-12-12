"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import React, { useEffect, useState } from "react";
import HeadersSection from "@/components/HeadersSection";
import { Button, Spinner } from "@nextui-org/react";
// import { DownloadExcel } from "@/Utils/DownloadExcel";
import { useSession } from "next-auth/react";
import { handleCommonErrors } from "@/Utils/HandleError";
import { CallCreateJobQueue } from "@/_ServerActions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const DownloadExcelBtn: React.FC<any> = ({
  filterData,
  selectedKeys,
  Data,
  api,
  name,
  headerApi,
  type,
}) => {
  const routes = useRouter();
  const {
    isOpen: isOpenExcel,
    onOpen: onOpenExcel,
    onOpenChange: onOpenChangeExcel,
    onClose: onCloseExcel,
  } = useDisclosure();

  const [ExcelLoader, setExcelLoader] = useState<boolean>(false);
  const [Loading, setLoading] = useState<any>(false);

  useEffect(() => {
    if (isOpenExcel && filterData?.advertisement_noId) {
      getApplicationExcelHeadersList();
    } else {
      setExcelHeaders(null);
      setExcelDownloadData({
        headerArray: [],
        pubHeadersArray: [],
        awardsHeadersArray: [],
        notableHeadersArray: [],
        postHeldHeadersArray: [],
        screenScoreHeadersArray: [],
      });
    }
  }, [isOpenExcel]);

  const [ExcelHeaders, setExcelHeaders] = useState<any>(null);

  const [ExcelDownloadData, setExcelDownloadData] = useState<any>({
    headerArray: [],
    pubHeadersArray: [],
    awardsHeadersArray: [],
    notableHeadersArray: [],
    postHeldHeadersArray: [],
    screenScoreHeadersArray: [],
  });

  const transformHeaders = (data: any) => {
    const transformedData: any = {};
    for (const key in data) {
      if (Array.isArray(data[key])) {
        transformedData[key] = data[key].map((header: string) => ({
          label: header,
          value: header,
        }));
      } else {
        transformedData[key] = data[key];
      }
    }

    return transformedData;
  };

  const getApplicationExcelHeadersList = async () => {
    try {
      setExcelLoader(true);
      const { data, error } = (await headerApi(
        filterData?.advertisement_noId,
      )) as any;
      if (data?.data) {
        const transformed = transformHeaders(data?.data);
        console.log("data?.data::: ", data?.data);
        setExcelHeaders(transformed);
        setExcelDownloadData({
          headerArray: data?.data?.headerArray || [],
          pubHeadersArray: data?.data?.pubHeadersArray || [],
          awardsHeadersArray: data?.data?.awardsHeadersArray || [],
          notableHeadersArray: data?.data?.notableHeadersArray || [],
          postHeldHeadersArray: data?.data?.postHeldHeadersArray || [],
          screenScoreHeadersArray: data?.data?.screenScoreHeadersArray || [],
        });
      }
      if (error) {
        handleCommonErrors(error);
      }
      setExcelLoader(false);
    } catch (error) {
      setExcelLoader(false);
      console.error("Error fetching headers: ", error);
    }
  };

  const DownloadExcelQueue = async () => {
    try {
      setLoading(true);
      const { data: Dto, error } = (await CallCreateJobQueue({
        advId: filterData?.advertisement_noId,
        type,
        isSampleFile: false,
        data: {
          ...filterData,
          advertisementId: filterData?.advertisement_noId,
          isSelectSpecificFields: true,
          ...ExcelDownloadData,
        },
      })) as any;
      console.log("Dto::: ", Dto);
      if (Dto?.data) {
        toast.success(Dto?.message);
        routes.push("/admin/download-data");
      }
      if (error) {
        toast(error, {
          icon: <i className="fa-solid fa-triangle-exclamation"></i>,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log("error::: ", error);
      setExcelLoader(false);
    }
  };

  return (
    <>
      <Modal
        size="full"
        isOpen={isOpenExcel}
        onOpenChange={onOpenChangeExcel}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Select Data
              </ModalHeader>
              {ExcelLoader ? (
                <ModalBody>
                  <div className="flex h-full w-full items-center justify-center">
                    <Spinner />
                  </div>
                </ModalBody>
              ) : (
                <ModalBody className="overflow-y-auto">
                  {ExcelHeaders?.headerArray?.length > 0 && (
                    <HeadersSection
                      title="Basic Details"
                      headersArray={ExcelHeaders.headerArray}
                      selectedHeaders={ExcelDownloadData.headerArray}
                      onSelect={(updatedHeaders) =>
                        setExcelDownloadData({
                          ...ExcelDownloadData,
                          headerArray: updatedHeaders,
                        })
                      }
                    />
                  )}
                  {ExcelHeaders?.postHeldHeadersArray?.length > 0 && (
                    <HeadersSection
                      title="Post Held"
                      headersArray={ExcelHeaders.postHeldHeadersArray}
                      selectedHeaders={ExcelDownloadData.postHeldHeadersArray}
                      onSelect={(updatedHeaders) =>
                        setExcelDownloadData({
                          ...ExcelDownloadData,
                          postHeldHeadersArray: updatedHeaders,
                        })
                      }
                    />
                  )}
                  {ExcelHeaders?.screenScoreHeadersArray?.length > 0 && (
                    <HeadersSection
                      title="Screen Score"
                      headersArray={ExcelHeaders.screenScoreHeadersArray}
                      selectedHeaders={
                        ExcelDownloadData.screenScoreHeadersArray
                      }
                      onSelect={(updatedHeaders) =>
                        setExcelDownloadData({
                          ...ExcelDownloadData,
                          screenScoreHeadersArray: updatedHeaders,
                        })
                      }
                    />
                  )}
                  {ExcelHeaders?.pubHeadersArray?.length > 0 && (
                    <HeadersSection
                      title="Publication and Research"
                      headersArray={ExcelHeaders.pubHeadersArray}
                      selectedHeaders={ExcelDownloadData.pubHeadersArray}
                      onSelect={(updatedHeaders) =>
                        setExcelDownloadData({
                          ...ExcelDownloadData,
                          pubHeadersArray: updatedHeaders,
                        })
                      }
                    />
                  )}
                  {ExcelHeaders?.awardsHeadersArray?.length > 0 && (
                    <HeadersSection
                      title="Awards"
                      headersArray={ExcelHeaders.awardsHeadersArray}
                      selectedHeaders={ExcelDownloadData.awardsHeadersArray}
                      onSelect={(updatedHeaders) =>
                        setExcelDownloadData({
                          ...ExcelDownloadData,
                          awardsHeadersArray: updatedHeaders,
                        })
                      }
                    />
                  )}
                  {ExcelHeaders?.notableHeadersArray?.length > 0 && (
                    <HeadersSection
                      title="Notable"
                      headersArray={ExcelHeaders.notableHeadersArray}
                      selectedHeaders={ExcelDownloadData.notableHeadersArray}
                      onSelect={(updatedHeaders) =>
                        setExcelDownloadData({
                          ...ExcelDownloadData,
                          notableHeadersArray: updatedHeaders,
                        })
                      }
                    />
                  )}
                </ModalBody>
              )}
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  isDisabled={ExcelLoader}
                  type="submit"
                  color="primary"
                  isLoading={Loading}
                  onPress={() => {
                    DownloadExcelQueue();
                    // DownloadExcel(
                    //   {
                    //     ...filterData,
                    //     advertisementId: filterData?.advertisement_noId,
                    //     isSelectSpecificFields: true,
                    //     ...ExcelDownloadData,
                    //   },
                    //   selectedKeys,
                    //   Data,
                    //   setLoading,
                    //   token,
                    //   api,
                    //   name,
                    //   onCloseExcel,
                    // );
                  }}
                >
                  Download Excel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button
        variant="shadow"
        color="primary"
        size="md"
        className="me-2 w-full cursor-pointer px-5 py-2 md:w-fit"
        onPress={() => {
          onOpenExcel();
        }}
        startContent={<i className="fa-solid fa-download" />}
      >
        Download Excel
      </Button>
    </>
  );
};

export default DownloadExcelBtn;
