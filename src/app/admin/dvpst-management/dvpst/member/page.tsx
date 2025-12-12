"use client";
import {
  CallCandidatesAbsent,
  CallDownloadDVPSTApplications,
  CallGetAllDVPSTApplications,
  CallGetAllKushalFilters,
  CallUpdateDVPSTPhysicalStanderdTest,
  CallUploadDVPSTData,
  CallUploadDVPSTSignature,
  CallUploadSeniorityPromotionData,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import PhysicalTest from "@/components/dvpst/PhysicalTest";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import CardAndTable from "@/components/kushal-components/loader/CardAndTable";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { RefreshCcw } from "lucide-react";
import moment from "moment";
import React, { Key, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const columns = [
  { title: "Registration No.", key: "regNo" },
  { title: "Roll No.", key: "rollNo" },
  // { title: "Rank", key: "rank" },
  { title: "Full name", key: "fullname" },
  { title: "Gender", key: "gender" },
  { title: "Center", key: "center" },
  { title: "Attendance", key: "attendance" },
  { title: "DV Status", key: "dvStatus" },
  { title: "PST Status", key: "pstStatus" },
  { title: "Signature Document Uploaded", key: "signature" },
  { title: "Actions", key: "actions" },
];

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const DVPSTMembers = () => {
  const { currentAdvertisementID } = useAdvertisement();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onOpenChange: onOpenUpload,
    onClose: onUploadClose,
  } = useDisclosure();
  const {
    isOpen: isUploadDvpst,
    onOpen: onUploaddvpst,
    onClose: onCloseUploaddvpst,
    onOpenChange: onOpenUploaddvpst,
  } = useDisclosure();
  const { setValue, register, control, handleSubmit } = useForm();

  const [applicationDatadata, setApplicationDataData] = useState<any>([]);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>([]);
  const [allFilters, setAllFilters] = useState<any>([]);
  const [uploadFile, setUploadFile] = useState<any>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [loader, setLoader] = useState<any>({
    table: false,
    page: false,
    signatureUpload: false,
    pst: false,
    document: false,
    dvpstUpload: false,
    candidateLoader: false,
  });
  const [filter, setFilter] = useState<any>({
    dvStatus: "",
    attendance: "",
    pstStatus: "",
    Post: "",
    searchValue: "",
  });
  const [preview, setPreview] = useState<any>([]);
  const [uploadFileDvpst, setUploadFileDvpst] = useState<any>([]);

  const handleChange = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUploadFileDvpst([...newFiles]);
    setPreview([...newFiles]);
  };

  const handleChangeST = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUploadFile([...newFiles]);
  };

  const statusColorMap: { [key: string]: ChipColor } = {
    Pending: "warning",
    Unfit: "danger",
    Absent: "danger",
    Fit: "success",
    Eligible: "success",
    Present: "success",
    Ineligible: "danger",
    Completed: "success",
    "": "warning",
  };

  const filterOptions = [
    {
      key: "Fit",
      name: "Fit",
    },
    {
      key: "Unfit",
      name: "Unfit",
    },
    {
      key: "Provisionally Fit",
      name: "Provisionally Fit",
    },
  ];

  const GetApplicationData = async (filters: boolean) => {
    setLoader((prev: any) => ({
      ...prev,
      page: true,
    }));
    try {
      const filterON = `page=${page}&limit=10&searchValue=${filter?.searchValue}&post=${filter?.Post}&dvStatus=${filter?.dvStatus}&attendance=${filter?.attendance}&pstStatus=${filter?.pstStatus}&advertisementId=${currentAdvertisementID}`;
      const filterOFF = `page=${page}&limit=10&searchValue=&dvStatus=&attendance=&pstStatus=&advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetAllDVPSTApplications(
        filters ? filterON : filterOFF,
      )) as any;
      console.log("CallGetAllDVPSTApplications", data, error);
      if (data) {
        setApplicationDataData(data);
        setTotalPages(data?.totalPages);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        page: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        page: false,
      }));
    }
  };

  const SignatureUpload = async (id: string) => {
    const formData = new FormData();
    formData.append("file", uploadFile[0]);
    formData.append("_id", id);

    setLoader((prev: any) => ({
      ...prev,
      signatureUpload: true,
    }));
    try {
      const { data, error } = (await CallUploadDVPSTSignature(formData)) as any;
      if (data?.message) {
        toast.success(data?.message);
        GetApplicationData(false);
        onUploadClose();
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        signatureUpload: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        cards: false,
      }));
    }
  };

  const getAllFilters = async () => {
    try {
      const { data, error } = (await CallGetAllKushalFilters()) as any;
      console.log("filterResponse", { data, error });
      if (data) {
        setAllFilters(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const clearFilter = () => {
    setFilter({
      dvStatus: "",
      attendance: "",
      pstStatus: "",
      Post: "",
      searchValue: "",
    });
    GetApplicationData(false);
  };

  const totalDVPST = [
    {
      title: "Total Applications",
      value: applicationDatadata?.totalApplications,
    },
  ];
  const dvDetails = [
    {
      title: "Total Eligible Candidates in Document Verification",
      value:
        applicationDatadata?.applicationStatictics?.totalEligibleCandidates,
    },
    {
      title: "Total Remaining Candidates in Document Verification",
      value:
        applicationDatadata?.applicationStatictics?.totalInProcessCandidates,
    },
    {
      title: "Total Ineligible Candidates in Document Verification",
      value:
        applicationDatadata?.applicationStatictics?.totalIneligibleCandidates,
    },
  ];

  const pstDetails = [
    {
      title: "Total Eligible Candidates in Physical Standard Test",
      value:
        applicationDatadata?.applicationStatictics?.totalPstEligibleCandidates,
    },
    {
      title: "Total Remaining Candidates in Physical Standard Test",
      value:
        applicationDatadata?.applicationStatictics?.totalPstInProcessCandidates,
    },
    {
      title: "Total In-Eligible Candidates in Physical Standard Test",
      value:
        applicationDatadata?.applicationStatictics
          ?.totalPstIneligibleCandidates,
    },
  ];

  const applicationDownload = async (id: string) => {
    try {
      setLoader((prev: any) => ({
        ...prev,
        document: true,
      }));
      const query = `applicationId=${id}`;
      const { data, error } = (await CallDownloadDVPSTApplications(
        query,
      )) as any;
      console.log("CallDownloadDVPSTApplications", data, error);
      if (data?.fileUrl) {
        toast.success(data?.message);
        setLoader((prev: any) => ({
          ...prev,
          document: false,
        }));
        window.open(data?.fileUrl, "_blank");
      } else {
        console.error("Invalid response or missing download URL");
        setLoader((prev: any) => ({
          ...prev,
          document: false,
        }));
      }
    } catch (err) {
      console.error("Error downloading application:", err);
    }
  };

  const renderCell = React.useCallback(
    (item: any, columnKey: Key, index: number) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "regNo":
          return (
            <p className="text-nowrap uppercase">
              {item?.userDetails?.candidateId}
            </p>
          );
        case "rollNo":
          return (
            <p className="text-nowrap uppercase">
              {item?.admitCardDetails?.rollNo}
            </p>
          );
        case "rank":
          return <p className="text-nowrap uppercase">-</p>;
        case "fullname":
          return (
            <p className="text-nowrap uppercase">
              {item?.applicationDetails?.personalDetails?.fullName}
            </p>
          );
        case "gender":
          return (
            <p className="text-nowrap uppercase">
              {item?.applicationDetails?.personalDetails?.gender}
            </p>
          );
        case "center":
          return (
            <p className="max-w-[150px] truncate text-nowrap uppercase">
              {item?.center?.school_name}
            </p>
          );
        case "attendance":
          return (
            <Chip
              variant="flat"
              color={statusColorMap[item?.candidateStatus]}
              classNames={{ content: "capitalize" }}
            >
              {item?.candidateStatus}
            </Chip>
          );
        case "dvStatus":
          return (
            <Chip
              variant="flat"
              color={statusColorMap[item?.applicationStatus || "Pending"]}
              classNames={{ content: "capitalize" }}
            >
              {item?.applicationStatus || "Pending"}
            </Chip>
          );
        case "pstStatus":
          return (
            <Chip
              variant="flat"
              color={statusColorMap[item?.PSTStatus]}
              classNames={{ content: "capitalize" }}
            >
              {item?.PSTStatus}
            </Chip>
          );
        case "signature":
          return (
            <Chip
              variant="flat"
              color={statusColorMap[item?.dvpstSignatureStatus]}
              classNames={{ content: "capitalize" }}
            >
              {item?.dvpstSignatureStatus}
            </Chip>
          );
        case "actions":
          return (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button className="more_btn min-w-[40px] rounded-full px-0">
                  <span className="material-symbols-rounded">more_vert</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="dv"
                  href={`/admin/dvpst-management/dvpst/member/document-verification/${
                    item?.applicationDetails?._id
                  }`}
                >
                  Document Verification
                </DropdownItem>
                <DropdownItem
                  key="pst"
                  onPress={() => {
                    onOpen();
                    setSelectedUserDetails(item);
                  }}
                >
                  Physical Standard Test
                </DropdownItem>
                {item?.applicationStatus === "Fit" ? (
                  <>
                    <DropdownItem
                      key="dvap"
                      isDisabled={loader?.document}
                      onPress={() =>
                        applicationDownload(item?.applicationDetails?._id)
                      }
                    >
                      Download DV Report
                    </DropdownItem>
                  </>
                ) : null}
                <DropdownItem
                  key="print"
                  href={`/admin/dvpst-management/dvpst/candidate-verification/${
                    item?.applicationDetails?._id
                  }`}
                >
                  Print DV/PST Final Document
                </DropdownItem>
                <DropdownItem
                  key="signature"
                  onPress={() => {
                    onOpenUpload();
                    setSelectedUserDetails(item);
                  }}
                >
                  Upload Signature Document
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  useEffect(() => {
    getAllFilters();
    if (currentAdvertisementID) {
      GetApplicationData(false);
    }
  }, [currentAdvertisementID]);

  useEffect(() => {
    if (currentAdvertisementID) {
      GetApplicationData(false);
    }
  }, [page]);

  const dvpstUpload = async (loaderType: string, file: any) => {
    try {
      setLoader((prev: any) => ({
        ...prev,
        dvpstUpload: true,
      }));
      const formData = new FormData();
      formData.append("excel", file);
      formData.append("advertisementId", currentAdvertisementID);
      const { data, error, func } = (await CallUploadDVPSTData(
        formData,
      )) as any;
      console.log("CallUploadDVPSTData", { data, error });
      if (data) {
        toast.success(data?.message);
        GetApplicationData(false);
        onCloseUploaddvpst();
        setLoader((prev: any) => ({
          ...prev,
          dvpstUpload: false,
        }));
        setUploadFileDvpst([]);
        setPreview([]);
      }
      if (error) {
        handleCommonErrors(error);
        setLoader((prev: any) => ({
          ...prev,
          dvpstUpload: false,
        }));
      }
    } catch (error) {
      console.error("Error in handleCreateSeniority:", error);
    } finally {
      setLoader("");
    }
  };

  const candidatesAbsent = async () => {
    try {
      setLoader((prev: any) => ({
        ...prev,
        candidateLoader: true,
      }));
      const payload = { advertisementId: currentAdvertisementID };
      const { data, error } = (await CallCandidatesAbsent(payload)) as any;
      if (data) {
        toast.success(data?.message);
        GetApplicationData(false);
        setLoader((prev: any) => ({
          ...prev,
          candidateLoader: false,
        }));
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      {loader?.page ? (
        <div className="rounded-lg border bg-white p-5">
          <CardAndTable
            cardCount={5}
            filterCount={5}
            tableColumns={5}
            tableRows={10}
          />
        </div>
      ) : (
        <div>
          <FlatCard heading="Document Verification and Physical Standard Test">
            <CardGrid data={totalDVPST} columns={3} />
            <h2 className="mb-3 mt-6 text-xl font-semibold">
              Document Verification
            </h2>
            <CardGrid data={dvDetails} columns={3} />

            <h2 className="mb-3 mt-6 text-xl font-semibold">
              Physical Standard Test
            </h2>
            <CardGrid data={pstDetails} columns={3} />
          </FlatCard>

          <Table
            className="my-6"
            color="default"
            topContent={
              <>
                <div className="grid grid-cols-4 items-end gap-4 mob:grid-cols-1">
                  <Select
                    items={[
                      {
                        key: "Present",
                        name: "Present",
                      },
                      {
                        key: "Absent",
                        name: "Absent",
                      },
                    ]}
                    label="Attendance"
                    selectedKeys={[filter?.attendance]}
                    labelPlacement="outside"
                    placeholder="Select"
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        attendance: e.target.value,
                      });
                    }}
                  >
                    {(item) => (
                      <SelectItem key={item?.key}>{item?.name}</SelectItem>
                    )}
                  </Select>
                  <Select
                    items={filterOptions}
                    label="DV Status"
                    selectedKeys={[filter?.dvStatus]}
                    labelPlacement="outside"
                    placeholder="Select"
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        dvStatus: e.target.value,
                      });
                    }}
                  >
                    {(item) => (
                      <SelectItem key={item?.key}>{item?.name}</SelectItem>
                    )}
                  </Select>
                  <Select
                    items={filterOptions}
                    label="PST Status"
                    selectedKeys={[filter?.pstStatus]}
                    labelPlacement="outside"
                    placeholder="Select"
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        pstStatus: e.target.value,
                      });
                    }}
                  >
                    {(item) => (
                      <SelectItem key={item?.key}>{item?.name}</SelectItem>
                    )}
                  </Select>
                  <Select
                    items={
                      allFilters?.postNames?.filter(
                        (post: any) => post?.postName,
                      ) || []
                    }
                    selectedKeys={[filter?.Post]}
                    label="Post"
                    labelPlacement="outside"
                    placeholder="Select"
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        Post: e.target.value,
                      });
                    }}
                  >
                    {(item: any) => (
                      <SelectItem key={item?._id} value={item?._id}>
                        {item?.postName}
                      </SelectItem>
                    )}
                  </Select>
                  <Input
                    placeholder="Search"
                    value={filter.searchValue}
                    type="text"
                    endContent={
                      <span className="material-symbols-rounded">search</span>
                    }
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        searchValue: e.target.value,
                      })
                    }
                  />
                  <ExcelPdfDownload
                    excelFunction={() => {
                      DownloadKushalExcel(
                        `v1/ApplicationScreening/downloadDvpstExcel?searchValue=${filter?.searchValue}&post=${filter?.Post}&dvStatus=${filter?.dvStatus}&attendance=${filter?.attendance}&pstStatus=${filter?.pstStatus}&advertisementId=${currentAdvertisementID}`,
                        "Document verification",
                        setLoader,
                      );
                    }}
                    pdfFunction={() => {
                      DownloadKushalPdf(
                        `v1/ApplicationScreening/downloadDvpstPdf?searchValue=${filter?.searchValue}&post=${filter?.Post}&dvStatus=${filter?.dvStatus}&attendance=${filter?.attendance}&pstStatus=${filter?.pstStatus}&advertisementId=${currentAdvertisementID}`,
                        "Document verification",
                        setLoader,
                      );
                    }}
                    excelLoader={loader?.excel}
                    pdfLoader={loader?.pdf}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      color="primary"
                      variant="shadow"
                      onPress={() => GetApplicationData(true)}
                      startContent={
                        <span className="material-symbols-rounded">
                          filter_list
                        </span>
                      }
                    >
                      <span className="mob:hidden"> Filter</span>
                    </Button>
                    <Button
                      color="danger"
                      variant="bordered"
                      onPress={() => clearFilter()}
                    >
                      <span
                        className="material-symbols-rounded text-danger"
                        style={{ color: "#f42f73" }}
                      >
                        close
                      </span>{" "}
                      <span className="mob:hidden"> Clear filters</span>
                    </Button>
                  </div>
                  <Button
                    color="primary"
                    variant="shadow"
                    onPress={onUploaddvpst}
                  >
                    <span className="mob:hidden">
                      {" "}
                      Upload DVPST Candidates List
                    </span>
                  </Button>
                </div>
                <div className="flex justify-end">
                  <Tooltip content="Mark the rest of pending candidates absent">
                    <Button
                      color="danger"
                      size="sm"
                      isLoading={loader?.candidateLoader}
                      onPress={candidatesAbsent}
                    >
                      {loader?.candidateLoader ? "" : <RefreshCcw size={20} />}
                    </Button>
                  </Tooltip>
                </div>
              </>
            }
            bottomContent={
              <div className="flex justify-end">
                <Pagination
                  showControls
                  total={totalPages}
                  initialPage={1}
                  page={page}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  align={column.key === "actions" ? "center" : "start"}
                >
                  {column.title}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody>
              {applicationDatadata?.applications?.map(
                (item: any, index: number) => (
                  <TableRow key={item._id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCell(item, columnKey, index)}
                      </TableCell>
                    )}
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>

          <PhysicalTest
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
            selectedUserDetails={selectedUserDetails}
            statusColorMap={statusColorMap}
            GetApplicationData={GetApplicationData}
          />

          <Modal isOpen={isUpload} onOpenChange={onOpenUpload} size="3xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Upload Signature Document
                  </ModalHeader>
                  <ModalBody>
                    <div className="grid grid-cols-2 gap-6 mob:grid-cols-1">
                      <div className="flex gap-2">
                        <p className="font-medium">
                          Document Verification Status:{" "}
                        </p>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={
                            statusColorMap[
                              selectedUserDetails?.applicationStatus ||
                                "Pending"
                            ]
                          }
                          classNames={{ content: "capitalize" }}
                        >
                          {selectedUserDetails?.applicationStatus || "Pending"}
                        </Chip>
                      </div>
                      <div className="flex gap-2">
                        <p className="font-medium">
                          Physical Standard Test Status:{" "}
                        </p>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={statusColorMap[selectedUserDetails?.PSTStatus]}
                          classNames={{ content: "capitalize" }}
                        >
                          {selectedUserDetails?.PSTStatus}
                        </Chip>
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-2 mob:grid-cols-1">
                      <h5 className="font-bold">Candidate details</h5>
                      <div className="grid grid-cols-2 gap-6">
                        <p className="font-medium">
                          <span className="material-symbols-rounded me-2 align-bottom">
                            person
                          </span>
                          Registration ID
                        </p>
                        <p>
                          {selectedUserDetails?.applicationDetails?.register}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <p className="font-medium">
                          <span className="material-symbols-rounded me-2 align-bottom">
                            person
                          </span>
                          Roll No.
                        </p>
                        <p>{selectedUserDetails?.admitCardDetails?.rollNo}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <p className="font-medium">
                          <span className="material-symbols-rounded me-2 align-bottom">
                            person
                          </span>
                          Candidate Name
                        </p>
                        <p className="uppercase">
                          {
                            selectedUserDetails?.applicationDetails
                              ?.personalDetails?.fullName
                          }
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <p className="font-medium">
                          <span className="material-symbols-rounded me-2 align-bottom">
                            person
                          </span>
                          Gender
                        </p>
                        <p className="uppercase">
                          {
                            selectedUserDetails?.applicationDetails
                              ?.personalDetails?.gender
                          }
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <p className="font-medium">
                          <span className="material-symbols-rounded me-2 align-bottom">
                            calendar_today
                          </span>
                          Date of Birth
                        </p>
                        <p>
                          {moment(
                            selectedUserDetails?.personalDetails?.dateOfBirth,
                          ).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>

                    <div>
                      <CustomMultipleUpload
                        {...register("file")}
                        preview={uploadFile}
                        setPreview={setUploadFile}
                        handleChange={handleChangeST}
                        setValue={setValue}
                        accept={".jpeg,.png,.jpg"}
                        name="Attachments"
                        placeholder="Upload Signature"
                        type={"single"}
                      />
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      isLoading={loader?.signatureUpload}
                      color="primary"
                      onPress={() => {
                        SignatureUpload(selectedUserDetails?._id);
                      }}
                      className="w-full"
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>

          <Modal
            isOpen={isUploadDvpst}
            onOpenChange={onOpenUploaddvpst}
            size="xl"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Upload DVPST Candidates List
                  </ModalHeader>
                  <ModalBody className="gap-6">
                    <CustomMultipleUpload
                      title="Upload Data File"
                      sampleDownload={true}
                      sampleExcelUrl="/file/dvpst_candidates.xlsx"
                      preview={preview}
                      setPreview={setPreview}
                      handleChange={handleChange}
                      setValue={() => {}}
                      accept={".xlsx"}
                      type="single"
                      name="file"
                      placeholder="Upload file"
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      isLoading={loader?.dvpstUpload}
                      color="primary"
                      onPress={() => {
                        if (uploadFileDvpst.length) {
                          dvpstUpload("csv", uploadFileDvpst[0]);
                        }
                      }}
                      className="w-full"
                    >
                      Upload File
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      )}
    </>
  );
};

export default DVPSTMembers;
