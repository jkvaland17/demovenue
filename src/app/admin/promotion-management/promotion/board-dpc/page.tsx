"use client";
import {
  CallDashbordList,
  CallDPCPromotionList,
  CallEligibilityForDPCPromotion,
  CallFindMasterByCodePromotion,
  CallUploadDCPPromotionData,
  CallUploadG2PromotionData,
  CallUploadHCMPPromotionData,
  CallUserFindAllAdvertisement,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import {
  Autocomplete,
  AutocompleteItem,
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
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

type Props = {};

const BoardDPC = (props: Props) => {
  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onClose: onCloseUpload,
    onOpenChange: onOpenUpload,
  } = useDisclosure();
  const {
    isOpen: isAddForm,
    onOpen: onAddForm,
    onClose: onCloseAddForm,
    onOpenChange: onOpenAddForm,
  } = useDisclosure();
  const {
    isOpen: Form,
    onOpen: onForm,
    onClose: onCloseForm,
    onOpenChange: onOpenForm,
  } = useDisclosure();
  const [uploadFile, setUploadFile] = useState<any>([]);
  const [preview, setPreview] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loader, setLoader] = useState<string>("");
  const [uploadLoader, setuploadLoader] = useState(false);
  const [allDPC, setAllDPC] = useState<any[]>([]);
  const [loaderDownload, setLoaderDownload] = useState<any>({
    excel: false,
    pdf: false,
  });
  const [dashboardData, setDashboardData] = useState<any>({
    totalEmployees: 0,
    fitEmployees: 0,
    unfitEmployees: 0,
    shieldCoverEmployees: 0,
    deferEmployees: 0,
    pendingEmployees: 0,
  });
  const [eligibilityList, setEligibilityList] = useState<any[]>([]);
  const [selectedEligibility, setSelectedEligibility] = useState<any>(null);
  const [selectForm, setselectForm] = useState<any>("");
  const [flags, setFlags] = useState<any>(false);
  const [eventList, setEventList] = useState<any[]>([]);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  // const [advertisementId, setAdvertisementId] = useState<any>("");
  const { currentAdvertisementID } = useAdvertisement();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [filter, setFilter] = useState({
    search: "",
    status: "",
  });

  const cardData = useMemo(
    () => [
      {
        title: "Total Employees",
        value: dashboardData?.totalEmployees,
      },
      {
        title: "Total No. of Fit Employees",
        value: dashboardData?.fitEmployees,
      },
      {
        title: "Total No. of Unfit Employees",
        value: dashboardData?.unfitEmployees,
      },
      {
        title: "Total No. of Shield-Cover Employees",
        value: dashboardData?.shieldCoverEmployees,
      },
      {
        title: "Total No. of Defer Employees",
        value: dashboardData?.deferEmployees,
      },
      {
        title: "Total Pending Employees",
        value: dashboardData?.pendingEmployees,
      },
    ],
    [dashboardData],
  );

  const columns = [
    { title: "Seniority List Serial No.", key: "seniorityListSerialNo" },
    { title: "Eligibility List Serial No.", key: "eligibilityListSerialNo" },
    { title: "Employee Name", key: "name" },
    { title: "Father's Name", key: "fatherName" },
    { title: "PNO No.", key: "PNO" },
    { title: "Current Posting", key: "posting" },
    { title: "Home District", key: "homeDistrict" },
    { title: "Date of Birth", key: "dateOfBirth" },
    {
      title: "Date of Promotion to the Post of Head Constable",
      key: "promotionDate",
    },
    { title: "Date of Recruitment", key: "recruitmentDate" },
    { title: "Status", key: "status" },
    { title: "Actions", key: "actions" },
  ];

  const statusColorMap: { [key: string]: ChipColor } = {
    FIT: "success",
    UNFIT: "danger",
    SEAL_COVER: "primary",
    PROVISIONAL: "secondary",
    STAY: "warning",
  };

  const statusValueMap: { [key: string]: any } = {
    FIT: "Fit",
    UNFIT: "Unfit",
    SEAL_COVER: "Seal Cover",
    PROVISIONAL: "Provisional",
    STAY: "Stay",
  };

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "seniorityListSerialNo":
          return <p>{item?.seniorityListSerialNo || "-"}</p>;
        case "eligibilityListSerialNo":
          return <p>{item?.eligibilityListSerialNo || "-"}</p>;
        case "name":
          return <p>{item?.employeeName || "-"}</p>;
        case "fatherName":
          return <p>{item?.fatherName || "-"}</p>;
        case "PNO":
          return <p>{item?.pnoNumber || "-"}</p>;
        case "posting":
          return <p>{item?.currentPosting || "-"}</p>;
        case "dateOfBirth":
          return (
            <p className="text-nowrap">
              {moment(item?.dateOfBirth).format("DD-MM-YYYY")}
            </p>
          );
        case "promotionDate":
          return <p>{item?.promotionDate || "-"}</p>;
        case "recruitmentDate":
          return <p>{item?.recruitmentDate || "-"}</p>;
        case "status":
          return (
            <Chip
              variant="flat"
              color={statusColorMap[item?.formData?.status]}
              classNames={{ content: "capitalize" }}
            >
              {statusValueMap[item?.formData?.status] || "-"}
            </Chip>
          );
        case "actions":
          const getVerificationInfo = (formType: any) => {
            switch (formType) {
              case "DPC":
                return {
                  label: flags ? "DPC View & Verification" : "View DPC Form",
                  href: `/admin/promotion-management/promotion/board-dpc/dpc-form/${item?.formData?._id}`,
                };
              case "HTCP":
                return {
                  label: flags ? "HTCP View & Verification" : "View HTCP Form",
                  href: `/admin/promotion-management/promotion/board-dpc/htcp-form/${item?.formData?._id}`,
                };
              case "G2":
                return {
                  label: flags ? "G2 View & Verification" : "View G2 Form",
                  href: `/admin/promotion-management/promotion/board-dpc/g2-form/${item?.formData?._id}`,
                };
              default:
                return {
                  label: flags ? "G2 Verification" : "View G2 Form",
                  href: `/admin/promotion-management/promotion/board-dpc/g2-form/${item?.formData?._id}`,
                };
            }
          };
          const { label, href } = getVerificationInfo(item?.formType);

          const urlMaping: any = {
            DPC: `/admin/promotion-management/promotion/board-dpc/add/edit/${item?.formData?._id}`,
            // "HTCP": `/admin/promotion-management/promotion/board-dpc/addHcmt/edit/${item?.formData?._id}`,
            // "G2": `/admin/promotion-management/promotion/board-dpc/addG2/edit/${item?.formData?._id}`,
          };
          return (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button className="more_btn rounded-full px-0" disableRipple>
                  <span className="material-symbols-rounded">more_vert</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                {item?.formType == "" ? (
                  <DropdownItem
                    key="add"
                    onPress={() => {
                      setSelectedEligibility(item?._id);
                      onForm();
                    }}
                  >
                    Add Form
                  </DropdownItem>
                ) : null}
                {item?.formType == "" ? null : (
                  <DropdownItem key="verify" href={href}>
                    {label}
                  </DropdownItem>
                )}
                {item?.formType == "DPC" ? (
                  <DropdownItem key="edit" href={urlMaping[item?.formType]}>
                    Edit
                  </DropdownItem>
                ) : null}
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue;
      }
    },
    [flags],
  );

  const handleEligibilityCSV = async (loaderType: string, file: any) => {
    try {
      setuploadLoader(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("advertisementId", currentAdvertisementID);
      const urlMaping: any = {
        "DPC Form": CallUploadDCPPromotionData,
        "HCMT Form": CallUploadHCMPPromotionData,
        "G2 Form": CallUploadG2PromotionData,
      };
      const uploadFunction = urlMaping[selectForm];
      const { data, error } = await uploadFunction(formData);

      if (data?.status_code === 200) {
        setuploadLoader(false);
        toast.success(data?.message);
        getAllDPC(false);
        resetFormAndCloseModal();
        // getEligibilityListData("");
      }
      if (error) {
        setuploadLoader(false);
      }
    } catch (error) {
      console.error("Error in handleCreateEligibility:", error);
    } finally {
      setLoader("");
    }
  };
  const resetFormAndCloseModal = () => {
    setUploadFile([]);
    setPreview([]);
    onCloseUpload();
  };
  const handleChangeST = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUploadFile([...newFiles]);
    setPreview([...newFiles]);
  };

  const getAllDashbordData = async () => {
    try {
      setIsLoading(true);
      const query = `&advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallDashbordList(query)) as any;
      if (data) {
        console.log("CallDashbordList", data);
        setDashboardData(data?.data?.dashBoardData);
      }
      if (error) {
        console.log(error);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getAllDPC = async (isFilter: boolean) => {
    try {
      setIsLoading(true);
      const filterOn = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}&search=${filter?.search}&status=${filter?.status}`;
      const filterOff = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}`;
      let query = isFilter ? filterOn : filterOff;
      const { data, error } = (await CallDPCPromotionList(query)) as any;
      console.log("getAllDPC", data);
      setFlags(data?.data?.isReceived);
      if (data) {
        setAllDPC(data?.data?.DcpPromotionData);
        setPage(data?.data.currentPage);
        setTotalPage(data?.data?.totalPages);
      }
      if (error) {
        toast.error(error);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const clearFilter = () => {
    setFilter({
      search: "",
      status: "",
    });
    getAllDPC(false);
  };

  useEffect(() => {
    if (currentAdvertisementID) {
      getAllDPC(false);
      getAllDashbordData();
    }
  }, [currentAdvertisementID, page]);

  useEffect(() => {
    if (isAddForm) {
      getAllEligibilityLis();
    } else {
      setEligibilityList([]);
    }
  }, [isAddForm]);

  const getAllEligibilityLis = async () => {
    try {
      setLoader("Eligibility");
      const { data, error } = (await CallEligibilityForDPCPromotion("")) as any;
      if (data?.data) {
        setEligibilityList(data?.data?.eligibiltyData);
      }
      if (error) {
        toast.error(error);
      }
      setLoader("");
    } catch (error) {
      console.log(error);
      setLoader("");
    }
  };

  const formItems = [
    { key: "DPC Form", label: "DPC Form" },
    { key: "HCMT Form", label: "HCMT Form" },
    { key: "G2 Form", label: "G2 Form" },
  ];

  const urlMaping: any = {
    "DPC Form": `/admin/promotion-management/promotion/board-dpc/add/${selectedEligibility}`,
    "HCMT Form": `/admin/promotion-management/promotion/board-dpc/addHcmt/${selectedEligibility}`,
    "G2 Form": `/admin/promotion-management/promotion/board-dpc/addG2/${selectedEligibility}`,
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

  return (
    <>
      <FlatCard heading="Board DPC FORM">
        <CardGrid data={cardData} columns={3} />
      </FlatCard>

      <Table
        isStriped
        className="mt-6"
        color="default"
        topContent={
          <div className="space-y-4">
            <div className="grid grid-cols-2 items-end gap-4">
              <Input
                placeholder="Search PNO No."
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
                label="Status"
                labelPlacement="outside"
                placeholder="Select"
                selectedKeys={filter?.status ? [filter.status] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  setFilter({ ...filter, status: value });
                }}
              >
                <SelectItem key="FIT">Fit</SelectItem>
                <SelectItem key="UNFIT">Unfit</SelectItem>
                <SelectItem key="SEAL_COVER">Seal Cover</SelectItem>
                <SelectItem key="PROVISIONAL">Provisional Fit</SelectItem>
                <SelectItem key="STAY">Defer</SelectItem>
              </Select>

              <FilterSearchBtn
                searchFunc={() => getAllDPC(true)}
                clearFunc={clearFilter}
              />
            </div>
            <div className="flex flex-wrap justify-end gap-4">
              <ExcelPdfDownload
                excelFunction={() =>
                  DownloadKushalExcel(
                    `v1/promotion/getDpcPromotionListExcel?advertisementId=${currentAdvertisementID}&search=${filter?.search}&status=${filter?.status}`,
                    "Board DPC",
                    setLoaderDownload,
                  )
                }
                pdfFunction={() =>
                  DownloadKushalPdf(
                    `v1/promotion/getDpcPromotionListPdf?advertisementId=${currentAdvertisementID}&search=${filter?.search}&status=${filter?.status}`,
                    "Board DPC",
                    setLoaderDownload,
                  )
                }
                excelLoader={loaderDownload?.excel}
                pdfLoader={loaderDownload?.pdf}
              />

              <Button
                color="primary"
                onPress={onUpload}
                isDisabled={!currentAdvertisementID}
              >
                <span className="material-symbols-rounded">upload</span>
                Upload DPC List
              </Button>

              <Button color="primary" onPress={onAddForm}>
                <span className="material-symbols-rounded">add</span>
                Add DPC Form
              </Button>
            </div>
          </div>
        }
        bottomContent={
          <div className="grid grid-cols-2 gap-6 mob:grid-cols-1">
            <Button
              color="primary"
              className="w-fit text-white mob:text-nowrap"
            >
              Upload the Committee remarks With Signature (Committee Head)
            </Button>
            <div className="flex justify-end">
              <Pagination
                showControls
                total={totalPage}
                initialPage={1}
                page={page}
                onChange={(page) => setPage(page)}
              />
            </div>
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
          items={allDPC}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent="No data"
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
        isOpen={isUpload}
        isDismissable={false}
        onOpenChange={onOpenUpload}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload DPC List
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
                  accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                  type="single"
                  name="file"
                  placeholder="Upload file"
                />
              </ModalBody>
              <div className="flex flex-1 flex-col gap-6 px-6 py-2">
                <Select
                  key={"animal-select"}
                  label="Select Form"
                  variant="bordered"
                  labelPlacement={"outside"}
                  placeholder="Select Form"
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    setselectForm(selectedKey);
                  }}
                  selectedKeys={selectForm ? [selectForm] : []}
                >
                  {formItems?.map((formItem) => (
                    <SelectItem key={formItem?.key}>
                      {formItem?.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <ModalFooter>
                <Button
                  isLoading={uploadLoader}
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

      <Modal isOpen={isAddForm} onOpenChange={onOpenAddForm}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Select eligibility candidate
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  isLoading={loader === "Eligibility"}
                  variant="bordered"
                  // defaultItems={eligibilityList}
                  items={eligibilityList}
                  placeholder="Search an eligibility candidate"
                  onSelectionChange={(value) => {
                    setSelectedEligibility(value);
                  }}
                >
                  {(item: any) => (
                    <AutocompleteItem key={item?._id}>
                      {item?.pnoNumber}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <Select
                  key={"animal-select"}
                  label="Select Form"
                  variant="bordered"
                  labelPlacement={"outside"}
                  placeholder="Select Form"
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    setselectForm(selectedKey);
                  }}
                  selectedKeys={selectForm ? [selectForm] : []}
                >
                  {formItems?.map((formItem) => (
                    <SelectItem key={formItem?.key}>
                      {formItem?.label}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isDisabled={!selectedEligibility || !selectForm}
                  color="primary"
                  as={Link}
                  href={urlMaping[selectForm] || "#"}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={Form} onOpenChange={onOpenForm}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Select Form
              </ModalHeader>
              <ModalBody>
                <Select
                  key={"animal-select"}
                  label="Select Form"
                  variant="bordered"
                  labelPlacement={"outside"}
                  placeholder="Select Form"
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    setselectForm(selectedKey);
                  }}
                  selectedKeys={selectForm ? [selectForm] : []}
                >
                  {formItems?.map((formItem) => (
                    <SelectItem key={formItem?.key}>
                      {formItem?.label}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isDisabled={!selectForm}
                  color="primary"
                  as={Link}
                  href={urlMaping[selectForm] || "#"}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default BoardDPC;
