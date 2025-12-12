"use client";
import {
  Modal,
  Button,
  Card,
  CardBody,
  ModalContent,
  ModalHeader,
  ModalBody,
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
  ModalFooter,
  Input,
  Chip,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Textarea,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import {
  CallAdmitCardDownload,
  CallFindAllAdvertisement,
  CallGetAdmitCard,
  CallGetAdvByCourse,
  CallGetAllCenters,
  CallGetAllCentersAdmitCard,
  CallGetAllDistricts,
  CallGetAllExamTypeData,
  CallGetPublishDates,
  CallGetStates,
  CallNotifyUserForAdmitCard,
  CallPublishAdmitCard,
  CallRescheduleAdmitCard,
  CallUpdateAdmitCardStatus,
} from "@/_ServerActions";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { AdmitCardDownload } from "@/Utils/AdmitCardDownload";
import moment, { isDate } from "moment";
import ScreenLoader from "@/components/ScreenLoader";
import GlobalAdvertisementFields from "@/components/Fields";
import CardGrid from "@/components/kushal-components/CardGrid";
import FlatCard from "@/components/FlatCard";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import { useSessionData } from "@/Utils/hook/useSessionData";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Controller, set, useForm } from "react-hook-form";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import UseMasterByCodeSelect from "@/components/Adhiyaachan/UseMasterByCodeSelect";
import { MasterCode } from "@/app/admin/adhiyaachan-advertisement/adhiyaachan-submission/types";

type FilterData = {
  candidateId: string;
  candidate_name: string;
  email: string;
  phone: string;
  rollNo: string;
  advertisement_noId: string | any;
  specialityId: string | any;
  stage: string | any;
};

