"use client";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Pagination,
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
import { CallGetApplicationsScrutiny } from "@/_ServerActions";
import Link from "next/link";
import CardAndTable from "@/components/kushal-components/loader/CardAndTable";
import { useParams } from "next/navigation";
import dynamicData from "@/assets/data/viewModalData.json";
import CandidateDetailsModal from "@/components/kushal-components/application-scrutiny/CandidateDetailsModal";
import FlatCard from "@/components/FlatCard";
import BackButton from "@/components/BackButton";
import { useSessionData } from "@/Utils/hook/useSessionData";
import { DownloadKushalExcel } from "@/Utils/DownloadExcel";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { handleCommonErrors } from "@/Utils/HandleError";

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
  const { advertisementId, sessionTeamId } = useSessionData();
  const { slug } = useParams();
  const scrutinyStatus = slug[0];
  const sports = slug[1];
  const subSports = slug[2] ?? "";
  const duplicateCandidates = slug[3];
  const subSportsCategories = slug[4] ?? "";
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [applications, setApplications] = useState<any>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<any>([]);
  const [viewModal, setViewModal] = useState(false);
  const [currentApplicationData, setCurrentApplicationData] =
    useState<any>(dynamicData);

  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });

  useEffect(() => {
    if (slug && advertisementId) {
      getKushalApplications();
    }
  }, []);

  useEffect(() => {
    if (slug && advertisementId) {
      getKushalApplications();
    }
  }, [slug, page, advertisementId]);

  const getKushalApplications = async () => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    try {
      const query = `eventId=678016f9c45d0c0531e4ff87&advertisementId=${advertisementId}&page=${page}&limit=10&teamId=${sessionTeamId}&paymentStatus=Success&scrutinyStatus=${scrutinyStatus === "total" ? "" : scrutinyStatus}&sportId=${sports}&subSportsId=${subSports}&subSportsCategoriesId=${subSportsCategories}&isDuplicate=${duplicateCandidates ? true : ""}`;
      const { data, error } = (await CallGetApplicationsScrutiny(query)) as any;
      if (data) {
        setApplications(data?.applications);
        setTotalPage(data?.totalPages);
      }
      if (error) {
        handleCommonErrors(error);
      }
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

  const statusColorMap: { [key: string]: ChipColor } = {
    "Ports Certificate - Not of valid tenure": "danger",
    "Sports Certificate - Invalid sports certificate": "danger",
    Rejected: "danger",
    Pending: "warning",
    Accepted: "success",
    undefined: "default",
  };

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "candidateId":
          return (
            <p
              className="cursor-pointer text-blue-600"
              onClick={() => {
                setSelectedItem(item);
                onOpen();
              }}
            >
              {item?.userDetails?.candidateId}
            </p>
          );
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
              {advertisementId === "6779171f01d754ec41746fe3"
                ? "-"
                : item?.applicationDetails?.subSportsName}
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
              color={statusColorMap[item?.applicationDetails?.scrutinyStatus]}
              variant="flat"
              radius="full"
              className="capitalize"
            >
              {item?.applicationDetails?.scrutinyStatus}
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
                  key="scrutiny"
                  href={`/admin/kushal-khiladi/kushal/application-scrutiny/candidate-application-scrutiny/${item?.applicationDetails?._id}`}
                >
                  Scrutiny
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
    const jsonUI = currentApplicationData?.accordionItems;

    const getNestedValue = (path: any, obj: any) =>
      path
        .split(".")
        .reduce((acc: any, key: any) => (acc ? acc[key] : "NA"), obj);

    return jsonUI?.map((section: any) => {
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

  return (
    <>
      {loader?.table ? (
        <CardAndTable
          cardCount={4}
          filterCount={6}
          tableColumns={7}
          tableRows={10}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="mb-4 text-2xl font-semibold">
              {scrutinyStatus == "total" ? "Total" : scrutinyStatus} Candidates
            </h1>
            <BackButton />
          </div>
          <Table
            isStriped
            color="default"
            aria-label="Example static collection table"
            topContent={
              <>
                <ExcelPdfDownload
                  excelFunction={() => {
                    DownloadKushalExcel(
                      `v1/ApplicationScrutiny/doanloadApplicationsScrutinyExcel?eventId=678016f9c45d0c0531e4ff87&advertisementId=${advertisementId}&page=${page}&limit=10&teamId=${sessionTeamId}&paymentStatus=Success&scrutinyStatus=${scrutinyStatus === "total" ? "" : scrutinyStatus}&sportId=${sports}`,
                      "SportsDetail",
                      setLoader,
                    );
                  }}
                  excelLoader={loader?.excel}
                />
              </>
            }
            bottomContent={
              <div className="flex justify-end">
                <Pagination
                  showControls
                  total={totalPage}
                  page={page}
                  onChange={(page) => {
                    setPage(page);
                  }}
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

          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col">Action</ModalHeader>
                  <ModalBody>
                    <div className="mb-3 grid grid-cols-1 gap-3">
                      <Button
                        as={Link}
                        variant="shadow"
                        color="primary"
                        startContent={
                          <span className="material-symbols-rounded">
                            person
                          </span>
                        }
                        href={`/admin/kushal-khiladi/kushal/candidate-performance/${selectedItem?.applicationDetails?._id}`}
                      >
                        View Candidate Performance
                      </Button>
                      <Button
                        variant="shadow"
                        color="primary"
                        startContent={
                          <span className="material-symbols-rounded">
                            list_alt
                          </span>
                        }
                        onPress={() => {
                          const updatedJson =
                            updateCurrentUserData(selectedItem);
                          setCurrentApplicationData(updatedJson);
                          onClose();
                          setViewModal(true);
                        }}
                      >
                        View Candidates Application
                      </Button>
                    </div>
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
