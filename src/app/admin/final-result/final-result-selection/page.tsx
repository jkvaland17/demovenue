"use client";
import {
  CallGetAdvByCourse,
  CallGetAllCourses,
  CallGetAllWorkScope,
  CallGetVendorByAdvertisement,
  CallSaveFinalResultSelection,
  CallGetFinalResultById,
  CallVendorCredential,
  CallUploadDVPSTData,
  CallFinalResultUpload,
} from "@/_ServerActions";
import CustomMultipleUpload from "@/components/CustomMultipleUpload";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
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
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const VendorSelection = (props: Props) => {
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [allAdvertisements, setAllAdvertisements] = useState<any[]>([]);
  const [allVendors, setAllVendors] = useState<any[]>([]);
  const [allWorkScope, setAllWorkScope] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [loader, setLoader] = useState<any>({
    excel: false,
    pdf: false,
    Upload: false,
  });
  const [submitData, setSubmitData] = useState<any>({
    advertisementId: "",
    workScopeId: "",
    vendorId: "",
  });
  const [showError, setShowError] = useState<any>({
    courseId: false,
    advertisementId: false,
    workScopeId: false,
    vendorId: false,
  });
  const [vendorType, setVendorType] = useState<string>("");
  const {
    isOpen: Form,
    onOpen: onForm,
    onClose: onCloseForm,
    onOpenChange: onOpenForm,
  } = useDisclosure();
  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onClose: onCloseUpload,
    onOpenChange: onOpenUpload,
  } = useDisclosure();
  const [preview, setPreview] = useState<any>([]);
  const [uploadFile, setUploadFile] = useState<any>([]);
  const [eventId, setEventId] = useState<string>("");
  const [saveAdvertisementId, setSaveAdvertisementId] = useState<string>("");
  const [filterData, setFitlerData] = useState<any>({
    search: "",
  });

  const columns = [
    { title: "Event/Recruitment", key: "event" },
    { title: "Vendor", key: "vendor" },
    { title: "Type", key: "type" },
    // { title: "Added On", key: "addedOn" },
    { title: "Status", key: "status" },
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

  const statusColorMap: { [key: string]: ChipColor } = {
    Pending: "warning",
    "Request Initiated by Board": "success",
    "Data Provided by Vendor": "success",
  };

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "event":
        return <p>{item?.advertisementId?.titleInEnglish}</p>;
      case "vendor":
        return <p>{item?.vendorId?.vendorName}</p>;
      case "type":
        return <p>{item?.workScopeId?.workScopeTitle}</p>;
      case "addedOn":
        return (
          <p className="text-nowrap">
            {moment(item?.createdAt).format("DD-MM-YYYY")}
          </p>
        );
      case "actions":
        return (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="na"
                onPress={() => {
                  onUpload();
                  setEventId(item?.vendorId?._id);
                }}
              >
                Upload Candidates Data
              </DropdownItem>
              <DropdownItem
                key="na"
                onPress={() =>
                  emailSent(item?.vendorId?._id, item?.advertisementId?._id)
                }
              >
                Send Credential
              </DropdownItem>
              <DropdownItem
                key="view"
                onPress={() => {
                  onForm();
                  setVendorType(item?.vendorId?.uniqueToken);
                }}
              >
                View
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      case "status":
        return (
          <Chip color={statusColorMap[cellValue]} variant="flat" radius="full">
            {item?.status}
          </Chip>
        );
      default:
        return cellValue;
    }
  }, []);

  async function emailSent(id: string, saveAdvertisementId: string) {
    const query = `_id=${id}&type=final_result`;
    const { data, error } = (await CallVendorCredential(query)) as any;
    console.log("emailSent", { data, error });
    if (data?.statusCode === 200) {
      toast.success(data?.message);
      getVendorById(saveAdvertisementId, false);
    }
    if (error) {
      toast.error(error);
    }
  }

  const getAllCourse = async () => {
    try {
      const { data, error } = (await CallGetAllCourses()) as any;
      if (data) {
        setAllCourses(data?.data);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAdvertisements = async (courseId: string) => {
    try {
      const query = `parentMasterId=${courseId}`;
      const { data, error } = (await CallGetAdvByCourse(query)) as any;
      if (data) {
        setAllAdvertisements(data?.data);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllVendor = async (advertisementId: string) => {
    try {
      const query = `advertisementId=${advertisementId}&workScopeId=&search=&status=&page=1&limit=10`;
      const { data, error } = (await CallGetVendorByAdvertisement(
        query,
      )) as any;
      if (data) {
        setAllVendors(data?.data);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllWorkScope = async () => {
    try {
      const { data, error } = (await CallGetAllWorkScope()) as any;
      // console.log("CallGetAllPhysicalWorkScope",  data, error );
      if (data) {
        setAllWorkScope(data?.data?.records);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getVendorById = async (advertisementId: string, filter: boolean) => {
    setIsLoading(true);
    try {
      setSaveAdvertisementId(advertisementId);
      const filterON = `advertisementId=${advertisementId}&page=1&limit=10&search=${filterData?.search}`;
      const filterOFF = `advertisementId=${advertisementId}&page=1&limit=10`;
      const { data, error } = (await CallGetFinalResultById(
        filter ? filterON : filterOFF,
      )) as any;
      console.log("CallGetPhysicalById", data, error);

      if (data) {
        setAllData(data?.data);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const postVendorSelection = async () => {
    setIsSubmitting(true);
    try {
      console.log("submitData", submitData);
      const { data, error } = (await CallSaveFinalResultSelection(
        submitData,
      )) as any;
      // console.log("postVendorSelection", { data, error });

      if (data?.message) {
        toast.success(data?.message);
        getVendorById(saveAdvertisementId, false);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    getAllCourse();
    getAllWorkScope();
  }, []);

  const Upload = async (file: any) => {
    try {
      setLoader((prev: any) => ({
        ...prev,
        Upload: true,
      }));
      const formData = new FormData();
      formData.append("file", file);
      formData.append("vendorId", eventId);
      const { data, error, func } = (await CallFinalResultUpload(
        formData,
      )) as any;
      console.log("CallFinalResultUpload", { data, error });
      if (data) {
        toast.success(data?.message);
        getVendorById(saveAdvertisementId, false);
        onCloseUpload();
        setLoader((prev: any) => ({
          ...prev,
          Upload: false,
        }));
        setPreview([]);
      }
      if (error) {
        handleCommonErrors(error);
        setLoader((prev: any) => ({
          ...prev,
          Upload: false,
        }));
      }
    } catch (error) {
      console.error("Error in handleCreateSeniority:", error);
    } finally {
      setLoader("");
    }
  };

  const handleChange = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUploadFile([...newFiles]);
    setPreview([...newFiles]);
  };

  const clearFilter = () => {
    setFitlerData({
      search: "",
    });
    getVendorById(saveAdvertisementId, false);
  };

  return (
    <>
      <FlatCard heading="Final Result Selection">
        <div className="grid grid-cols-2 gap-4">
          <Select
            items={allCourses ?? []}
            label="Course"
            labelPlacement="outside"
            placeholder="Select"
            isRequired
            isInvalid={showError?.courseId ? true : false}
            errorMessage={"You must select a course."}
            onChange={(e) => {
              getAllAdvertisements(e.target.value);
            }}
          >
            {(item) => <SelectItem key={item?._id}>{item?.name}</SelectItem>}
          </Select>
          <Select
            items={allAdvertisements ?? []}
            label="Select Event/Recruitment"
            labelPlacement="outside"
            placeholder="Select"
            isRequired
            isInvalid={showError?.advertisementId ? true : false}
            errorMessage={"You must select a Event/Recruitment."}
            onChange={(e) => {
              setSubmitData((prev: any) => ({
                ...prev,
                advertisementId: e.target.value,
              }));
              getAllVendor(e.target.value);
              getVendorById(e.target.value, false);
            }}
            classNames={{
              label: "whitespace-nowrap",
            }}
          >
            {(item) => (
              <SelectItem key={item?._id}>{item?.titleInEnglish}</SelectItem>
            )}
          </Select>
          <Select
            items={allWorkScope ?? []}
            label="Work Scope"
            labelPlacement="outside"
            placeholder="Select"
            isRequired
            isInvalid={showError?.workScopeId ? true : false}
            errorMessage={"You must select a work scope."}
            onChange={(e) => {
              setSubmitData((prev: any) => ({
                ...prev,
                workScopeId: e.target.value,
              }));
            }}
          >
            {(item) => (
              <SelectItem key={item?._id}>{item?.workScopeTitle}</SelectItem>
            )}
          </Select>
          <Select
            items={allVendors ?? []}
            label="Select Vendor"
            labelPlacement="outside"
            placeholder="Select"
            isRequired
            isInvalid={showError?.vendorId ? true : false}
            errorMessage={"You must select a vendor."}
            onChange={(e) => {
              setSubmitData((prev: any) => ({
                ...prev,
                vendorId: e.target.value,
              }));
            }}
          >
            {(item) => (
              <SelectItem key={item?._id}>{item?.vendorName}</SelectItem>
            )}
          </Select>
          <div className="col-span-2 flex justify-end">
            <Button
              color="primary"
              variant="shadow"
              className="w-fit px-12 mob:w-full"
              isLoading={isSubmitting}
              onPress={postVendorSelection}
            >
              Select the Vendor
            </Button>
          </div>
        </div>
      </FlatCard>

      <Table
        isStriped
        topContent={
          <>
            <h2 className="text-xl font-semibold">
              Selected Final Result Table
            </h2>
            <div className="grid grid-cols-4 flex-col items-end gap-4 mob:flex">
              <Input
                placeholder="Search"
                className="w-[25%]"
                value={filterData?.search}
                onChange={(e) => {
                  setFitlerData((prev: any) => ({
                    ...prev,
                    search: e.target.value,
                  }));
                }}
                startContent={
                  <span className="material-symbols-rounded text-lg text-gray-500">
                    search
                  </span>
                }
              />
              {/* <ExcelPdfDownload
                excelFunction={() => {
                  DownloadKushalExcel(``, "Document verification", setLoader);
                }}
                pdfFunction={() => {
                  DownloadKushalPdf(``, "Document verification", setLoader);
                }}
                excelLoader={loader?.excel}
                pdfLoader={loader?.pdf}
              /> */}
              <FilterSearchBtn
                col="col-start-4 mob:col-start-2"
                searchFunc={() => {
                  getVendorById(saveAdvertisementId, true);
                }}
                clearFunc={clearFilter}
              />
            </div>
          </>
        }
        bottomContent={
          <div className="flex justify-end">
            <Pagination showControls total={1} initialPage={1} />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" ? "center" : "start"}
              className="text-wrap mob:text-nowrap"
            >
              {column.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={allData ?? []}
          emptyContent="No data"
          isLoading={isLoading}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item?._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={Form} onOpenChange={onOpenForm}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                View Security Code
              </ModalHeader>
              <ModalBody>{vendorType}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isUpload} onOpenChange={onOpenUpload} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload Candidates Data
              </ModalHeader>
              <ModalBody className="gap-6">
                <CustomMultipleUpload
                  title="Upload Data File"
                  sampleDownload={true}
                  sampleExcelUrl="/file/Final-Result.xlsx"
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
                  isLoading={loader?.Upload}
                  color="primary"
                  onPress={() => {
                    if (uploadFile.length) {
                      Upload(uploadFile[0]);
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
    </>
  );
};

export default VendorSelection;
