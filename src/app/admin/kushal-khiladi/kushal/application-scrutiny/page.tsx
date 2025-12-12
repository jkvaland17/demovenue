"use client";
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
import React, { useEffect, useState } from "react";
import dynamicData from "@/assets/data/viewModalData.json";
import {
  CallGetAllKushalFilters,
  CallGetAllSports,
  CallGetApplicationsScrutiny,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import CardGrid from "@/components/kushal-components/CardGrid";
import CardAndTable from "@/components/kushal-components/loader/CardAndTable";
import FlatCard from "@/components/FlatCard";
import { useAdvertisement } from "@/components/AdvertisementContext";
import toast from "react-hot-toast";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import CandidateDetailsModal from "@/components/kushal-components/application-scrutiny/CandidateDetailsModal";
import { useSessionData } from "@/Utils/hook/useSessionData";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";

const columns = [
  { title: "Registration ID", key: "candidateId" },
  { title: "Full name", key: "fullName" },
  { title: "Sports", key: "sports" },
  { title: "Sub-Sports", key: "subSports" },
  { title: "State", key: "state" },
  { title: "Gender", key: "gender" },
  { title: "Status", key: "scuritnyStatus" },
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

const ApplicationScrutiny = () => {
  const { currentAdvertisementID } = useAdvertisement();
  const { role, sessionTeamId, session } = useSessionData();
  const [uploadFileModal, setUploadFileModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<any>([]);
  const [applicationRemark, setApplicationRemark] = useState<any>("");
  const [applications, setApplications] = useState<any>([]);
  const [allFilters, setAllFilters] = useState<any>([]);
  const [allSports, setAllSports] = useState<any>([]);
  const [currentApplicationData, setCurrentApplicationData] =
    useState<any>(dynamicData);
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });

  const [stats, setStats] = useState({
    acceptedCount: 0,
    rejectedCount: 0,
    pendingCount: 0,
    totalApplicationsCount: 0,
  });

  const statusColorMap: { [key: string]: ChipColor } = {
    "Ports Certificate - Not of valid tenure": "danger",
    "Sports Certificate - Invalid sports certificate": "danger",
    Rejected: "danger",
    Pending: "warning",
    Accepted: "success",
    undefined: "default",
  };

  const cardData = [
    {
      title: "Total Unique Candidate",
      value: stats?.totalApplicationsCount,
      link: "/admin/kushal-khiladi/kushal/application-scrutiny/statistics-details/total",
    },
    {
      title: "Total Eligible Candidates",
      value: stats?.acceptedCount,
      link: "/admin/kushal-khiladi/kushal/application-scrutiny/statistics-details/Accepted",
    },
    {
      title: "Total Ineligible Candidates",
      value: stats?.rejectedCount,
      link: "/admin/kushal-khiladi/kushal/application-scrutiny/statistics-details/Rejected",
    },
    {
      title: "Total Pending Candidates",
      value: stats?.pendingCount,
      link: "/admin/kushal-khiladi/kushal/application-scrutiny/statistics-details/Pending",
    },
    {
      title: "Number of Candidates Applied under Multiple Sub-sports ",
      value: stats?.pendingCount,
      link: "/admin/kushal-khiladi/kushal/application-scrutiny/statistics-details/MultipleSubSport",
    },
  ];

  const [filterData, setFilterData] = useState<any>({
    Teams: "",
    Advertisement: "",
    Sports: "",
    Gender: "",
    State: "",
    searchValue: "",
    scrutinyStatus: "",
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    if (session) {
      if (currentAdvertisementID) {
        getKushalApplications(false);
      }
      getAllFilters();
      getAllSports("");
    }
  }, [session]);

  useEffect(() => {
    if (currentAdvertisementID) {
      getKushalApplications(true);
    }
  }, [page, currentAdvertisementID]);

  useEffect(() => {
    if (sessionTeamId) {
      getAllSports(sessionTeamId);
    }
  }, [sessionTeamId]);

  const getKushalApplications = async (filter: any) => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    try {
      const FilterOn = `eventId=678016f9c45d0c0531e4ff87&advertisementId=${currentAdvertisementID}&page=${page}&limit=10&teamId=${filterData?.Teams}&sportId=${filterData?.Sports}&gender=${filterData?.Gender}&state=${filterData?.State}&scrutinyStatus=${filterData?.scrutinyStatus}&paymentStatus=Success&searchValue=${filterData?.searchValue}`;
      const FilterOff = `eventId=678016f9c45d0c0531e4ff87&page=1&limit=10&teamId=${sessionTeamId}&paymentStatus=Success&advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetApplicationsScrutiny(
        filter ? FilterOn : FilterOff,
      )) as any;

      if (data) {
        setApplications(data?.applications);
        setTotalPage(data?.totalPages);
        setStats({
          acceptedCount: data?.applicationStatistics.acceptedCount,
          rejectedCount: data?.applicationStatistics.rejectedCount,
          pendingCount: data?.applicationStatistics.pendingCount,
          totalApplicationsCount:
            data?.applicationStatistics.totalApplicationsCount,
        });
      }
      if (error) toast.error(error);
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

  const getAllSports = async (teamId: any) => {
    try {
      const { data, error } = (await CallGetAllSports("")) as any;

      if (data) {
        setAllSports(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "candidateId":
          return <p>{item?.userDetails?.candidateId}</p>;
        case "fullName":
          return (
            <p className="capitalize">
              {item?.applicationDetails?.personalDetails?.fullName || "N/A"}
            </p>
          );
        case "sports":
          return (
            <p className="text-nowrap capitalize">
              {item?.sportDetails?.name || "N/A"}
            </p>
          );
        case "subSports":
          return (
            <p className="capitalize">
              {item?.applicationDetails?.subSportsName || "N/A"}
            </p>
          );
        case "state":
          return (
            <p className="text-nowrap capitalize">
              {item?.applicationDetails?.addressDetails?.presentAddress
                ?.state || "N/A"}
            </p>
          );
        case "gender":
          return (
            <p className="capitalize">
              {item?.applicationDetails?.personalDetails?.gender}
            </p>
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
                    setViewModal(true);
                    setSelectedItem(item);
                  }}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  key="scrutiny"
                  href={`/admin/kushal-khiladi/kushal/application-scrutiny/candidate-application-scrutiny/${item?.applicationDetails?._id}`}
                >
                  Scrutiny
                </DropdownItem>
                <DropdownItem
                  key="remark"
                  onPress={() => {
                    setApplicationRemark(item?.remark || "Remark Not Found");
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
      Teams: "",
      Advertisement: "",
      Sports: "",
      Gender: "",
      State: "",
      searchValue: "",
      scrutinyStatus: "",
    });
    getKushalApplications(false);
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
          <FlatCard heading="Application Scrutiny">
            <CardGrid data={cardData} columns={4} />
          </FlatCard>

          <Table
            isStriped
            color="default"
            aria-label="Example static collection table"
            topContent={
              <div className="grid grid-cols-4 flex-col items-end gap-4 mob:flex mob:items-stretch">
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
                  selectedKeys={[filterData?.Advertisement]}
                  label="Post"
                  labelPlacement="outside"
                  placeholder="Select"
                  onChange={(e) => {
                    setFilterData({
                      ...filterData,
                      Advertisement: e.target.value,
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

                {!role?.includes("teamHead") && (
                  <Select
                    items={allFilters?.teams || []}
                    label="Teams"
                    labelPlacement="outside"
                    placeholder="Select"
                    selectedKeys={[filterData?.Teams]}
                    onChange={(e) => {
                      const id = e.target.value || "";
                      getAllSports(id);
                      setFilterData({ ...filterData, Teams: e.target.value });
                    }}
                  >
                    {(item: any) => (
                      <SelectItem key={item?._id}>{item?.groupName}</SelectItem>
                    )}
                  </Select>
                )}

                <Select
                  items={allSports || []}
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
                  label="Scrutiny Status"
                  labelPlacement="outside"
                  placeholder="Select"
                  variant="flat"
                  selectedKeys={[filterData?.scrutinyStatus]}
                  items={[
                    {
                      name: "Accepted",
                      key: "Accepted",
                    },
                    {
                      name: "Pending",
                      key: "Pending",
                    },
                    {
                      name: "Rejected",
                      key: "Rejected",
                    },
                  ]}
                  onChange={(e) => {
                    setFilterData((prev: any) => ({
                      ...prev,
                      scrutinyStatus: e.target.value,
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
                      `v1/ApplicationScrutiny/doanloadApplicationsScrutinyExcel?eventId=678016f9c45d0c0531e4ff87&advertisementId=${currentAdvertisementID}&page=${page}&limit=10&teamId=${filterData?.Teams}&sportId=${filterData?.Sports}&gender=${filterData?.Gender}&state=${filterData?.State}&scrutinyStatus=${filterData?.scrutinyStatus}&paymentStatus=Success&searchValue=${filterData?.searchValue}`,
                      "Document verification",
                      setLoader,
                    );
                  }}
                  pdfFunction={() => {
                    DownloadKushalPdf(
                      `v1/ApplicationScrutiny/doanloadApplicationsScrutinyPDF?eventId=678016f9c45d0c0531e4ff87&advertisementId=${currentAdvertisementID}&page=${page}&limit=10&teamId=${filterData?.Teams}&sportId=${filterData?.Sports}&gender=${filterData?.Gender}&state=${filterData?.State}&scrutinyStatus=${filterData?.scrutinyStatus}&paymentStatus=Success&searchValue=${filterData?.searchValue}`,
                      "Document verification",
                      setLoader,
                    );
                  }}
                  excelLoader={loader?.excel}
                  pdfLoader={loader?.pdf}
                />
                <FilterSearchBtn
                  searchFunc={() => getKushalApplications(true)}
                  clearFunc={clearFilter}
                />
              </div>
            }
            bottomContent={
              totalPage ? (
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

          <Modal
            isOpen={uploadFileModal}
            onOpenChange={(open) => setUploadFileModal(open)}
          >
            <ModalContent>
              {() => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Application Scrutiny Data
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
                    Application Scrutiny Remark
                  </ModalHeader>
                  <ModalBody className="mb-3">
                    <p>{applicationRemark}</p>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>

          <CandidateDetailsModal
            currentApplicationData={currentApplicationData}
            selectedItem={selectedItem}
            setViewModal={setViewModal}
            viewModal={viewModal}
          />
        </>
      )}
    </>
  );
};

export default ApplicationScrutiny;
