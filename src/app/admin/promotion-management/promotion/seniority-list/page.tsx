"use client";
import {
  CallCreateSeniority,
  CallDeleteSeniority,
  CallFindMasterByCode,
  CallFindMasterByCodePromotion,
  CallSeniorityForPromotion,
  CallUpdateScreeningApplicationStatus,
  CallUpdateSeniorityForPromotion,
  CallUploadSeniorityPromotionData,
  CallUserFindAllAdvertisement,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
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
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {};
type Employee = {
  _id?: string;
  id?: string;
  seniorityListSerialNo: string;
  employeeName: string;
  fatherName: string;
  pnoNumber: string;
  currentPosting: string;
  dateOfBirth: string;
  promotionDate: string;
  recruitmentDate: string;
  cadre: string;
  advertisementId?: string;
  promotionBasedDate?: string;
  isPTCEligible: string;
};

const SeniorityList = (props: Props) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [loader, setLoader] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loaderDownload, setLoaderrDownload] = useState<any>({
    excel: false,
    pdf: false,
  });
  const [filter, setFilter] = useState({
    search: "",
    post: "",
    status: "",
  });
  const [modelType, setModelType] = useState<string>("");
  const [formData, setFormData] = useState<Employee>({
    seniorityListSerialNo: "",
    employeeName: "",
    fatherName: "",
    pnoNumber: "",
    currentPosting: "",
    dateOfBirth: "",
    promotionDate: "",
    recruitmentDate: "",
    cadre: "",
    isPTCEligible: "",
  });

  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onClose: onCloseUpload,
    onOpenChange: onOpenUpload,
  } = useDisclosure();

  const [data, setData] = useState<Employee[]>([]);
  const [uploadFile, setUploadFile] = useState<any>([]);
  const [preview, setPreview] = useState<any>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [eventList, setEventList] = useState<any[]>([]);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  // const [advertisementId, setAdvertisementId] = useState<any>("");
  const { currentAdvertisementID } = useAdvertisement();

  // useEffect(() => {
  //   getSeniorityListData(false);
  //   // getCourseListData("showSkeleton");
  // }, []);

  useEffect(() => {
    getSeniorityListData(false);
  }, [page, currentAdvertisementID]);

  const columns = [
    { title: "Seniority List Serial No.", key: "seniorityListSerialNo" },
    { title: "Employee Name", key: "employeeName" },
    { title: "Father's Name", key: "fatherName" },
    { title: "PNO No.", key: "pnoNumber" },
    { title: "Current Posting", key: "currentPosting" },
    { title: "Home District", key: "homeDistrict" },
    { title: "Date of Birth", key: "dateOfBirth" },
    {
      title: "Date of Promotion to the Post of Head Constable",
      key: "promotionDate",
    },
    { title: "Date of Joining", key: "recruitmentDate" },
    { title: "Status", key: "isPTCEligible" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "dateOfBirth":
        return cellValue ? moment(cellValue).format("DD-MM-YYYY") : "-";
      case "promotionDate":
        return cellValue ? moment(cellValue).format("DD-MM-YYYY") : "-";
      case "recruitmentDate":
        return cellValue ? moment(cellValue).format("DD-MM-YYYY") : "-";
      case "isPTCEligible":
        return (
          <Chip
            variant="flat"
            color={cellValue === "PASS" ? "success" : "danger"}
            classNames={{ content: "capitalize" }}
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return loader === item?._id ? (
          <Spinner size="sm" color="danger" />
        ) : (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="view" onPress={() => openModal("view", item)}>
                View
              </DropdownItem>
              <DropdownItem key="edit" onPress={() => openModal("edit", item)}>
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                onPress={() => handleDeleteSeniority(item?._id)}
                color="danger"
                className="text-danger"
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const getSeniorityListData = async (isFilter: boolean) => {
    setTableLoading(true);
    try {
      const filterOn = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}&search=${filter?.search}&status=${filter?.status}`;
      const filterOff = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}`;
      let params = isFilter ? filterOn : filterOff;
      const { data, error } = (await CallSeniorityForPromotion(params)) as any;
      console.log("CallSeniorityForPromotion", data, error);
      if (data.status_code === 200) {
        setData(data?.data?.seniorityData);
        setTotalPage(data?.data?.totalPages);
        setTableLoading(false);
      }
      if (error) handleCommonErrors(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target as any;
    if (name === "pnoNumber" && value.length > 10) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSeniority = async (
    event: any,
    loaderType: string,
    seniorityData: Employee,
  ) => {
    event.preventDefault();
    try {
      setLoader(loaderType);
      let formData: Employee = { ...seniorityData };
      if (modelType === "create") {
        formData = {
          ...formData,
          advertisementId: currentAdvertisementID,
        };
      }
      if (seniorityData?._id && modelType === "edit") {
        formData["id"] = seniorityData._id;
      }
      delete formData._id;
      let response: any;
      if (modelType === "create") {
        response = (await CallCreateSeniority(formData)) as any;
      } else {
        response = (await CallUpdateSeniorityForPromotion(formData)) as any;
      }
      const { data, error } = response;
      if (data?.status_code === 200) {
        toast.success(data.message);
        resetFormAndCloseModal();
        getSeniorityListData(false);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.error("Error in handleCreateSeniority:", error);
    } finally {
      setLoader("");
    }
  };
  const handleDeleteSeniority = async (employeeId: string) => {
    try {
      setLoader(employeeId);
      const formData = { id: employeeId };
      const { data, error, func } = (await CallDeleteSeniority(
        formData,
      )) as any;
      console.log("Request Data:", formData, data, error, func);

      if (data?.status_code === 200) {
        toast.success(data?.message);
        getSeniorityListData(false);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.error("Error in handleCreateSeniority:", error);
    } finally {
      setLoader("");
    }
  };
  const resetFormAndCloseModal = () => {
    setFormData({
      seniorityListSerialNo: "",
      employeeName: "",
      fatherName: "",
      pnoNumber: "",
      currentPosting: "",
      dateOfBirth: "",
      promotionDate: "",
      recruitmentDate: "",
      cadre: "",
      isPTCEligible: "",
    });
    onClose();
  };

  const openModal = (modalType: string, employeeData?: Employee) => {
    if (employeeData) {
      setFormData({
        ...employeeData,
        dateOfBirth: employeeData?.dateOfBirth
          ? moment(employeeData.dateOfBirth).format("YYYY-MM-DD")
          : "",
        promotionDate: employeeData?.promotionDate
          ? moment(employeeData.promotionDate).format("YYYY-MM-DD")
          : "",
        recruitmentDate: employeeData?.recruitmentDate
          ? moment(employeeData.recruitmentDate).format("YYYY-MM-DD")
          : "",
      });
      console.log({
        ...employeeData,
        dateOfBirth: employeeData?.dateOfBirth
          ? moment(employeeData.dateOfBirth).format("YYYY-MM-DD")
          : "",
        promotionDate: employeeData?.promotionDate
          ? moment(employeeData.promotionDate).format("YYYY-MM-DD")
          : "",
        recruitmentDate: employeeData?.recruitmentDate
          ? moment(employeeData.recruitmentDate).format("YYYY-MM-DD")
          : "",
      });
    }
    setModelType(modalType);
    onOpen();
  };

  const handleSeniorityCSV = async (loaderType: string, file: any) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("advertisementId", currentAdvertisementID);
      const { data, error, func } = (await CallUploadSeniorityPromotionData(
        formData,
      )) as any;
      if (data?.status_code === 200) {
        toast.success(data?.message);
        getSeniorityListData(false);
        onCloseUpload();
        setIsLoading(false);
        setUploadFile([]);
        setPreview([]);
      }
      if (error) {
        handleCommonErrors(error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error in handleCreateSeniority:", error);
    } finally {
      setLoader("");
    }
  };

  const handleChangeST = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUploadFile([...newFiles]);
    setPreview([...newFiles]);
  };

  const getCourseListData = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallFindMasterByCodePromotion()) as any;
      console.log("CallFindMasterByCodePromotion", data, error);

      if (data.statu_code === 200) {
        setCourseList(data?.data);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };
  const getEventListData = async (loaderType: string, courseId: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallUserFindAllAdvertisement(
        `parentMasterId=${courseId}`,
      )) as any;
      console.log("CallUserFindAllAdvertisement", data, error);

      if (data?.message === "Success") {
        setEventList(data?.data);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const clearFilter = () => {
    setFilter({
      search: "",
      post: "",
      status: "",
    });
    getSeniorityListData(false);
  };

  return (
    <FlatCard heading="">
      <Table
        shadow="none"
        color="default"
        classNames={{
          wrapper: "p-1 overflow-auto scrollbar-hide",
        }}
        topContent={
          <>
            <div className="flex justify-between">
              <Input
                className="w-[25%]"
                placeholder="Search PNO , Father Name, Serial No"
                type="text"
                value={filter?.search}
                onChange={(e) => {
                  setFilter({ ...filter, search: e.target.value });
                  setPage(1);
                }}
                label="Search"
                labelPlacement="outside"
                endContent={
                  <span className="material-symbols-rounded">search</span>
                }
              />
              <Select
                className="w-[25%]"
                label="Status"
                labelPlacement="outside"
                placeholder="Select"
                selectedKeys={filter?.status ? [filter.status] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  setFilter({ ...filter, status: value });
                }}
              >
                <SelectItem key="pass">Pass</SelectItem>
                <SelectItem key="fail">Fail</SelectItem>
              </Select>
              <FilterSearchBtn
                searchFunc={() => getSeniorityListData(true)}
                clearFunc={() => {
                  clearFilter();
                }}
              />
              <ExcelPdfDownload
                excelFunction={() => {
                  DownloadKushalExcel(
                    `v1/promotion/downloadSenioritiesExcel?advertisementId=${currentAdvertisementID}&search=${filter?.search}&status=${filter?.status}`,
                    "Seniority List",
                    setLoaderrDownload,
                  );
                }}
                pdfFunction={() => {
                  DownloadKushalPdf(
                    `v1/promotion/downloadSenioritiesPDF?advertisementId=${currentAdvertisementID}&search=${filter?.search}&status=${filter?.status}`,
                    "Seniority List",
                    setLoaderrDownload,
                  );
                }}
                excelLoader={loaderDownload?.excel}
                pdfLoader={loaderDownload?.pdf}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                isDisabled={!currentAdvertisementID}
                color="primary"
                onPress={() => {
                  openModal("create");
                }}
              >
                <span className="material-symbols-rounded">add</span>Add
                Seniority Record
              </Button>
              <Button
                color="primary"
                onPress={onUpload}
                isDisabled={!currentAdvertisementID}
              >
                <span className="material-symbols-rounded">upload</span>Upload
                Seniority List
              </Button>
            </div>
          </>
        }
        bottomContent={
          totalPage > 1 ? (
            <div className="flex justify-end">
              <Pagination
                showControls
                total={totalPage}
                page={page}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : (
            ""
          )
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
          items={data}
          emptyContent="No data"
          isLoading={tableLoading}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={resetFormAndCloseModal}
        size="3xl"
        placement="top"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modelType === "create"
                  ? "Add"
                  : modelType === "edit"
                    ? "Update"
                    : "View"}{" "}
                Seniority List
              </ModalHeader>
              <ModalBody className="gap-10">
                <form
                  onSubmit={(e) =>
                    handleCreateSeniority(e, "formSubmit", formData)
                  }
                  className="grid grid-cols-1"
                >
                  <div className="col mb-3">
                    <Input
                      type="text"
                      name="seniorityListSerialNo"
                      value={formData?.seniorityListSerialNo}
                      onChange={handleChange}
                      disabled={modelType === "view"}
                      label="Seniority List Serial No."
                      labelPlacement="outside"
                      placeholder="Enter Seniority List Serial No."
                      endContent={
                        <span className="material-symbols-rounded">tag</span>
                      }
                    />
                  </div>
                  <div className="col mb-3">
                    <Input
                      type="text"
                      name="employeeName"
                      value={formData?.employeeName}
                      onChange={handleChange}
                      disabled={modelType === "view"}
                      label="Employees name"
                      labelPlacement="outside"
                      placeholder="Enter employees name"
                      endContent={
                        <span className="material-symbols-rounded">edit</span>
                      }
                    />
                  </div>
                  <div className="col mb-3">
                    <Input
                      type="text"
                      name="fatherName"
                      value={formData?.fatherName}
                      onChange={handleChange}
                      disabled={modelType === "view"}
                      label="Father’s name"
                      labelPlacement="outside"
                      placeholder="Enter father’s name"
                      endContent={
                        <span className="material-symbols-rounded">edit</span>
                      }
                    />
                  </div>
                  <div className="col mb-3">
                    <Input
                      type="text"
                      name="pnoNumber"
                      value={formData?.pnoNumber}
                      onChange={handleChange}
                      disabled={modelType === "view"}
                      label="PNO number"
                      labelPlacement="outside"
                      placeholder="Enter PNO number"
                      endContent={
                        <span className="material-symbols-rounded">edit</span>
                      }
                    />
                  </div>
                  <div className="col mb-3">
                    <Input
                      type="text"
                      name="currentPosting"
                      value={formData?.currentPosting}
                      onChange={handleChange}
                      disabled={modelType === "view"}
                      label="Current Posting"
                      labelPlacement="outside"
                      placeholder="Enter current posting"
                      endContent={
                        <span className="material-symbols-rounded">edit</span>
                      }
                    />
                  </div>
                  <div className="col mb-3">
                    <Input
                      type="text"
                      name="cadre"
                      value={formData?.cadre}
                      onChange={handleChange}
                      disabled={modelType === "view"}
                      label="Cadre"
                      labelPlacement="outside"
                      placeholder="Enter cadre name"
                      endContent={
                        <span className="material-symbols-rounded">edit</span>
                      }
                    />
                  </div>
                  <div className="col mb-3">
                    <Input
                      type="date"
                      name="dateOfBirth"
                      value={formData?.dateOfBirth}
                      onChange={handleChange}
                      disabled={modelType === "view"}
                      label="Date of Birth"
                      labelPlacement="outside"
                    />
                  </div>
                  <div className="col mb-3 mob:mt-3">
                    <Input
                      type="date"
                      name="promotionDate"
                      value={formData?.promotionDate}
                      onChange={handleChange}
                      disabled={modelType === "view"}
                      label="Date of Promotion to the Post of Head Constable"
                      labelPlacement="outside"
                    />
                  </div>
                  <div className="col mb-3">
                    <Input
                      type="date"
                      name="recruitmentDate"
                      value={formData?.recruitmentDate}
                      onChange={handleChange}
                      disabled={modelType === "view"}
                      label="Date of Joining"
                      labelPlacement="outside"
                    />
                  </div>
                  <div className="col mb-3">
                    <Select
                      name="isPTCEligible"
                      placeholder="Select PTC Eligibility"
                      label="PTC Eligibility"
                      labelPlacement="outside"
                      selectedKeys={
                        formData?.isPTCEligible ? [formData.isPTCEligible] : []
                      }
                      onChange={handleChange}
                      disabled={modelType === "view"}
                    >
                      <SelectItem key="PASS">PASS</SelectItem>
                      <SelectItem key="FAIL">FAIL</SelectItem>
                    </Select>
                  </div>

                  {modelType !== "view" ? (
                    <div className="button-container my-3">
                      <Button
                        color="primary"
                        isLoading={loader === "formSubmit"}
                        type="submit"
                        className="w-full"
                      >
                        Submit
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isUpload} onOpenChange={onOpenUpload} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload Seniority List
              </ModalHeader>
              <ModalBody className="gap-6">
                <CustomMultipleUpload
                  title="Upload Data File"
                  sampleDownload={true}
                  sampleExcelUrl="/file/Senority-List.csv"
                  preview={preview}
                  setPreview={setPreview}
                  handleChange={handleChangeST}
                  setValue={() => {}}
                  accept={""}
                  type="single"
                  name="file"
                  placeholder="Upload file"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={isLoading}
                  color="primary"
                  onPress={() => {
                    if (uploadFile.length) {
                      handleSeniorityCSV("csv", uploadFile[0]);
                    }
                  }}
                  className="w-full"
                >
                  Validate and Upload File
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </FlatCard>
  );
};

export default SeniorityList;
