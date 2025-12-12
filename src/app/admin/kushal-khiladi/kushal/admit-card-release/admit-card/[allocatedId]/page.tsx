"use client";
import {
  CallGetAdmitCardReleaseApplications,
  CallGetAllKushalFilters,
  CallGetAllSports,
  CallUpdateAdmitCardStatus,
  CallUpdateAdmitCardStatusKushal,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import CardAndTable from "@/components/kushal-components/loader/CardAndTable";
import { DownloadKushalAdmitCard } from "@/Utils/DownloadExcel";
import { handleCommonErrors } from "@/Utils/HandleError";
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
  Pagination,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import moment from "moment";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const columns = [
  { title: "Registration ID", key: "candidateId" },
  { title: "Full name", key: "fullName" },
  { title: "Sports", key: "sportsName" },
  { title: "Gender", key: "gender" },
  { title: "Trial Start Date", key: "trialStartDate" },
  { title: "Trial End Date", key: "trialEndDate" },
  { title: "DV Start Date", key: "dvStartDate" },
  { title: "DV End Date", key: "dvEndDate" },
  { title: "Release Date", key: "created_at" },
  { title: "Status", key: "status" },
  { title: "Actions", key: "actions" },
];

export default function AllAdmitCard() {
  const { currentAdvertisementID } = useAdvertisement();
  const { allocatedId } = useParams();
  const [allFilters, setAllFilters] = useState<any>([]);
  const [allSports, setAllSports] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [releaseAdmitCardDetailsData, setReleaseAdmitCardDetailsData] =
    useState<any>([]);

  const [stats, setStats] = useState<any>([]);
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
    pdf: false,
  });

  const [filterData, setFilterData] = useState<any>({
    Sports: "",
    Gender: "",
    searchValue: "",
  });

  useEffect(() => {
    getAllFilters();
    getAllSports();
  }, []);

  const statusColorMap: { [key: string]: ChipColor } = {
    Generated: "success",
    Hold: "warning",
    Publish: "primary",
  };

  const cardData = [
    {
      title: "Total Candidate",
      value: stats?.totalCandidates,
    },
    {
      title: "Total Download",
      value: stats?.totalDownloads,
    },
    {
      title: "Total Pending",
      value: stats?.totalPending,
    },
  ];

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

  const getAllSports = async () => {
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

  const clearFilter = () => {
    setFilterData({
      Sports: "",
      Gender: "",
      searchValue: "",
      scrutinyStatus: "",
    });
    getReleaseAdmitCardDetails(false);
  };

  const getReleaseAdmitCardDetails = async (filter: boolean) => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    console.log("payload",currentAdvertisementID, allocatedId,filterData?.Sports,filterData?.Gender);
    
    const filterON = `advertisementId=${currentAdvertisementID}&candidateAllocatedId=${allocatedId}&sportId=${filterData?.Sports}&gender=${filterData?.Gender}&searchValue=${filterData?.searchValue}&page=${page}&limit=10`;
    const filterOFF = `advertisementId=${currentAdvertisementID}&candidateAllocatedId=${allocatedId}&sportId=&gender=&searchValue=&page=1&limit=10`;
    try {
      const { data, error } = (await CallGetAdmitCardReleaseApplications(
        filter ? filterON : filterOFF,
      )) as any;

      console.log("CallGetAdmitCardReleaseApplications", data, error);
      if (data?.data) {
        setReleaseAdmitCardDetailsData(data?.data);
        setTotalPage(data?.pagination?.totalPages);
        setStats(data?.stats);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    }
  };

  const holdCandidate = async (id: string) => {
    try {
      const submitData = {
        admitCardStatus: "Hold",
        id: id,
      };
      console.log("submitData", submitData);
      const { data, error } = (await CallUpdateAdmitCardStatusKushal(
        submitData,
      )) as any;

      if (data?.message) {
        toast?.success(data?.message);
        getReleaseAdmitCardDetails(false);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentAdvertisementID) {
      getReleaseAdmitCardDetails(false);
    }
  }, [currentAdvertisementID]);

  useEffect(() => {
    if (currentAdvertisementID) {
      getReleaseAdmitCardDetails(true);
    }
  }, [page]);

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "status":
          return (
            <Chip
              color={statusColorMap[item?.admitCardStatus]}
              variant="flat"
              radius="full"
              className="capitalize"
            >
              {item?.admitCardStatus}
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
                    DownloadKushalAdmitCard(
                      `v1/admin/downloadAdmitCardForKushalKhiladi?applicationId=${item?._id}`,
                      "SportsDetail",
                    );
                  }}
                >
                  Download Admit Card
                </DropdownItem>
                <DropdownItem
                  key="view"
                  onPress={() => {
                    holdCandidate(item?._id);
                  }}
                >
                  Hold Admit Card
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        case "created_at":
        case "trialStartDate":
        case "trialEndDate":
        case "dvStartDate":
        case "dvEndDate":
          return <p>{moment(cellValue).format("DD/MM/YYYY")}</p>;
        default:
          return <p className="capitalize">{cellValue}</p>;
      }
    },
    [page],
  );
  return (
    <>
      {loader.table ? (
        <CardAndTable cardCount={3} filterCount={4} tableColumns={10} />
      ) : (
        <div>
          <FlatCard heading="Admit Cards">
            <CardGrid data={cardData} columns={4} />
          </FlatCard>
          <Table
            isStriped
            color="default"
            aria-label="Example static collection table"
            topContent={
              <div className="grid grid-cols-4 items-end gap-4 mob:flex flex-col mob:items-stretch">
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

                <Autocomplete
                  defaultItems={allSports || []}
                  label="Sports"
                  labelPlacement="outside"
                  defaultSelectedKey={filterData?.Sports}
                  placeholder="Select"
                  onSelectionChange={(e) => {
                    setFilterData((prev: any) => ({
                      ...prev,
                      Sports: e,
                    }));
                  }}
                >
                  {(item: any) => (
                    <AutocompleteItem key={item?._id}>
                      {item?.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>

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
                <FilterSearchBtn
                  searchFunc={() => {
                    getReleaseAdmitCardDetails(true);
                  }}
                  clearFunc={clearFilter}
                />
              </div>
            }
            bottomContent={
              totalPage && (
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
              items={releaseAdmitCardDetailsData}
              emptyContent="No data"
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
        </div>
      )}
    </>
  );
}