const Add = () => {
  const { currentAdvertisementID } = useAdvertisement();
  const { token } = useSessionData();
  const { isOpen: isTableOpen, onOpenChange: onTableChange } = useDisclosure();
  const { isOpen: isTableObjOpen, onOpenChange: onTableObjChange } =
    useDisclosure();
  const {
    isOpen: isReschedule,
    onOpen: onReschedule,
    onOpenChange: onOpenReschedule,
    onClose,
  } = useDisclosure();
  const {
    isOpen: isPublish,
    onOpen: onPublish,
    onOpenChange: onOpenPublish,
  } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<any>(false);
  const [isDateLoading, setIsDateLoading] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });
  const [count, setCount] = useState<any>({});
  const [allAdmitCard, setAllAdmitCard] = useState<any>([]);
  const [historyData, setHistoryData] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>("");
  const [allDates, setAllDates] = useState<any>([]);
  const [filterData, setFilterData] = useState({
    candidateId: "",
    candidate_name: "",
    phone: "",
    rollNo: "",
    // stage:""
  });
  const [selectedShift, setSelectedShift] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<any>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const [isDistrictLoading, setIsDistrictLoading] = useState<boolean>(false);
  const [isCenterLoading, setIsCenterLoading] = useState<boolean>(false);
  const [currentApplication, setCurrentApplication] = useState<any>(null);
  const [allMaster, setAllMaster] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const getStates = async () => {
    try {
      const { data, error } = (await CallGetStates()) as any;
      console.log("getStates", { data, error });

      if (data) {
        setStates(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    if (currentUser) DownloadAdmitCard(currentUser);
  }, [currentUser]);

  const getAllDistricts = async (stateId: string) => {
    setIsDistrictLoading(true);
    try {
      const query = `stateId=${stateId}`;
      const { data, error } = (await CallGetAllDistricts(query)) as any;
      console.log("getAllDistricts", { data, error });

      if (data) {
        setDistricts(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsDistrictLoading(false);
  };

  const getAllCenters = async (district: string) => {
    setIsCenterLoading(true);
    try {
      const query = `advertisementId=${currentApplication?.advertisment}&masterDataIds=${currentApplication?.examType}&district=${district}`;
      const { data, error } = (await CallGetAllCentersAdmitCard(query)) as any;
      console.log("getAllCenters", { data, error });

      if (data) {
        setCenters(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsCenterLoading(false);
  };

  const sendNotifyUserForAdmitCard = async () => {
    try {
      setIsLoading(true);
      const dto = { advertisementId: currentAdvertisementID } as any;
      // allAdmitCard.map((item: any) => {
      //   dto.ids.push(item?._id);
      // });
      const data = (await CallNotifyUserForAdmitCard(dto)) as any;
      if (data?.data?.message === "success") {
        toast.success("Successfully send");
        onTableObjChange();
      }
      if (data?.error) {
        toast.error(data.error);
      }
      setIsLoading(false);
    } catch (e) {
      console.log("e::: ", e);
    }
  };

  const DownloadAdmitCard = async (id: any) => {
    AdmitCardDownload(id, "admitCard", token, setLoading, "AdmitCard.pdf");
  };

  const GetAdmitCardData = async (isFilter: boolean) => {
    try {
      setLoading(true);
      const filterOn = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}&candidateId=${filterData?.candidateId}&candidate_name=${filterData?.candidate_name}&phone=${filterData?.phone}&roll_no=${filterData?.rollNo}&examType=${watch("masterDataIds")}`;
      const filterOff = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}`;
      const query = isFilter ? filterOn : filterOff;
      const { data, error } = (await CallGetAdmitCard(query)) as any;
      console.log("GetAdmitCardData", { data, error });
      if (data?.data) {
        setAllAdmitCard(data.data);
        setTotalPage(data?.pagination?.totalPages);
        setPage(data?.pagination?.page);
        setCount({ ...data?.downloadSummary, totalCounts: data?.totalCounts });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setFilterData({
      candidateId: "",
      candidate_name: "",
      phone: "",
      rollNo: "",
    });
    setValue("masterDataIds", "");
    if (currentAdvertisementID) {
      GetAdmitCardData(false);
    }
  };

  useEffect(() => {
    if (currentAdvertisementID) {
      GetAdmitCardData(false);
      getAllExamType();
    }
  }, [currentAdvertisementID, page]);

  const downloadAdmitCardFile = (fileUrl: string) => {
    if (!fileUrl) return;
    console.log("fileUrl", fileUrl);
    window.open(fileUrl, "_blank");
    // const link = document.createElement("a");
    // link.href = fileUrl;
    // link.setAttribute("download", "admit_card.pdf");
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  const downloadAdmitCard = async (id: string) => {
    try {
      setLoading(true);
      // console.log("id", id);

      const obj = { applicationId: id };
      const { data, error } = (await CallAdmitCardDownload(obj)) as any;
      console.log({ data, error });

      if (data) {
        downloadAdmitCardFile(data?.fileUrl);
      }
      if (error) {
        toast.error(error);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const renderCell = useCallback((dataRows: any, columnKey: React.Key) => {
    // console.log("dataRows", dataRows);
    switch (columnKey) {
      case "rollNo":
        return <p>{dataRows?.rollNo || "-"}</p>;
      case "candidateId":
        return <p>{dataRows?.USER_ID?.candidateId || "-"}</p>;
      case "name":
        return <p className="capitalize">{dataRows?.USER_ID?.name || "-"}</p>;
      case "email":
        return <p>{dataRows?.USER_ID?.email || "-"}</p>;
      case "phone":
        return <p>{dataRows?.USER_ID?.phone || "-"}</p>;
      case "fatherName":
        return <p>{dataRows?.USER_ID?.fatherName || "-"}</p>;
      case "gender":
        return <p className="capitalize">{dataRows?.USER_ID?.gender || "-"}</p>;
      case "dob":
        return (
          <p>{moment(dataRows?.USER_ID?.dateOfBirth).format("DD-MM-YYYY")}</p>
        );
      case "centerAddress":
        return <p>{dataRows?.CENTER_NAME || "-"}</p>;

      case "DOWNLOAD_COUNT":
        return (
          <span
            className={`inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20`}
          >
            {dataRows?.DOWNLOAD_COUNT || "-"}
          </span>
        );
      case "Action":
        return (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="donwload"
                onPress={() => {
                  downloadAdmitCard(dataRows?.application?._id);
                }}
              >
                Download Admit Card
              </DropdownItem>
              <DropdownItem
                key="reschedule"
                onPress={() => {
                  setCurrentApplication(dataRows);
                  onReschedule();
                }}
              >
                Reschedule Admit Card
              </DropdownItem>
              <DropdownItem
                key="hold"
                onPress={() => {
                  holdCandidate(dataRows?._id);
                }}
              >
                Hold this Candidate
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
    }
  }, []);

  // Pagination
  const rowsPerPage = 10;
  const pages = Math.ceil(count?.totalCounts / rowsPerPage);

  const cardData = [
    {
      title: "Total Candidate",
      value: count?.totalCounts || "0",
      link: "#",
    },
    {
      title: "Total Downloaded",
      value: count?.totalDownloaded || "0",
      link: "#",
    },
    {
      title: "Total Pending",
      value: count?.totalPending || "0",
      link: "#",
    },
  ];

  const getPublishDates = async (shift: string) => {
    setIsDateLoading(true);
    try {
      const query = `shifts=${shift}`;
      const { data, error } = (await CallGetPublishDates(query)) as any;
      console.log("getPublishDates", { data, error });

      if (data) {
        setAllDates(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsDateLoading(false);
  };

  const publishAdmitCard = async () => {
    setIsPublishing(true);
    try {
      const query = `advertisementId=${currentAdvertisementID}&examType=${watch("masterDataIds")}`;
      const { data, error } = (await CallPublishAdmitCard(query)) as any;
      console.log("publishAdmitCard", { data, error });
      if (data?.message) {
        toast.success(data?.message);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsPublishing(false);
  };

  const holdCandidate = async (id: string) => {
    try {
      const submitData = {
        admitCardStatus: "Hold",
        id: id,
      };
      console.log("submitData", submitData);
      const { data, error } = (await CallUpdateAdmitCardStatus(
        submitData,
      )) as any;
      console.log("holdCandidate", { data, error });

      if (data?.message) {
        toast?.success(data?.message);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rescheduleAdmitCard = async (submitData: any) => {
    try {
      const obj = {
        centerId: submitData?.centerId,
        remarks: submitData?.remarks,
        application: currentApplication?.application?._id,
        advertisment: currentAdvertisementID,
        advertisementId: currentApplication?.advertisment,
        masterDataIds: currentApplication?.examType,
      };
      const { data, error } = (await CallRescheduleAdmitCard(obj)) as any;
      console.log("rescheduleAdmitCard", { data, error });
      if (data?.message) {
        toast?.success(data?.message);
        onClose();
        reset();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModel = () => {
    reset();
  };

  const getAllExamType = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const query = `advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetAllExamTypeData(query)) as any;
      console.log("getAllExamType", data);
      if (error) {
        console.log(error);
      }
      if (data) {
        setAllMaster(data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && <ScreenLoader />}

      <FlatCard heading="All Admit Card">
        <CardGrid data={cardData} columns={4} />
      </FlatCard>

      <FlatCard>
        <div className="grid grid-cols-1 flex-col gap-4 lg:grid-cols-3 xl:grid-cols-4 mob:flex">
          <Input
            placeholder="Candidate Id"
            className="rounded"
            value={filterData.candidateId}
            type="search"
            onChange={(e: { target: { value: any } }) =>
              setFilterData({
                ...filterData,
                candidateId: e.target.value,
              })
            }
            startContent={
              <span className="material-symbols-rounded">playlist_add</span>
            }
          />
          <Input
            placeholder="Candidate Name"
            className="rounded"
            value={filterData.candidate_name}
            type="search"
            onChange={(e: { target: { value: any } }) =>
              setFilterData({
                ...filterData,
                candidate_name: e.target.value,
              })
            }
            startContent={
              <span className="material-symbols-rounded">person</span>
            }
          />
          <Input
            placeholder="Phone number"
            className="rounded"
            value={filterData.phone}
            type="search"
            onChange={(e: { target: { value: any } }) =>
              setFilterData({ ...filterData, phone: e.target.value })
            }
            startContent={
              <span className="material-symbols-rounded">phone</span>
            }
          />
          <Input
            placeholder="Roll No"
            className="rounded"
            value={filterData.rollNo}
            type="search"
            onChange={(e: { target: { value: any } }) =>
              setFilterData({ ...filterData, rollNo: e.target.value })
            }
            startContent={
              <span className="material-symbols-rounded">
                format_list_numbered_rtl
              </span>
            }
          />
          <Controller
            name={`masterDataIds`}
            control={control}
            rules={{ required: "Please select Exam Type" }}
            render={({
              field: { onChange, value },
              fieldState: { error, invalid },
            }) => {
              return (
                <Select
                  items={allMaster}
                  fullWidth
                  // isLoading={isLoading}
                  selectionMode="single"
                  placeholder="Select Exam Type"
                  labelPlacement="outside"
                  selectedKeys={value ? [value] : []}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    onChange(selectedKey);
                  }}
                  startContent={
                    <span className="material-symbols-rounded">
                      content_paste_search
                    </span>
                  }
                >
                  {(item) => (
                    <SelectItem
                      key={item?.admitCardExamId}
                      value={item?.admitCardExamId}
                    >
                      {item.examType}
                    </SelectItem>
                  )}
                </Select>
              );
            }}
          />
          <ExcelPdfDownload
            excelFunction={() => {
              DownloadKushalExcel(
                `v1/admin/downloadAdmitCardExcel?advertisementId=${currentAdvertisementID}&candidateId=${filterData?.candidateId}&candidate_name=${filterData?.candidate_name}&phone=${filterData?.phone}&rollNo=${filterData?.rollNo}`,
                "Admit Card",
                setLoader,
              );
            }}
            pdfFunction={() => {
              DownloadKushalPdf(
                `v1/admin/downloadAdmitCardExcel?advertisementId=${currentAdvertisementID}&candidateId=${filterData?.candidateId}&candidate_name=${filterData?.candidate_name}&phone=${filterData?.phone}&rollNo=${filterData?.rollNo}`,
                "Admit Card",
                setLoader,
              );
            }}
            excelLoader={loader?.excel}
            pdfLoader={loader?.pdf}
          />
          <FilterSearchBtn
            searchFunc={() => GetAdmitCardData(true)}
            clearFunc={() => {
              clearFilter();
            }}
          />
        </div>
      </FlatCard>

      <Table
        className="mb-6"
        topContent={
          <div className="flex w-full justify-end mob:justify-start">
            <Button
              color="success"
              // size="lg"
              // onPress={onPublish}
              onClick={publishAdmitCard}
              className="px-8"
            >
              Publish All Admit Card
            </Button>
          </div>
        }
        bottomContent={
          totalPage > 0 && (
            <div className="flex justify-end">
              <Pagination
                showControls
                total={totalPage}
                page={page}
                onChange={(page) => setPage(page)}
              />
            </div>
          )
        }
      >
        <TableHeader>
          <TableColumn key="rollNo">Roll No</TableColumn>
          <TableColumn key="candidateId">Candidate id</TableColumn>
          <TableColumn key="phone">Phone</TableColumn>
          <TableColumn key="name">Name</TableColumn>
          <TableColumn key="gender">Gender</TableColumn>
          <TableColumn key="fatherName">Father Name</TableColumn>
          <TableColumn key="dob">Date of Birth</TableColumn>
          <TableColumn key="centerAddress">Center Address</TableColumn>
          <TableColumn key="Action">Action</TableColumn>
        </TableHeader>
        <TableBody
          items={allAdmitCard}
          emptyContent={"No data available!"}
          loadingState={loading ? "loading" : "idle"}
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

      <Modal
        isOpen={isTableObjOpen}
        onOpenChange={onTableObjChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Admit Card
              </ModalHeader>

              <ModalBody>
                <p>Are you sure to share all approved candidate admit card</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  isLoading={isLoading}
                  color="primary"
                  onPress={() => {
                    sendNotifyUserForAdmitCard();
                  }}
                >
                  Send
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isTableOpen}
        onOpenChange={onTableChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Admit Card Download History
              </ModalHeader>

              <ModalBody>
                <Table isStriped>
                  <TableHeader>
                    <TableColumn>Device IP</TableColumn>
                    <TableColumn>Download Date&Time</TableColumn>
                  </TableHeader>
                  <TableBody
                    items={historyData}
                    loadingState={loading ? "loading" : "idle"}
                    loadingContent={<Spinner />}
                    emptyContent={"No Record Found."}
                  >
                    {historyData?.map((item: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{item?.ip_address}</TableCell>
                        <TableCell>
                          {moment(item?.time).format("DD MMM, H:mm")}
                        </TableCell>
                        {/* <TableCell>Yes</TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isReschedule}
        onOpenChange={onOpenReschedule}
        onClose={handleCloseModel}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reschedule Admit Card
              </ModalHeader>
              <ModalBody>
                <form
                  className="grid grid-cols-1 gap-4"
                  onSubmit={handleSubmit(rescheduleAdmitCard)}
                >
                  <Select
                    items={states}
                    label="State"
                    labelPlacement="outside"
                    placeholder="Select"
                    onChange={(e) => {
                      getAllDistricts(e.target.value);
                    }}
                  >
                    {(item: any) => (
                      <SelectItem key={item?._id}>{item?.name}</SelectItem>
                    )}
                  </Select>
                  <Autocomplete
                    defaultItems={districts}
                    label="District"
                    labelPlacement="outside"
                    placeholder="Select"
                    isLoading={isDistrictLoading}
                    onSelectionChange={(selectedKey) => {
                      if (selectedKey) {
                        getAllCenters(selectedKey.toString());
                      }
                    }}
                  >
                    {(item: any) => (
                      <AutocompleteItem key={item?._id}>
                        {item?.district}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>

                  <Controller
                    name="centerId"
                    control={control}
                    rules={{ required: "Center is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Autocomplete
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        defaultItems={centers}
                        label="Center"
                        labelPlacement="outside"
                        placeholder="Select"
                        isLoading={isCenterLoading}
                        isRequired
                        onSelectionChange={(selectedKey) => {
                          if (selectedKey) {
                            field.onChange(selectedKey.toString());
                          }
                        }}
                      >
                        {(item: any) => (
                          <AutocompleteItem key={item?._id}>
                            {item?.school_name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />

                  <Controller
                    name="remarks"
                    control={control}
                    rules={{ required: "remarks is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Textarea
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label="Remark"
                        labelPlacement="outside"
                        placeholder="Enter remark"
                        isRequired
                      />
                    )}
                  />

                  <Button
                    type="submit"
                    color="primary"
                    className="mb-2"
                    isLoading={isSubmitting}
                  >
                    Reschedule
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isPublish} onOpenChange={onOpenPublish}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Publish All Admit Card
              </ModalHeader>
              <ModalBody className="gap-6">
                <Select
                  items={[
                    { key: "1", label: "Shift 1" },
                    { key: "2", label: "Shift 2" },
                    { key: "both", label: "Both" },
                  ]}
                  label="Shifts"
                  labelPlacement="outside"
                  placeholder="Select"
                  onChange={(e) => {
                    getPublishDates(e.target.value);
                    setSelectedShift(e.target.value);
                  }}
                >
                  {(item: any) => (
                    <SelectItem key={item?.key}>{item?.label}</SelectItem>
                  )}
                </Select>

                <Select
                  items={allDates.map((date: string) => ({
                    key: date,
                    label: date,
                  }))}
                  label="Dates"
                  labelPlacement="outside"
                  placeholder="Select"
                  isLoading={isDateLoading}
                  selectionMode="multiple"
                  onChange={(e) => {
                    setSelectedDates(e.target.value);
                  }}
                >
                  {(item: any) => (
                    <SelectItem key={item?.key}>{item?.label}</SelectItem>
                  )}
                </Select>

                <Button
                  color="primary"
                  className="mb-2"
                  isDisabled={selectedDates.length === 0}
                  onPress={publishAdmitCard}
                  isLoading={isPublishing}
                >
                  Publish
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Add;
