"use client";
import {
  Accordion,
  AccordionItem,
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
import React, { useEffect, useState } from "react";
import dynamicData from "@/assets/data/viewModalData.json";
import {
  CallGetAllKushalFilters,
  CallGetAllSports,
  CallGetDocumentVerificationData,
  CallGetKuhsalTeams,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import moment from "moment";
import Image from "next/image";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import Link from "next/link";
import CardGrid from "@/components/kushal-components/CardGrid";
import CardAndTable from "@/components/kushal-components/loader/CardAndTable";
import { useAdvertisement } from "@/components/AdvertisementContext";
import toast from "react-hot-toast";
import FlatCard from "@/components/FlatCard";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";

const columns = [
  { title: "Registration ID", key: "candidateId" },
  { title: "Full name", key: "fullName" },
  { title: "DV Roll No.", key: "dvRollNo" },
  { title: "Sports", key: "sports" },
  { title: "Sub-Sports", key: "subSports" },
  { title: "Gender", key: "gender" },
  { title: "Roll No.", key: "rollNo" },
  { title: "Attendance", key: "attendance" },
  { title: "DV Status", key: "dvStatus" },
  { title: "Application Scrutiny Status", key: "scuritnyStatus" },
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

const DocumentVerification = () => {
  const { currentAdvertisementID } = useAdvertisement();
  const {
    isOpen: isView,
    onOpen: onView,
    onOpenChange: onOpenView,
  } = useDisclosure();
  const {
    isOpen: isUplaod,
    onOpen: onUplaod,
    onOpenChange: onOpenUplaod,
  } = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [advertisementId, setAdvertisementId] = useState<any>("");
  const [applications, setApplications] = useState<any>([]);
  const [allFilters, setAllFilters] = useState<any>([]);
  const [applicationRemark, setApplicationRemark] = useState<any>("");
  const [currentApplicationData, setCurrentApplicationData] =
    useState<any>(dynamicData);
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
    pdf: false,
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [stats, setStats] = useState({
    eligibleCount: 0,
    ineligibleCount: 0,
    inprocessCount: 0,
    totalAcceptedCount: 0,
  });

  const cardData = [
    {
      title: "Total Accepted Applications for Document Verification",
      value: stats?.totalAcceptedCount,
    },
    {
      title: "Total Eligible Candidates in Document Verification",
      value: stats?.eligibleCount,
    },
    {
      title: "Total Ineligible Candidates in Document Verification",
      value: stats?.ineligibleCount,
    },
    {
      title: "Total In Process Candidates in Document Verification",
      value: stats?.inprocessCount,
    },
  ];

  const [filterData, setFilterData] = useState<any>({
    State: "",
    Post: "",
    Gender: "",
    committeeId: "",
    Sports: "",
    SubSports: "",
    dvStatus: "",
    searchValue: "",
    attendance: "",
  });

  useEffect(() => {
    if (currentAdvertisementID) {
      getKushalApplications(false);
      setFilterData((prev: any) => ({ ...prev, Post: currentAdvertisementID }));
    }
    getAllFilters();
    getAllSports();
  }, []);

  useEffect(() => {
    if (currentAdvertisementID) {
      getKushalApplications(true);
      setFilterData((prev: any) => ({ ...prev, Post: currentAdvertisementID }));
      getAllCommittee();
    }
  }, [page, currentAdvertisementID]);

  const getKushalApplications = async (filter: any) => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    try {
      const FilterOn = `eventId=678016f9c45d0c0531e4ff87&sportId=${filterData?.Sports}&advertisementId=${currentAdvertisementID}&page=${page}&limit=10&teamId=&dvStatus=${filterData?.dvStatus}&gender=${filterData?.Gender}&state=${filterData?.State}&scrutinyStatus=Accepted&paymentStatus=Success&searchValue=${filterData?.searchValue}&attendance=${filterData?.attendance}&committeeId=${filterData?.committeeId}`;
      console.log("FilterOn", FilterOn);
      
      const FilterOff = `eventId=678016f9c45d0c0531e4ff87&advertisementId=${currentAdvertisementID}&page=1&limit=10&teamId=&paymentStatus=Success&scrutinyStatus=Accepted`;
      console.log(FilterOn);
      
      const { data, error } = (await CallGetDocumentVerificationData(
        filter ? FilterOn : FilterOff,
      )) as any;
      console.log("data",data);
      
      if (data) {
        setApplications(data?.applications);
        setTotalPage(data?.totalPages);
        setStats({
          eligibleCount: data?.applicationStatictics.totalEligibleCandidates,
          ineligibleCount:
            data?.applicationStatictics.totalIneligibleCandidates,
          inprocessCount: data?.applicationStatictics.totalInProcessCandidates,
          totalAcceptedCount:
            data?.applicationStatictics.totalAcceptedApplications,
        });
      }
      if (error) console.log(error);
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    } catch (error) {
      console.log(error);
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    }
  };

  const getAllFilters = async () => {
    try {
      const { data, error } = (await CallGetAllKushalFilters()) as any;
      if (data) {
        setAllFilters(data?.data);
      }
      if (error) {
        handleCommonErrors(Error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const statusColorMap: { [key: string]: ChipColor } = {
    "Ports Certificate - Not of valid tenure": "danger",
    "Sports Certificate - Invalid sports certificate": "danger",
    Rejected: "danger",
    Absent: "danger",
    Ineligible: "danger",
    Pending: "warning",
    Accepted: "success",
    Eligible: "success",
    Present: "success",
    undefined: "default",
  };

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "candidateId":
          return <p>{item?.userDetails?.candidateId}</p>;
        case "dvRollNo":
          return <p>{item?.applicationDetails?.scrutinyRollNo}</p>;
        case "fullName":
          return (
            <p className="capitalize">
              {item?.applicationDetails?.personalDetails?.fullName || "N/A"}
            </p>
          );
        case "sports":
          return (
            <p className="capitalize">{item?.sportDetails?.name || "N/A"}</p>
          );
        case "subSports":
          return (
            <p className="capitalize">
              {item?.applicationDetails?.subSportsName || "N/A"}
            </p>
          );
        case "gender":
          return (
            <p className="capitalize">
              {item?.applicationDetails?.personalDetails?.gender}
            </p>
          );
        case "rollNo":
          return <p>-</p>;
        case "attendance":
          return (
            <Chip
              color={statusColorMap[item?.candidateStatus]}
              variant="flat"
              radius="full"
            >
              {item?.candidateStatus}
            </Chip>
          );
        case "dvStatus":
          return (
            <Chip
              color={statusColorMap[item?.applicationScreeningStatus]}
              variant="flat"
              radius="full"
              className="capitalize"
            >
              {item?.applicationScreeningStatus}
            </Chip>
          );
        case "scuritnyStatus":
          return (
            <Chip
              color={statusColorMap[item?.applicationScrutinyStatus]}
              variant="flat"
              radius="full"
              className="capitalize"
            >
              {item?.applicationScrutinyStatus}
            </Chip>
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
                  key="view"
                  onPress={() => {
                    const updatedJson = updateCurrentUserData(item);
                    setCurrentApplicationData(updatedJson);
                    onView();
                    setAdvertisementId(item?.userId?.candidateId);
                  }}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  key="scrutiny"
                  href={`/admin/kushal-khiladi/kushal/document-verification/${currentAdvertisementID}/${item?.applicationDetails?._id}`}
                >
                  Document Verification
                </DropdownItem>
                <DropdownItem
                  key="remark"
                  onPress={() => {
                    setApplicationRemark(
                      item?.applicationScreeningRemarks || "Remark Not Found",
                    );
                    onOpen();
                  }}
                >
                  Remark
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue;
      }
    },
    [page],
  );

  const modalRenderCell = (item: any, columnKey: any) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "competitionCertificate":
        return (
          <Button
            size="md"
            variant="light"
            className="bg-transparent hover:!bg-transparent"
            isIconOnly
          >
            <Image
              src={pdf.src}
              width={30}
              height={30}
              className="object-contain"
              alt="pdfIcon"
            />
          </Button>
        );
      default:
        return cellValue;
    }
  };

  const modalRenderTable = (columns: any[], rows: any[]) => (
    <div className="overflow-x-scroll">
      <Table removeWrapper className="mb-6">
        <TableHeader columns={columns}>
          {(column: any) => (
            <TableColumn key={column.key}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows} emptyContent="No data">
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{modalRenderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  const updateCurrentUserData = (currentItem: any) => {
    const jsonUI = currentApplicationData.accordionItems;

    const getNestedValue = (path: any, obj: any) =>
      path
        .split(".")
        .reduce((acc: any, key: any) => (acc ? acc[key] : "NA"), obj);

    return jsonUI.map((section: any) => {
      if (section.title) {
        const updatedData = section?.data?.map((detail: any) => {
          const value = getNestedValue(detail.key, currentItem);
          return { ...detail, value: value || "NA" };
        });
        return { ...section, data: updatedData };
      }
      return section;
    });
  };

  const clearFilter = () => {
    setFilterData({
      State: "",
      Post: "",
      Gender: "",
      committeeId: "",
      Sports: "",
      SubSports: "",
      dvStatus: "",
      searchValue: "",
      attendance: "",
    });
    getKushalApplications(false);
  };

  const getAllSports = async () => {
    try {
      const { data, error } = (await CallGetAllSports("")) as any;
      if (data) {
        setAllFilters((prev: any) => ({ ...prev, sports: data?.data }));
        // console.log("getAllSports");
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const getAllCommittee = async () => {
    try {
      const query = `page=${page}&limit=10&groupType=committee&advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetKuhsalTeams(query)) as any;

      console.log("getAllCommittee", data);

      if (data) {
        setAllFilters((prevFilters: any) => ({
          ...prevFilters,
          committee: data?.data,
        }));
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loader?.body ? (
        <CardAndTable
          cardCount={4}
          filterCount={6}
          tableColumns={7}
          tableRows={10}
        />
      ) : (
        <>
          <FlatCard heading="Document Verification">
            <CardGrid data={cardData} columns={4} />
          </FlatCard>

          <Table
            isStriped
            color="default"
            aria-label="Example static collection table"
            className="mb-6"
            topContent={
              <div className="grid grid-cols-4 items-end gap-4 mob:flex flex-col mob:items-stretch">
                <Select
                  items={allFilters?.states || []}
                  selectedKeys={[filterData?.State]}
                  label="State"
                  labelPlacement="outside"
                  placeholder="Select"
                  onChange={(e) => {
                    setFilterData({
                      ...filterData,
                      State: e.target.value,
                    });
                  }}
                >
                  {(item: any) => (
                    <SelectItem key={item?._id} value={item?._id}>
                      {item?.name}
                    </SelectItem>
                  )}
                </Select>

                <Select
                  items={allFilters?.postNames || []}
                  selectedKeys={[filterData?.Post]}
                  label="Post"
                  labelPlacement="outside"
                  placeholder="Select"
                  onChange={(e) => {
                    setFilterData({
                      ...filterData,
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

                <Select
                  items={[
                    {
                      name: "Male",
                      key: "male",
                    },
                    {
                      name: "Female",
                      key: "female",
                    },
                  ]}
                  label="Gender"
                  selectedKeys={[filterData?.Gender]}
                  labelPlacement="outside"
                  placeholder="Select"
                  onChange={(e) => {
                    setFilterData({ ...filterData, Gender: e.target.value });
                  }}
                >
                  {(item) => (
                    <SelectItem key={item.key}>{item.name}</SelectItem>
                  )}
                </Select>

                <Select
                  items={allFilters?.committee || []}
                  label="Committee"
                  labelPlacement="outside"
                  placeholder="Select"
                  selectedKeys={[filterData?.committeeId]}
                  onChange={(e) => {
                    const id = e.target.value || "";
                    // getAllSports(id);
                    setFilterData({ ...filterData, Committee: e.target.value });
                  }}
                >
                  {(item: any) => (
                    <SelectItem key={item?._id}>{item?.groupName}</SelectItem>
                  )}
                </Select>

                <Select
                  items={allFilters?.sports || []}
                  label="Sports"
                  labelPlacement="outside"
                  placeholder="Select"
                  selectedKeys={[filterData?.Sports]}
                  onChange={(e) => {
                    setFilterData((prev: any) => ({
                      ...prev,
                      Sports: e.target.value,
                    }));
                  }}
                >
                  {(item: any) => (
                    <SelectItem key={item?._id}>{item?.name}</SelectItem>
                  )}
                </Select>

                <Select
                  label="Sub Sports"
                  labelPlacement="outside"
                  placeholder="Select"
                  variant="flat"
                  items={[
                    {
                      key: "--",
                      name: "na",
                    },
                  ]}
                >
                  {(option: any) => (
                    <SelectItem key={option?.key} value={option?.key}>
                      {option?.name}
                    </SelectItem>
                  )}
                </Select>

                <Select
                  label="DV Status"
                  labelPlacement="outside"
                  placeholder="Select"
                  variant="flat"
                  selectedKeys={[filterData?.dvStatus]}
                  items={[
                    {
                      name: "Eligible",
                      key: "Eligible",
                    },
                    {
                      name: "Pending",
                      key: "Pending",
                    },
                    {
                      name: "Ineligible",
                      key: "Ineligible",
                    },
                  ]}
                  onChange={(e) => {
                    setFilterData((prev: any) => ({
                      ...prev,
                      dvStatus: e.target.value,
                    }));
                  }}
                >
                  {(option: any) => (
                    <SelectItem key={option?.key} value={option?.key}>
                      {option?.name}
                    </SelectItem>
                  )}
                </Select>

                <Select
                  label="Attendance"
                  labelPlacement="outside"
                  placeholder="Select"
                  variant="flat"
                  selectedKeys={[filterData?.attendance]}
                  items={[
                    {
                      name: "Present",
                      key: "Present",
                    },
                    {
                      name: "Absent",
                      key: "Absent",
                    },
                    {
                      name: "Pending",
                      key: "Pending",
                    },
                  ]}
                  onChange={(e) => {
                    setFilterData((prev: any) => ({
                      ...prev,
                      attendance: e.target.value,
                    }));
                  }}
                >
                  {(option: any) => (
                    <SelectItem key={option?.key} value={option?.key}>
                      {option?.name}
                    </SelectItem>
                  )}
                </Select>

                <Input
                  placeholder="Search"
                  value={filterData?.searchValue}
                  onChange={(e) => {
                    setFilterData((prev: any) => ({
                      ...prev,
                      searchValue: e.target.value,
                    }));
                  }}
                  startContent={
                    <span className="material-symbols-rounded text-lg text-gray-500">
                      search
                    </span>
                  }
                />

                <ExcelPdfDownload
                  excelFunction={() => {
                    DownloadKushalExcel(
                      `v1/ApplicationScreening/downloadApplicationDocumentVerificationExcel?eventId=678016f9c45d0c0531e4ff87&sportId=${filterData?.Sports}&advertisementId=${currentAdvertisementID}&page=${page}&limit=10&teamId=&dvStatus=${filterData?.dvStatus}&gender=${filterData?.Gender}&state=${filterData?.State}&scrutinyStatus=Accepted&paymentStatus=Success&searchValue=${filterData?.searchValue}&attendance=${filterData?.attendance}&committeeId=${filterData?.committeeId}`,
                      "Document verification",
                      setLoader,
                    );
                  }}
                  excelLoader={loader?.excel}
                  pdfFunction={() => {
                    const abc = `v1/ApplicationScreening/downloadApplicationDocumentVerificationPDF?eventId=678016f9c45d0c0531e4ff87&sportId=${filterData?.Sports}&advertisementId=${currentAdvertisementID}&page=${page}&limit=10&teamId=&dvStatus=${filterData?.dvStatus}&gender=${filterData?.Gender}&state=${filterData?.State}&scrutinyStatus=Accepted&paymentStatus=Success&searchValue=${filterData?.searchValue}&attendance=${filterData?.attendance}&committeeId=${filterData?.committeeId}`
                    console.log("abc",abc);
                    
                    DownloadKushalPdf(
                      `v1/ApplicationScreening/downloadApplicationDocumentVerificationPDF?eventId=678016f9c45d0c0531e4ff87&sportId=${filterData?.Sports}&advertisementId=${currentAdvertisementID}&page=${page}&limit=10&teamId=&dvStatus=${filterData?.dvStatus}&gender=${filterData?.Gender}&state=${filterData?.State}&scrutinyStatus=Accepted&paymentStatus=Success&searchValue=${filterData?.searchValue}&attendance=${filterData?.attendance}&committeeId=${filterData?.committeeId}`,
                      "Document verification",
                      setLoader,
                    );
                  }}
                  pdfLoader={loader?.pdf}
                />

                <FilterSearchBtn
                  searchFunc={() => getKushalApplications(true)}
                  clearFunc={clearFilter}
                />
              </div>
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
                >
                  {column.title}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={applications}
              emptyContent="No data"
              isLoading={loader?.table}
              loadingContent={<Spinner />}
            >
              {(item: any) => (
                <TableRow key={item?._id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Modal isOpen={isUplaod} onOpenChange={onOpenUplaod}>
            <ModalContent>
              {() => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Uplaod Document Verification Data
                  </ModalHeader>
                  <ModalBody>
                    <Button variant="flat" className="justify-between">
                      Select file{" "}
                      <span className="material-symbols-rounded">
                        upload_file
                      </span>
                    </Button>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" className="w-full">
                      Validate and Upload File
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 pb-1">
                    Application Verification Remark
                  </ModalHeader>
                  <ModalBody className="mb-3">
                    <p>{applicationRemark}</p>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
          <Modal
            isOpen={isView}
            onOpenChange={onOpenView}
            placement="top"
            className="max-w-[100rem]"
          >
            <ModalContent>
              {() => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold">
                      Application number: <span>{advertisementId}</span>
                    </h1>
                  </ModalHeader>
                  <ModalBody className="flex flex-col gap-6">
                    <Accordion className="rounded-lg" defaultExpandedKeys="all">
                      {currentApplicationData?.map(
                        (item: any, index: number) => (
                          <AccordionItem
                            key={index}
                            title={
                              <h5 className="text-xl font-semibold">
                                {item?.title}
                              </h5>
                            }
                          >
                            {item?.renderElement === "table" ? (
                              <div>
                                {modalRenderTable(item?.columns, item?.rows)}
                              </div>
                            ) : (
                              <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 mob:grid-cols-1">
                                {item?.data?.map((item: any, index: number) => (
                                  <div
                                    className="grid grid-cols-2 gap-6 mob:grid-cols-1"
                                    key={index}
                                  >
                                    {/* Heading */}
                                    <div className="flex mob:flex-col">
                                      <div>
                                        <span
                                          className="material-symbols-rounded me-2 align-bottom"
                                          style={{ color: "rgb(100 116 139)" }}
                                        >
                                          {item?.icon}
                                        </span>
                                      </div>
                                      <div className="font-semibold">
                                        {item?.title}
                                      </div>
                                    </div>
                                    {item?.dataType === "document" &&
                                    item?.value !== "NA" ? (
                                      <Link href={item?.value} target="_blank">
                                        <Button
                                          variant="bordered"
                                          className="border py-6 font-medium"
                                        >
                                          <Image
                                            src={pdf}
                                            className="h-[30px] w-[30px] object-contain"
                                            alt="pdf"
                                          />
                                          Document
                                        </Button>
                                      </Link>
                                    ) : item?.dataType === "date" ? (
                                      moment(item?.value).format("YYYY-MM-DD")
                                    ) : (
                                      <p className="font-medium">
                                        {item?.value}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </AccordionItem>
                        ),
                      )}
                    </Accordion>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default DocumentVerification;
