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
import { CallGetCardWiseUserDetails } from "@/_ServerActions";
import CardAndTable from "@/components/kushal-components/loader/CardAndTable";
import { useParams, useRouter } from "next/navigation";
import dynamicData from "@/assets/data/candidateApplication.json";
import CandidateDetailsModal from "@/components/kushal-components/application-scrutiny/CandidateDetailsModal";
import BackButton from "@/components/BackButton";
import { useSessionData } from "@/Utils/hook/useSessionData";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { handleCommonErrors } from "@/Utils/HandleError";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import MaleFemaleButton from "@/components/kushal-components/common/MaleFemaleBtn";
import actionRouteDecider from "@/Utils/kushal-khiladi/actionRouteDecider";
import { candidateLevelColumnDecider } from "@/Utils/kushal-khiladi/CandidateLevelColumns";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const CardDetails = () => {
  const { advertisementId, sessionTeamId } = useSessionData();
  const router = useRouter();
  const { slug } = useParams();
  const status = slug[0];
  const tilesType = slug[1];
  const sports = slug[2];
  const subSports = slug[3] ?? "";
  const duplicateCandidates = slug[4];
  const subSportsCategories = slug[5] ?? "";
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [applications, setApplications] = useState<any>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<any>([]);
  const [viewModal, setViewModal] = useState(false);
  const [currentApplicationData, setCurrentApplicationData] =
    useState<any>(dynamicData);
  const [searchValue, setSearchValue] = useState<any>("");
  const [selectedFilter, setSelectedFilter] = useState<any>({
    gender: "",
  });
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
    pdf: false,
    performance: false,
  });

  useEffect(() => {
    if (slug && advertisementId) {
      getUserDetails(true);
    }
  }, [slug, page, advertisementId, selectedFilter]);

  const getUserDetails = async (filter: boolean) => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    try {
      const FilterOn = `advertisementId=${advertisementId}&gender=${selectedFilter?.gender}&searchValue=${searchValue}&page=${page}&limit=10&teamId=${sessionTeamId}&paymentStatus=Success&status=${status === "total" ? "" : status}&sportId=${sports}&tilesType=${tilesType}&categoryId=${subSportsCategories}&subSportsId=${subSports}&isDuplicate=${duplicateCandidates === "duplicate" ? true : ""}`;
      const FilterOff = `advertisementId=${advertisementId}&gender=&searchValue=&page=1&limit=10&teamId=${sessionTeamId}&paymentStatus=Success&status=${status === "total" ? "" : status}&sportId=${sports}&tilesType=${tilesType}&categoryId=${subSportsCategories}&subSportsId=${subSports}&isDuplicate=${duplicateCandidates === "duplicate" ? true : ""}`;
      const { data, error } = (await CallGetCardWiseUserDetails(
        filter ? FilterOn : FilterOff,
      )) as any;
      console.log("CallGetCardWiseUserDetails", { data, error });
      // console.log("FilterOff", FilterOff);
      console.log("FilterOn", FilterOn);

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

  const statusDecider = (tilesType: string, item: any) => {
    switch (tilesType) {
      case "documentVerification":
        return item?.applicationscreeningsData?.applicationScreeningStatus;

      default:
        return item?.applicationscrutiniesData?.applicationScrutinyStatus;
    }
  };

  const statusColorMap: { [key: string]: ChipColor } = {
    "Ports Certificate - Not of valid tenure": "danger",
    "Sports Certificate - Invalid sports certificate": "danger",
    Rejected: "danger",
    Pending: "warning",
    Accepted: "success",
    Eligible: "success",
    undefined: "default",
  };

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey as any];
      const status = statusDecider(tilesType, item);
      const actions = actionRouteDecider(tilesType, item?._id, "dynamic");
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
              {item?.personalDetails?.fullName || "N/A"}
            </p>
          );
        case "sports":
          return (
            <p className="text-nowrap capitalize">
              {item?.sportsmasterdatasData?.name || "N/A"}
            </p>
          );
        case "subSports":
          return (
            <p className="capitalize">
              {advertisementId === "6779171f01d754ec41746fe3"
                ? "-"
                : item?.subSportsName}
            </p>
          );
        case "state":
          return (
            <p className="text-nowrap capitalize">
              {item?.addressDetails?.presentAddress?.state || "N/A"}
            </p>
          );
        case "gender":
          return <p className="capitalize">{item?.personalDetails?.gender}</p>;
        case "scuritnyStatus":
          return (
            <Chip
              color={statusColorMap[status]}
              variant="flat"
              radius="full"
              className="capitalize"
            >
              {status}
            </Chip>
          );
        case "action":
          return (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button className="more_btn rounded-full px-0" disableRipple>
                  <span className="material-symbols-rounded">more_vert</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                {actions.map((action: any, index: number) => (
                  <DropdownItem key={index} href={action.route}>
                    {action.title}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue;
      }
    },
    [page, tilesType],
  );

  const updateCurrentUserData = (currentItem: any) => {
    if (!currentItem) return dynamicData;

    const jsonUI = dynamicData?.accordionItems || [];
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
    setSelectedFilter({
      gender: "",
    });
    setSearchValue("");
    getUserDetails(false);
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
              {["total", "scrutinized"].includes(status)
                ? "Scrutinized Applications"
                : `${status} Candidates`}{" "}
            </h1>
            <BackButton />
          </div>
          <div className="mb-3 flex justify-end mob:justify-start">
            <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(
                  `v1/admin/downloadApplicationsDataTilesWiseExcel?advertisementId=${advertisementId}&gender=${selectedFilter?.gender}&teamId=${sessionTeamId}&paymentStatus=Success&status=${status === "total" ? "" : status}&sportId=${sports}&tilesType=${tilesType}&categoryId=${subSportsCategories}&subSportsId=${subSports}&isDuplicate=${duplicateCandidates === "duplicate" ? true : ""}`,
                  "SportsDetail",
                  setLoader,
                );
              }}
              pdfFunction={() => {
                DownloadKushalPdf(
                  `v1/admin/downloadApplicationsDataTilesWisePDF?advertisementId=${advertisementId}&gender=${selectedFilter?.gender}&teamId=${sessionTeamId}&paymentStatus=Success&status=${status === "total" ? "" : status}&sportId=${sports}&tilesType=${tilesType}&categoryId=${subSportsCategories}&subSportsId=${subSports}&isDuplicate=${duplicateCandidates === "duplicate" ? true : ""}`,
                  "SportsDetail",
                  setLoader,
                );
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
          </div>
          <Table
            isStriped
            color="default"
            aria-label="Example static collection table"
            topContent={
              <>
                <div className="grid grid-cols-1 items-end gap-2 gap-y-5 lg:grid-cols-2 xl:grid-cols-3">
                  <div className="col-span-1">
                    <p className="mb-2 font-medium">Filters</p>
                    <MaleFemaleButton
                      selectedBtn={selectedFilter?.gender}
                      filterFunction={setSelectedFilter}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      placeholder="Search"
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                      }}
                      startContent={
                        <span className="material-symbols-rounded text-lg text-gray-500">
                          search
                        </span>
                      }
                    />
                  </div>
                  <FilterSearchBtn
                    clearFunc={clearFilter}
                    searchFunc={() => getUserDetails(true)}
                    col="lg:col-start-2 xl:col-start-3 col-span-1"
                  />
                </div>
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
            <TableHeader columns={candidateLevelColumnDecider[tilesType]}>
              {(column: any) => (
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
                        variant="shadow"
                        color="primary"
                        startContent={
                          loader?.performance ? (
                            <Spinner color="white" size="sm" />
                          ) : (
                            <span className="material-symbols-rounded">
                              person
                            </span>
                          )
                        }
                        onPress={() => {
                          setLoader((prev: any) => ({
                            ...prev,
                            performance: true,
                          }));
                          router.push(
                            `/admin/kushal-khiladi/kushal/candidate-performance/${selectedItem?._id}`,
                          );
                        }}
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
                          setViewModal(true);
                          onClose();
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

export default CardDetails;
