"use client";
import {
  CallCreateEligibility,
  CallDeleteEligibility,
  CallEligibilityForPromotion,
  CallFindMasterByCodePromotion,
  CallSeniorityForPromotion,
  CallUpdateEligibilityForPromotion,
  CallUploadEligibilityPromotionData,
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
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
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
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import moment from "moment";
import { it } from "node:test";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};
type Employee = {
  _id?: string;
  id?: string;
  seniorityListSerialNo: string;
  eligibilityListSerialNo: string;
};

const EligibilityList = (props: Props) => {
  const [isCRReceived, setIsCRReceived] = useState("");
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [loader, setLoader] = useState<string>("");
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loaderDownload, setLoaderDownload] = useState<any>({
    excel: false,
    pdf: false,
  });
  const [filter, setFilter] = useState({
    senioritySearch: "",
    search: "",
    post: "",
    status: "",
    crReceived: "",
    dpcRecieved: "",
  });
  const [formData, setFormData] = useState<Employee>({
    seniorityListSerialNo: "",
    eligibilityListSerialNo: "",
  });
  const [statusData, setStatusData] = useState<any>({
    isDpcRecieved: false,
    iscrRecieved: false,
    name: undefined,
    id: "",
    remarks: "",
  });
  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onClose: onCloseUpload,
    onOpenChange: onOpenUpload,
  } = useDisclosure();
  const {
    isOpen: isCR,
    onOpen: onCR,
    onClose: onCloseCR,
    onOpenChange: onOpenCR,
  } = useDisclosure();
  const [data, setData] = useState<Employee[]>([]);
  const [seniorityList, setSeniorityList] = useState<any[]>([]);
  const [uploadFile, setUploadFile] = useState<any>([]);
  const [preview, setPreview] = useState<any>([]);
  const [isReceived, setIsReceived] = useState<boolean>(false);
  const [eventList, setEventList] = useState<any[]>([]);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  // const [advertisementId, setAdvertisementId] = useState<any>("");
  const { currentAdvertisementID } = useAdvertisement();

  useEffect(() => {
    getSeniorityListData();
    getEligibilityListData(false);
    getCourseListData("");
  }, []);

  useEffect(() => {
    if (currentAdvertisementID) {
      getEligibilityListData(true);
      getSeniorityListData();
      getCourseListData("");
    }
  }, [page, currentAdvertisementID]);

  const columns = [
    { title: "Seniority List Serial No.", key: "seniorityListSerialNo" },
    { title: "Eligibility List Serial No.", key: "eligibilityListSerialNo" },
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
    ...(isReceived
      ? [
          { title: "CR Received", key: "iscrRecieved" },
          { title: "DPC List Received", key: "isDpcRecieved" },
        ]
      : []),
    { title: "Status", key: "isPTCEligible" },
    { title: "Eligible", key: "eligibleForPromotion" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "dateOfBirth":
        return (
          <span className="text-nowrap">
            {cellValue ? moment(cellValue).format("DD-MM-YYYY") : "-"}
          </span>
        );
      case "promotionDate":
        return (
          <span className="text-nowrap">
            {cellValue ? moment(cellValue).format("DD-MM-YYYY") : "-"}
          </span>
        );
      case "recruitmentDate":
        return (
          <span className="text-nowrap">
            {cellValue ? moment(cellValue).format("DD-MM-YYYY") : "-"}
          </span>
        );
      case "iscrRecieved":
        return (
          <Chip
            variant="flat"
            color={cellValue ? "success" : "danger"}
            classNames={{ content: "capitalize" }}
          >
            {cellValue ? "Yes" : "No"}
          </Chip>
        );
      case "isDpcRecieved":
        return (
          <Chip
            variant="flat"
            color={cellValue ? "success" : "danger"}
            classNames={{ content: "capitalize" }}
          >
            {cellValue ? "Yes" : "No"}
          </Chip>
        );
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
      case "eligibleForPromotion":
        return (
          <Chip
            variant="flat"
            color={item?.eligibleForPromotion ? "success" : "danger"}
            classNames={{ content: "capitalize" }}
          >
            {item?.eligibleForPromotion ? "Yes" : "No"}
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
              {item?.eligibleForPromotion && (
                <>
                  <DropdownItem
                    key="iscrRecieved"
                    onPress={() => {
                      onCR();
                      setStatusData({
                        ...statusData,
                        iscrRecieved: item?.iscrRecieved ? "yes" : "no",
                        name: "iscrRecieved",
                        id: item?._id,
                      });
                    }}
                  >
                    Submit CR Received
                  </DropdownItem>
                  <DropdownItem
                    key="isDpcRecieved"
                    onPress={() => {
                      onCR();
                      setStatusData({
                        ...statusData,
                        isDpcRecieved: item?.isDpcRecieved ? "yes" : "no",
                        name: "isDpcRecieved",
                        id: item?._id,
                      });
                    }}
                  >
                    Submit DPC Received
                  </DropdownItem>
                </>
              )}
              <DropdownItem
                key="delete"
                onPress={() => handleDeleteEligibility(item?._id)}
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

  const getSeniorityListData = async () => {
    try {
      let params = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}`;
      if (formData?.seniorityListSerialNo) {
        params += `&search=${filter.senioritySearch}`;
      }
      const { data, error } = (await CallSeniorityForPromotion()) as any;
      console.log("CallSeniorityForPromotion", { data, error });

      if (data.status_code === 200) {
        setSeniorityList(data?.data?.seniorityData);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const getEligibilityListData = async (isFilter: boolean) => {
    try {
      const filterOn = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}&search=${filter?.search}&status=${filter?.status}&crReceived=${filter?.crReceived}&dpcRecieved=${filter?.dpcRecieved}`;
      const filterOff = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}`;
      let params = isFilter ? filterOn : filterOff;
      const { data, error } = (await CallEligibilityForPromotion(
        params,
      )) as any;
      console.log("CallEligibilityForPromotion", data);

      if (data?.status_code === 200) {
        setData(data?.data?.eligibiltyData);
        setTotalPage(data?.data?.totalPages);
        setIsReceived(data?.data?.isReceived);
      }

      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setTableLoading(false);
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
  const handleCreateEligibility = async (
    event: any,
    loaderType: string,
    eligibilityData: Employee,
  ) => {
    event.preventDefault();
    try {
      setLoader(loaderType);
      const formData: Employee = { ...eligibilityData };
      const { data, error } = (await CallCreateEligibility(formData)) as any;
      if (data?.status_code === 200 || data?.statu_code === 200) {
        toast.success(data?.message);
        resetFormAndCloseModal();
        getEligibilityListData(false);
      }
      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.error("Error in handleCreateEligibility:", error);
    } finally {
      setLoader("");
    }
  };
  const handleDeleteEligibility = async (eligibilityId: string) => {
    try {
      setLoader(eligibilityId);
      const formData = { id: eligibilityId };
      const { data, error, func } = (await CallDeleteEligibility(
        formData,
      )) as any;
      console.log("Request Data:", formData, data, error, func);

      if (data?.status_code === 200) {
        toast.success(data?.message);
        getEligibilityListData(false);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.error("Error in handleDeleteEligibility:", error);
    } finally {
      setLoader("");
    }
  };
  const resetFormAndCloseModal = () => {
    setFormData({
      seniorityListSerialNo: "",
      eligibilityListSerialNo: "",
    });
    setStatusData({
      isDpcRecieved: false,
      iscrRecieved: false,
      name: undefined,
      id: "",
      remarks: "",
    });
    setUploadFile([]);
    setPreview([]);
    onClose();
    onCloseCR();
    onCloseUpload();
  };
  const handleEligibilityCSV = async (loaderType: string, file: any) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const { data, error, func } = (await CallUploadEligibilityPromotionData(
        formData,
      )) as any;
      if (data?.status_code === 200) {
        toast.success(data?.message);
        resetFormAndCloseModal();
        getEligibilityListData(false);
        onCloseUpload();
        setIsLoading(false);
        setUploadFile([]);
        setPreview([]);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.error("Error in handleEligibilityCSV:", error);
    } finally {
      setLoader("");
    }
  };

  const handleUpdateStatus = async (loaderType: string, formData: any) => {
    try {
      setLoader(loaderType);
      const statusValue = formData[formData?.name] === "yes" ? true : false;
      const bodyData = {
        id: formData?.id,
        [formData?.name]: statusValue,
        remarks: formData.remarks,
      };
      const { data, error } = (await CallUpdateEligibilityForPromotion(
        bodyData,
      )) as any;

      if (data?.status_code === 200) {
        toast.success(data?.message);
        resetFormAndCloseModal();
        getEligibilityListData(false);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.error("Error in handleUpdateStatus:", error);
    } finally {
      setLoader("");
    }
  };
  const handleChangeST = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUploadFile([...newFiles]);
    setPreview([...newFiles]);
  };

  const handleSelectionChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      senioritySearch: "",
      search: "",
      post: "",
      status: "",
      crReceived: "",
      dpcRecieved: "",
    });
    getEligibilityListData(false);
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
            <div className="grid grid-cols-4 items-end gap-4 mob:grid-cols-1 mob:items-stretch tab:grid-cols-2">
              <Input
                placeholder="Search PNO , Father Name"
                type="search"
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
              <div className="">
                <Select
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
              </div>
              <div className="">
                <Select
                  label="CR Received"
                  labelPlacement="outside"
                  placeholder="Select"
                  selectedKeys={filter?.crReceived ? [filter.crReceived] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setFilter({ ...filter, crReceived: value });
                  }}
                >
                  <SelectItem key="yes">Yes</SelectItem>
                  <SelectItem key="no">No</SelectItem>
                </Select>
              </div>
              <div className="">
                <Select
                  label="DPC Received"
                  labelPlacement="outside"
                  placeholder="Select"
                  selectedKeys={filter?.dpcRecieved ? [filter.dpcRecieved] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setFilter({ ...filter, dpcRecieved: value });
                  }}
                >
                  <SelectItem key="yes">Yes</SelectItem>
                  <SelectItem key="no">No</SelectItem>
                </Select>
              </div>
              {/* <div className="">
              <Select
                label="Select Promotion"
                labelPlacement="outside"
                placeholder="Select"
                items={courseList}
                selectedKeys={[courseId]}
                onSelectionChange={(e: any) => {
                  const value = Array.from(e)[0] as string;
                  setCourseId(value);
                  getEventListData("workScope", value);
                }}
              >
                {(item) => (
                  <SelectItem key={item?._id} className="capitalize">
                    {item?.name}
                  </SelectItem>
                )}
              </Select>
            </div>
            <div className="">
              <Select
                label="Promotion Advertisement"
                labelPlacement="outside"
                placeholder="Select"
                isLoading={loader === "workScope"}
                isDisabled={loader === "workScope"}
                items={eventList}
                selectedKeys={advertisementId ? [advertisementId] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  setAdvertisementId(value);
                }}
              >
                {(item) => (
                  <SelectItem key={item._id} className="capitalize">
                    {`${item.advertisementNumberInEnglish} (${item.titleInEnglish})`}
                  </SelectItem>
                )}
              </Select>
            </div> */}

              {/* <Button
              isDisabled={!currentAdvertisementID}
              color="primary"
              onPress={() => {
                onOpen();
              }}
            >
              <span className="material-symbols-rounded">add</span>Add
              Eligibility List
            </Button>
            <Button
              color="primary"
              onPress={onUpload}
              isDisabled={!currentAdvertisementID}
            >
              <span className="material-symbols-rounded">upload</span>Upload
              Eligibility List
            </Button> */}
            </div>
            <div className="flex grid-cols-2 justify-between gap-2">
              <ExcelPdfDownload
                excelFunction={() => {
                  DownloadKushalExcel(
                    `v1/promotion/downloadEligibilitiesPromotionsfilterExcel?advertisementId=${currentAdvertisementID}&search=${filter?.search}&status=${filter?.status}&crReceived=${filter?.crReceived}&dpcRecieved=${filter?.dpcRecieved}`,
                    "Eligibility List",
                    setLoaderDownload,
                  );
                }}
                pdfFunction={() => {
                  DownloadKushalPdf(
                    `v1/promotion/downloadEligibilityPromotionPdf?advertisementId=${currentAdvertisementID}&search=${filter?.search}&status=${filter?.status}&crReceived=${filter?.crReceived}&dpcRecieved=${filter?.dpcRecieved}`,
                    "Eligibility List",
                    setLoaderDownload,
                  );
                }}
                excelLoader={loaderDownload?.excel}
                pdfLoader={loaderDownload?.pdf}
              />
              <FilterSearchBtn
                searchFunc={() => getEligibilityListData(true)}
                clearFunc={() => {
                  clearFilter();
                }}
              />
            </div>
          </>
        }
        bottomContent={
          <div className="flex justify-end">
            <Pagination
              showControls
              total={totalPage}
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
        isDismissable={false}
        onOpenChange={onOpenChange}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-2">
                Add Eligibility List
              </ModalHeader>
              <ModalBody className="gap-6">
                {" "}
                <form
                  onSubmit={(e) =>
                    handleCreateEligibility(e, "formSubmit", formData)
                  }
                  className="grid grid-cols-1"
                >
                  <div className="col mb-3">
                    <Autocomplete
                      defaultItems={seniorityList}
                      label="Select Employee from Seniority List"
                      inputValue={filter?.senioritySearch}
                      labelPlacement="outside"
                      placeholder="-- Select --"
                      onInputChange={(e) => {
                        setFilter({ ...filter, senioritySearch: e });
                      }}
                      onSelectionChange={(value: any) => {
                        setFormData({
                          ...formData,
                          seniorityListSerialNo: value,
                        });
                      }}
                    >
                      {(item) => (
                        <AutocompleteItem
                          key={item?._id}
                          className="capitalize"
                        >
                          {item?.seniorityListSerialNo}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  </div>
                  <div className="col mb-3">
                    <Input
                      type="text"
                      name="eligibilityListSerialNo"
                      value={formData?.eligibilityListSerialNo}
                      onChange={handleChange}
                      label="Eligibility List Serial No."
                      labelPlacement="outside"
                      placeholder="Enter eligibility list serial no."
                      endContent={
                        <span className="material-symbols-rounded">edit</span>
                      }
                    />
                  </div>
                  <div className="col mb-3">
                    <Button color="primary" type="submit" className="w-full">
                      Submit
                    </Button>
                  </div>
                </form>
              </ModalBody>
              {/* <ModalFooter>
                <Button color="primary" onPress={onClose} className="w-full">
                  Submit
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isUpload}
        isDismissable={false}
        onOpenChange={onOpenUpload}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload Eligibility List
              </ModalHeader>
              <ModalBody className="gap-6">
                <CustomMultipleUpload
                  title="Upload Data File"
                  sampleDownload={true}
                  sampleExcelUrl="/file/Promotion.xlsx"
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
                      handleEligibilityCSV("csv", uploadFile[0]);
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
      <Modal isOpen={isCR} onOpenChange={onOpenCR}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Submit {statusData?.name === "iscrRecieved" ? "CR" : "DPC List"}{" "}
                Received
              </ModalHeader>
              <ModalBody className="gap-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateStatus("statusSubmit", statusData);
                  }}
                  className="grid grid-cols-1"
                >
                  <div className="col mb-3">
                    <Select
                      items={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ]}
                      label="Is Received"
                      labelPlacement="outside"
                      isDisabled={loader === "statusSubmit"}
                      placeholder="Select"
                      name={statusData?.name}
                      selectedKeys={[statusData[statusData?.name]]}
                      onSelectionChange={(e) => {
                        const value = Array.from(e)[0] as any;
                        setStatusData({
                          ...statusData,
                          [statusData?.name]: value,
                        });
                      }}
                    >
                      {(item) => (
                        <SelectItem key={item?.value}>{item?.label}</SelectItem>
                      )}
                    </Select>
                  </div>
                  <div className="col mb-3">
                    <Textarea
                      label="Remark"
                      variant="bordered"
                      labelPlacement="outside"
                      value={statusData?.remarks}
                      onChange={(e) => {
                        setStatusData({
                          ...statusData,
                          remarks: e.target.value,
                        });
                      }}
                      readOnly={loader === "statusSubmit"}
                      placeholder="Enter remark"
                      isRequired={
                        statusData?.name &&
                        statusData[statusData?.name] === "no"
                      }
                      required={
                        statusData?.name &&
                        statusData[statusData?.name] === "no"
                      }
                    />
                  </div>
                  <div className="col mb-3">
                    <Button
                      color="primary"
                      type="submit"
                      // isDisabled={loader === "statusSubmit"}
                      isLoading={loader === "statusSubmit" ? true : false}
                      className="w-full"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </FlatCard>
  );
};

export default EligibilityList;
