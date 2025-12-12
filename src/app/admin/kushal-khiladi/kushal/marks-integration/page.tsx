"use client";
import {
  CallGetAllSports,
  CallGetMarksIntegrationData,
  CallGetMarksIntegrationFilters,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import TableSkeleton from "@/components/kushal-components/loader/TableSkeleton";
import { DownloadKushalExcel } from "@/Utils/DownloadExcel";
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
} from "@nextui-org/react";
import React, { Key, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const columns = [
  { title: "Sports", key: "sportName" },
  { title: "Chest No.", key: "chestNo" },
  { title: "Full name", key: "fullName" },
  { title: "Gender", key: "gender" },
  { title: "Aadhaar", key: "aadhaarNumber" },
  { title: "Sport Code", key: "sportCode" },
  { title: "Total Marks Obtained ( OUT OF 80)", key: "totalTrialMarks" },
  { title: "Marks out of 20 on Sports Cerificate", key: "marks" },
  // { title: "Rank", key: "rank" },
  { title: "Total Marks", key: "totalMarks" },
];

const MarksIntegration = () => {
  const [loader, setLoader] = useState<any>({
    table: false,
    filters: false,
    excel: false,
  });
  const { currentAdvertisementID } = useAdvertisement();
  const [marksData, setMarksData] = useState<any>([]);
  const [allSports, setAllSports] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [filterData, setFilterData] = useState<any>({
    sports: "",
    gender: "",
  });

  useEffect(() => {
    if (currentAdvertisementID) {
      getMarksData(false);
    }
    getAllSports();
  }, []);

  useEffect(() => {
    if (currentAdvertisementID) {
      getMarksData(true);
    }
  }, [page, currentAdvertisementID]);

  const getAllSports = async () => {
    setLoader((prev: any) => ({
      ...prev,
      filters: true,
    }));
    try {
      const { data, error } = (await CallGetAllSports("")) as any;
      if (data) {
        setAllSports(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        filters: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        filters: false,
      }));
    }
  };

  const getMarksData = async (filter: any) => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    try {
      const FilterOn = `advertisementId=${currentAdvertisementID}&sports=${filterData?.sports}&page=${page}&limit=10&gender=${filterData?.gender}`;
      const FilterOff = `advertisementId=${currentAdvertisementID}&sports=&sportCode=&page=1&limit=10&gender=&rank=`;
      const { data, error } = (await CallGetMarksIntegrationData(
        filter ? FilterOn : FilterOff,
      )) as any;
      if (data?.success) {
        setMarksData(data?.data);
        setTotalPage(data?.pagination?.totalPages);
      }
      if (error) {
        console.log(error);
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

  const clearFilter = () => {
    setFilterData({
      sports: "",
      gender: "",
    });
    getMarksData(false);
  };

  const renderCell = useCallback(
    (item: any, columnKey: Key) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "sportName":
          return <p className="text-nowrap">{cellValue}</p>;
        case "fullName":
          return (
            <p className="text-nowrap capitalize">{item?.fullName || "N/A"}</p>
          );
        case "gender":
          return <p className="capitalize">{item?.gender}</p>;
        case "sportCode":
          return (
            <Chip color={"primary"} variant="flat" radius="full">
              {item?.sportCode}
            </Chip>
          );
        default:
          return cellValue;
      }
    },
    [page],
  );

  return (
    <>
      {loader?.sports ? (
        <FlatCard>
          <TableSkeleton columnsCount={6} filters filtersCount={4} isTitle />
        </FlatCard>
      ) : (
        <Table
          isStriped
          color="default"
          aria-label="Example static collection table"
          topContent={
            <>
              <h2 className="text-xl font-semibold">Marks Integration</h2>

              <div className="grid grid-cols-4 items-end gap-4 mob:flex flex-col mob:items-stretch">
                <Autocomplete
                  label="Sports"
                  labelPlacement="outside"
                  defaultItems={allSports?.filter(
                    (item: any) => !item.parentSportsId,
                  )}
                  placeholder="Select"
                  selectedKey={filterData?.sports}
                  onSelectionChange={(key) => {
                    setFilterData({
                      ...filterData,
                      sports: key,
                    });
                  }}
                  isLoading={loader?.filters}
                >
                  {(item: any) => (
                    <AutocompleteItem key={item?._id}>
                      {item?.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>

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
                    {
                      name: "Other",
                      key: "other",
                    },
                  ]}
                  label="Gender"
                  labelPlacement="outside"
                  placeholder="Select"
                  selectedKeys={[filterData?.gender]}
                  onChange={(e) => {
                    setFilterData({
                      ...filterData,
                      gender: e.target.value,
                    });
                  }}
                >
                  {(item: any) => (
                    <SelectItem key={item?._id}>{item?.name}</SelectItem>
                  )}
                </Select>
                <ExcelPdfDownload
                  excelFunction={() => {
                    DownloadKushalExcel(
                      `v1/admin/downloadMarksIntegrationExcel?advertisementId=${currentAdvertisementID}&sports=${filterData?.sports}&page=${page}&limit=10&gender=${filterData?.gender}`,
                      "Marks-Integration",
                      setLoader,
                    );
                  }}
                  excelLoader={loader?.excel}
                />

                <FilterSearchBtn
                  searchFunc={() => getMarksData(true)}
                  clearFunc={clearFilter}
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
                className="text-wrap"
              >
                {column.title}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={marksData}
            emptyContent={"No data"}
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
      )}
    </>
  );
};

export default MarksIntegration;
