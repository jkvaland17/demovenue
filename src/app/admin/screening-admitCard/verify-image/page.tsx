"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Modal,
  Button,
  Card,
  CardBody,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Table } from "@nextui-org/react";

import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import {
  CallAddScrutinyData,
  CallConvertRejectedScrutinyToPending,
  CallCreateJobQueue,
  CallFindScrutinyData,
  CallFindScrutinyStats,
  CallGetTransactionExcelHeaders,
  CallUpdateVerificationStatus,
} from "@/_ServerActions";
import NoPhoto from "@/assets/img/icons/common/noImage.png";
import { PrintReciept } from "@/Utils/PrintReciept";
import { handleCommonErrors } from "@/Utils/HandleError";
import { useRouter } from "next/navigation";
import GlobalAdvertisementFields from "@/components/Fields";
import DownloadExcelBtn from "@/components/DownloadExcelBtn";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FlatCard from "@/components/FlatCard";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import { useSessionData } from "@/Utils/hook/useSessionData";

type FilterData = {
  status: string;
  advertisementId: string;
  candidateId: string;
  candidate_name: string;
};

const VerifyImage: React.FC = () => {
  const { currentAdvertisementID } = useAdvertisement();
  const { token } = useSessionData();
  const route = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [Data, setData] = useState<any[]>([]);
  const [Loading, setLoading] = useState<boolean>(false);
  const [LoadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
  const [documentUrl, setDocumentUrl] = useState<any>("");
  const [modelStatus, setModelStatus] = useState("");
  const [verifyCheckboxData, setVerifyCheckboxData] = useState<any>({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<any>(0);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [filterData, setFilterData] = useState<FilterData>({
    status: "pending",
    advertisementId: "",
    candidateId: "",
    candidate_name: "",
  });
  const [isShowBtn, setIsShowBtn] = useState(false);
  const [LoadingImgVerification, setLoadingImgVerification] =
    useState<boolean>(false);
  const [LoadingReUpload, setLoadingReUpload] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);

  useEffect(() => {
    if (currentAdvertisementID) {
      GetData(true);
    }
  }, [page, filterData.status]);

  useEffect(() => {
    if (currentAdvertisementID) {
      clearFilter();
    }
  }, [currentAdvertisementID]);

  useEffect(() => {
    if (currentUser) printDownload(currentUser);
  }, [currentUser]);

  const GetData = async (isFilter: boolean): Promise<void> => {
    try {
      setLoading(true);
      const filterOff = `page=1&limit=${10}&advertisementId=${currentAdvertisementID}&scrutinyKey=image&status=${filterData?.status}`;
      console.log("filterOff", filterOff);

      const filterOn = `page=${page}&limit=${10}&advertisementId=${currentAdvertisementID}&scrutinyKey=image&status=${filterData?.status}&candidateId=${filterData?.candidateId}&candidate_name=${filterData?.candidate_name}`;
      const { data, error } = (await CallFindScrutinyData(
        isFilter ? filterOn : filterOff,
      )) as any;
      console.log("jj", { data, error });
      if (data) {
        setData(data?.data);
        setTotalCount(data);
        setIsShowBtn(
          data?.statusSummary?.pendingCount === 0 &&
            data?.statusSummary?.rejectCount === 0 &&
            data?.statusSummary?.acceptCount === 0,
        );
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Pagination
  const rowsPerPage = 10;
  let pageCount;

  if (filterData?.status === "pending") {
    pageCount = Math.ceil(totalCount?.totalCounts / rowsPerPage);
  } else if (filterData?.status === "reject") {
    pageCount = Math.ceil(totalCount?.totalCounts / rowsPerPage);
  } else if (filterData?.status === "accept") {
    pageCount = Math.ceil(totalCount?.totalCounts / rowsPerPage);
  }
  const pages = pageCount as any;

  // Redirect
  const updateImageStatus = async (imgData: any) => {
    setLoadingBtn(true);
    const verifyList = { images: [] } as any;

    imgData.map((item: any) => {
      const dto = {
        _id: item?._id,
        image: item?.image,
      } as any;
      verifyList.images.push(dto);
    });

    const { data } = (await CallUpdateVerificationStatus(verifyList)) as any;
    if (data?.message === "Success") {
      GetData(false);
      setLoadingBtn(false);
      toast.success("Verify successfully");
    } else if (data?.error) {
      toast.error(data?.error);
      setLoadingBtn(false);
    }
    setLoadingBtn(false);
  };

  const clearFilter = () => {
    setFilterData({
      ...filterData,
      candidateId: "",
      candidate_name: "",
    });

    GetData(false);
  };

  const checkboxSelection = async (
    e: boolean,
    rowData: any,
    key: string,
    status: string,
  ) => {
    const imageVerifyData = {
      id: rowData._id,
      photo: {
        url: rowData?.image?.photo?.url || null,
        presignedUrl: rowData?.image?.photo?.presignedUrl || null,
        docSha: rowData?.image?.photo?.docSha || null,
        verified: rowData?.image?.photo?.verified || false,
        status: [...(rowData?.image?.photo?.status || [])],
      },
      signature: {
        url: rowData?.image?.signature?.url || null,
        presignedUrl: rowData?.image?.signature?.presignedUrl || null,
        docSha: rowData?.image?.signature?.docSha || null,
        verified: rowData?.image?.signature?.verified || false,
        status: [...(rowData?.image?.signature?.status || [])],
      },
      thumbprint: {
        url: rowData?.image?.thumbprint?.url || null,
        presignedUrl: rowData?.image?.thumbprint?.presignedUrl || null,
        docSha: rowData?.image?.thumbprint?.docSha || null,
        verified: rowData?.image?.thumbprint?.verified || false,
        status: [...(rowData?.image?.thumbprint?.status || [])],
      },
    } as any;

    const updateStatusArray = (
      currentStatusArray: string[],
      key: string,
      isChecked: boolean,
    ) => {
      if (isChecked) {
        if (!currentStatusArray.includes(key)) {
          currentStatusArray.filter((item: any, index: any) => {
            currentStatusArray.indexOf(item) === index;
          });
          return Array.from(new Set([...currentStatusArray, key]));
        }
      } else {
        return currentStatusArray.filter((statusKey) => statusKey !== key);
      }
      return currentStatusArray;
    };

    if (status === "photo") {
      imageVerifyData.photo.status =
        key === "verified" && e
          ? []
          : updateStatusArray(imageVerifyData.photo.status, key, e);
      imageVerifyData.photo.verified =
        key === "verified" ? e : imageVerifyData.photo.verified;
    } else if (status === "signature") {
      imageVerifyData.signature.status =
        key === "verified" && e
          ? []
          : updateStatusArray(imageVerifyData.signature.status, key, e);
      imageVerifyData.signature.verified =
        key === "verified" ? e : imageVerifyData.signature.verified;
    } else if (status === "thumbprint") {
      imageVerifyData.thumbprint.status =
        key === "verified" && e
          ? []
          : updateStatusArray(imageVerifyData.thumbprint.status, key, e);
      imageVerifyData.thumbprint.verified =
        key === "verified" ? e : imageVerifyData.thumbprint.verified;
    }
    setData((prevData: any[]) => {
      const index = prevData.findIndex(
        (item: any) => item._id === imageVerifyData.id,
      );
      if (index !== -1) {
        const newData = [...prevData];
        newData[index] = {
          ...newData?.[index],
          image: {
            photo: imageVerifyData.photo,
            signature: imageVerifyData.signature,
            thumbprint: imageVerifyData.thumbprint,
          },
          isEdit: true,
        };
        return newData;
      }
      return [...prevData];
    });
  };

  const handelFilter = (status: string) => {
    setFilterData({ ...filterData, status });
    GetData(false);
  };

  const renderCell = useCallback((dataRows: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "candidateId":
        return (
          <div className="flex flex-col gap-y-2">
            <h5>{dataRows?.user?.name || " "}</h5>
            <p>{dataRows?.user?.candidateId}</p>
            <p>{dataRows?.application?.gender}</p>
          </div>
        );
      case "photo":
        return (
          <div className="flex items-start gap-x-2">
            <div className="flex items-center justify-center">
              <div className="relative h-40 w-40">
                <img
                  className={`h-full w-full cursor-pointer rounded-full object-contain ${
                    dataRows?.image?.photo?.verified
                      ? "border-3 border-blue-500"
                      : "border-2 border-gray-500"
                  }`}
                  src={dataRows?.image?.photo?.url ?? NoPhoto.src}
                  onClick={() => {
                    onOpen();
                    setModelStatus("imageView");
                    setDocumentUrl(dataRows?.image?.photo?.url);
                  }}
                />
              </div>
            </div>
            <div className="">
              <div className="flex flex-col items-start gap-x-2">
                {dataRows?.image?.photo?.verified ? (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="#3997F0"
                      className="bi bi-patch-check-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708" />
                    </svg>
                    <div className="ms-2 cursor-pointer">
                      <i
                        className="fa-solid fa-circle-xmark"
                        style={{ color: "grey" }}
                        onClick={() =>
                          checkboxSelection(
                            false,
                            dataRows,
                            "verified",
                            "photo",
                          )
                        }
                      ></i>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {[
                      "blurred",
                      "invalidBackground",
                      "invalidSize",
                      "invalid",
                    ].map((status) => (
                      <div key={status}>
                        <Checkbox
                          isDisabled={dataRows?.image?.photo?.verified}
                          defaultSelected={dataRows?.image?.photo?.status?.includes(
                            status,
                          )}
                          onValueChange={(e) => {
                            checkboxSelection(e, dataRows, status, "photo");
                          }}
                          className="checkboxClasses"
                          size="sm"
                        >
                          <span className="text-nowrap">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "signature":
        return (
          <div className="flex items-start gap-x-2">
            <div className="flex items-center justify-center">
              <div className="relative h-40 w-40">
                <img
                  className={`h-full w-full cursor-pointer rounded-full object-contain ${
                    dataRows?.image?.signature?.verified
                      ? "border-3 border-blue-500"
                      : "border-2 border-gray-500"
                  }`}
                  src={dataRows?.image?.signature?.url ?? NoPhoto.src}
                  onClick={() => {
                    onOpen();
                    setModelStatus("imageView");
                    setDocumentUrl(dataRows?.image?.signature?.url);
                  }}
                />
              </div>
            </div>
            <div className="">
              <div className="flex flex-col items-start gap-x-2">
                {dataRows?.image?.signature?.verified ? (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="#3997F0"
                      className="bi bi-patch-check-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708" />
                    </svg>
                    <div className="ms-2 cursor-pointer">
                      <i
                        className="fa-solid fa-circle-xmark"
                        style={{ color: "grey" }}
                        onClick={() =>
                          checkboxSelection(
                            false,
                            dataRows,
                            "verified",
                            "signature",
                          )
                        }
                      ></i>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {[
                      "blurred",
                      "invalidBackground",
                      "invalidSize",
                      "invalid",
                    ].map((status) => (
                      <div key={status}>
                        <Checkbox
                          isDisabled={dataRows?.image?.signature?.verified}
                          defaultSelected={dataRows?.image?.signature?.status?.includes(
                            status,
                          )}
                          onValueChange={(e) => {
                            checkboxSelection(e, dataRows, status, "signature");
                          }}
                          className="checkboxClasses"
                          size="sm"
                        >
                          <span className="text-nowrap">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "thumb":
        return (
          <div className="flex items-start gap-x-2">
            <div className="flex items-center justify-center">
              <div className="relative h-40 w-40">
                <img
                  className={`h-full w-full cursor-pointer rounded-full object-contain ${
                    dataRows?.image?.thumbprint?.verified
                      ? "border-3 border-blue-500"
                      : "border-2 border-gray-500"
                  }`}
                  src={dataRows?.image?.thumbprint?.presignedUrl ?? NoPhoto.src}
                  onClick={() => {
                    onOpen();
                    setModelStatus("imageView");
                    setDocumentUrl(dataRows?.image?.thumbprint?.presignedUrl);
                  }}
                />
              </div>
            </div>
            <div className="">
              <div className="flex flex-col items-start gap-x-2">
                {dataRows?.image?.thumbprint?.verified ? (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="#3997F0"
                      className="bi bi-patch-check-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708" />
                    </svg>
                    <div className="ms-2 cursor-pointer">
                      <i
                        className="fa-solid fa-circle-xmark"
                        style={{ color: "grey" }}
                        onClick={() =>
                          checkboxSelection(
                            false,
                            dataRows,
                            "verified",
                            "thumbprint",
                          )
                        }
                      ></i>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {[
                      "blurred",
                      "invalidBackground",
                      "invalidSize",
                      "invalid",
                    ].map((status) => (
                      <div key={status}>
                        <Checkbox
                          isDisabled={dataRows?.image?.thumbprint?.verified}
                          defaultSelected={dataRows?.image?.thumbprint?.status?.includes(
                            status,
                          )}
                          onValueChange={(e) => {
                            checkboxSelection(
                              e,
                              dataRows,
                              status,
                              "thumbprint",
                            );
                          }}
                          className="checkboxClasses"
                          size="sm"
                        >
                          <span className="text-nowrap">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "submitData":
        return (
          <div>
            <Button
              type="button"
              onPress={() => updateImageStatus([dataRows])}
              variant="bordered"
              color="primary"
              className="px-5"
            >
              Submit
            </Button>
          </div>
        );
    }
  }, []);

  const printDownload = (id: string) => {
    PrintReciept(
      id,
      "applicationSummary",
      token,
      setLoading,
      "Summery_slip.pdf",
      "id",
    );
    setCurrentUser("");
  };

  const imageVerificationGetData = async () => {
    try {
      setLoadingImgVerification(true);
      const { data, error } = (await CallAddScrutinyData({
        advertisementId: currentAdvertisementID,
      })) as any;
      console.log("CallAddScrutinyData", data);
      if (data) {
        toast.success(data?.message);
        GetData(false);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoadingImgVerification(false);
    } catch (error) {
      console.log(error);
      setLoadingImgVerification(false);
    }
  };

  const ConvertRejectedScrutinyToPending = async () => {
    try {
      setLoadingReUpload(true);
      const { data, error } = (await CallConvertRejectedScrutinyToPending({
        advertisementId: currentAdvertisementID,
      })) as any;
      if (data) {
        toast.success(data?.message);
        GetData(false);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoadingReUpload(false);
    } catch (error) {
      console.log(error);
      setLoadingReUpload(false);
    }
  };

  // const DownloadImageQueue = async () => {
  //   try {
  //     setSummaryLoading(true);
  //     const { data: Dto, error } = (await CallCreateJobQueue({
  //       advId: currentAdvertisementID,
  //       type: "Images",
  //       isSampleFile: false,
  //       data: {},
  //     })) as any;
  //     console.log("Dto::: ", Dto);
  //     if (Dto?.data) {
  //       toast.success(Dto?.message);
  //       route.push("/admin/download-data");
  //     }
  //     if (error) {
  //       toast(error, {
  //         icon: <i className="fa-solid fa-triangle-exclamation"></i>,
  //       });
  //     }
  //     setSummaryLoading(false);
  //   } catch (error) {
  //     console.log("error::: ", error);
  //     setSummaryLoading(false);
  //   }
  // };

  return (
    <>
      <FlatCard>
        <div className="grid grid-cols-1 flex-col gap-4 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 mob:flex">
          <div className="col-span-4 flex justify-between">
            <h1 className="text-xl font-semibold">Verify Image</h1>

            <div className="flex justify-end gap-2 gap-x-1 mob:hidden">
              {!isShowBtn && (
                <>
                  <Button
                    variant="shadow"
                    color="primary"
                    size="md"
                    className="me-2 w-full cursor-pointer px-5 py-2 md:w-fit"
                    isLoading={summaryLoading}
                    // onClick={() => DownloadImageQueue()}
                    startContent={
                      <i className="fa-solid fa-cloud-arrow-down" />
                    }
                  >
                    Download Images
                  </Button>
                  <DownloadExcelBtn
                    filterData={`advertisementId=${currentAdvertisementID}`}
                    selectedKeys={[]}
                    Data={[]}
                    api="downloadApplicationExcelImageVerification"
                    name="ImageVerification"
                    type={"ImageVerification"}
                    headerApi={CallGetTransactionExcelHeaders}
                  />
                  {/* <Button
                  variant="shadow"
                  color="primary"
                  size="md"
                  className="py-2 px-5 me-2 cursor-pointer w-full md:w-fit"
                  isLoading={loadingDownload}
                  onClick={() =>
                    DownloadExcelScreening(
                      `advertisementId=${currentAdvertisementID}`,
                      setLoadingDownload,
                      token,
                      "downloadApplicationExcelImageVerification",
                      `ImageVerification`,
                    )
                  }
                  startContent={<i className="fa-solid fa-download" />}
                >
                  Download Excel
                </Button> */}
                </>
              )}
              <Button
                isLoading={LoadingImgVerification}
                variant="shadow"
                color="primary"
                onPress={imageVerificationGetData}
                startContent={
                  isShowBtn ? (
                    <span className="material-symbols-rounded">how_to_reg</span>
                  ) : (
                    <span className="material-symbols-rounded">sync</span>
                  )
                }
              >
                {isShowBtn
                  ? "Start Image Verification"
                  : "Sync Image Verification"}
              </Button>
            </div>

            <Dropdown>
              <DropdownTrigger className="hidden mob:block">
                <Button variant="bordered">Action</Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Dropdown menu with shortcut"
                variant="flat"
              >
                <DropdownItem key="button">
                  <div className="col-span-1 flex justify-end gap-2 gap-x-1 md:col-span-2 mob:flex-col">
                    {!isShowBtn && (
                      <>
                        <Button
                          variant="shadow"
                          color="primary"
                          size="md"
                          className="me-2 w-full cursor-pointer px-5 py-2 md:w-fit"
                          isLoading={summaryLoading}
                          // onClick={() => DownloadImageQueue()}
                          startContent={
                            <i className="fa-solid fa-cloud-arrow-down" />
                          }
                        >
                          Download Images
                        </Button>
                        <DownloadExcelBtn
                          filterData={`advertisementId=${currentAdvertisementID}`}
                          selectedKeys={[]}
                          Data={[]}
                          api="downloadApplicationExcelImageVerification"
                          name="ImageVerification"
                          type={"ImageVerification"}
                          headerApi={CallGetTransactionExcelHeaders}
                        />
                        {/* <Button
                  variant="shadow"
                  color="primary"
                  size="md"
                  className="py-2 px-5 me-2 cursor-pointer w-full md:w-fit"
                  isLoading={loadingDownload}
                  onClick={() =>
                    DownloadExcelScreening(
                      `advertisementId=${currentAdvertisementID}`,
                      setLoadingDownload,
                      token,
                      "downloadApplicationExcelImageVerification",
                      `ImageVerification`,
                    )
                  }
                  startContent={<i className="fa-solid fa-download" />}
                >
                  Download Excel
                </Button> */}
                      </>
                    )}
                    <Button
                      isLoading={LoadingImgVerification}
                      variant="shadow"
                      color="primary"
                      onPress={imageVerificationGetData}
                      startContent={
                        isShowBtn ? (
                          <span className="material-symbols-rounded">
                            how_to_reg
                          </span>
                        ) : (
                          <span className="material-symbols-rounded">sync</span>
                        )
                      }
                    >
                      {isShowBtn
                        ? "Start Image Verification"
                        : "Sync Image Verification"}
                    </Button>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
            <GlobalAdvertisementFields
              value={currentAdvertisementID}
              setValue={(id: any) =>
                setFilterData({
                  ...filterData,
                  advertisementId: id,
                })
              }
            />
          </div> */}

          <Input
            placeholder="Candidate Id"
            className="rounded"
            value={filterData.candidateId}
            type="search"
            endContent={
              <span className="material-symbols-rounded">id_card</span>
            }
            onChange={(e: { target: { value: any } }) =>
              setFilterData({
                ...filterData,
                candidateId: e.target.value,
              })
            }
          />
          <Input
            placeholder="Candidate Name"
            className="rounded"
            value={filterData.candidate_name}
            type="search"
            endContent={
              <span className="material-symbols-rounded">person</span>
            }
            onChange={(e: { target: { value: any } }) =>
              setFilterData({
                ...filterData,
                candidate_name: e.target.value,
              })
            }
          />

          <FilterSearchBtn
            searchFunc={() => {
              setPage(1);
              if (page === 1) {
                GetData(true);
              }
            }}
            clearFunc={clearFilter}
          />
        </div>
      </FlatCard>

      <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {modelStatus === "imageView"
                  ? "Preview"
                  : `${modelStatus} Verify`}
              </ModalHeader>
              <ModalBody>
                {modelStatus === "imageView" ? (
                  <div className="flex justify-center">
                    <Image
                      src={documentUrl}
                      className="h-[500px]"
                      alt="profile"
                    />
                  </div>
                ) : (
                  <div>{`The ${modelStatus} Impression would be verified and will be updated for further use.`}</div>
                )}
              </ModalBody>
              <ModalFooter>
                {modelStatus === "imageView" ? (
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onClose();
                      setDocumentUrl("");
                      setModelStatus("");
                      setVerifyCheckboxData({});
                    }}
                  >
                    Close
                  </Button>
                ) : (
                  <div>
                    <Button
                      color="primary"
                      variant="light"
                      onPress={() => {
                        checkboxSelection(
                          verifyCheckboxData.e,
                          verifyCheckboxData.data,
                          verifyCheckboxData.status,
                          verifyCheckboxData.key,
                        );
                        onClose();
                      }}
                    >
                      Yes
                    </Button>

                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => {
                        onClose();
                        setDocumentUrl("");
                        setModelStatus("");
                        setVerifyCheckboxData({});
                      }}
                    >
                      No
                    </Button>
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="mainCardBody">
              <Table
                classNames={{
                  td: ["border-b-2"],
                  tr: ["border-b-2"],
                }}
                className="pt-4"
                topContent={
                  <>
                    <div className="flex w-full flex-col items-center justify-between md:flex-row mob:items-start">
                      <div className="flex flex-wrap gap-2 ">
                        <Button
                          color="warning"
                          isLoading={Loading && filterData.status === "pending"}
                          variant={
                            filterData.status === "pending" ? "solid" : "ghost"
                          }
                          onPress={() => {
                            handelFilter("pending");
                            setPage(1);
                          }}
                        >
                          {`Pending (${totalCount?.statusSummary?.pendingCount || 0})`}
                        </Button>

                        <Button
                          color="danger"
                          variant={
                            filterData.status === "reject"
                              ? "solid"
                              : "bordered"
                          }
                          isLoading={Loading && filterData.status === "reject"}
                          onPress={() => {
                            handelFilter("reject");
                            setPage(1);
                          }}
                        >
                          {`Reject (${totalCount?.statusSummary?.rejectCount || 0})`}
                        </Button>

                        <Button
                          color="success"
                          variant={
                            filterData.status === "accept" ? "solid" : "ghost"
                          }
                          isLoading={Loading && filterData.status === "accept"}
                          onPress={() => {
                            handelFilter("accept");
                            setPage(1);
                          }}
                        >
                          {`Verified (${totalCount?.statusSummary?.acceptCount || 0})`}
                        </Button>
                      </div>
                      <div className="flex items-center gap-x-1">
                        {filterData.status === "reject" && (
                          <Button
                            isLoading={LoadingReUpload}
                            variant="solid"
                            color="success"
                            onPress={ConvertRejectedScrutinyToPending}
                            className="me-2 px-4"
                          >
                            Allow Reupload
                          </Button>
                        )}
                        <p className="p-4 text-xl font-medium mob:px-1 mob:text-lg">
                          All Applications:{" "}
                          <span>
                            {totalCount?.statusSummary?.totalCount || 0}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-3">
                      <div className="lg:border-r-2">
                        <p className="text-sm">
                          Blurred = Photograph/Signature/Thumb is blurred
                        </p>
                      </div>
                      <div className="lg:border-r-2">
                        <p className="text-sm">
                          Background = Photograph/Signature/Thumb is without
                          white background
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">
                          Size = Photograph/Signature/Thumb size is not
                          according to instructions giving in the
                          prospectus{" "}
                        </p>
                      </div>
                    </div>
                  </>
                }
                bottomContent={
                  pages > 0 ? (
                    <div className="flex w-full justify-end">
                      <Pagination
                        showControls
                        showShadow
                        color="primary"
                        className="me-2"
                        page={page}
                        total={pages}
                        onChange={(page: any) => setPage(page)}
                      />
                      <Button
                        className="ms-2 w-fit"
                        color="primary"
                        isLoading={LoadingBtn}
                        onPress={() => updateImageStatus(Data)}
                      >
                        Save All
                      </Button>
                    </div>
                  ) : null
                }
              >
                <TableHeader>
                  <TableColumn key="candidateId">Candidate Details</TableColumn>
                  <TableColumn key="photo">Profile Image</TableColumn>
                  <TableColumn key="signature">Signature</TableColumn>
                  {/* <TableColumn key="thumb">Thumb</TableColumn> */}
                </TableHeader>
                <TableBody
                  items={Data}
                  emptyContent={"No data available!"}
                  loadingContent={<Spinner />}
                  loadingState={Loading ? "loading" : "idle"}
                >
                  {(item: any) => (
                    <TableRow key={item._id}>
                      {(columnKey: any) => (
                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyImage;
