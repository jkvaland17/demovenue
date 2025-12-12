"use client";
import { CallGetAllAdvertisement } from "@/_ServerActions";
import SearchInput from "@/components/Custom/SearchInput";
import TableSkeleton from "@/components/kushal-components/loader/TableSkeleton";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const columns = [
  { title: "Advertisement reference", key: "advertisementNumberInEnglish" },
  { title: "Adhyaachan reference", key: "adhiyaachanReferenceNumbers" },
  { title: "Release date", key: "releaseDate" },
  { title: "Created Advertisement", key: "createdAt" },
  { title: "Actions", key: "actions" },
];

const AdvertisementTable = () => {
  const [allList, setAllList] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<any>("");
  const [loader, setLoader] = useState<any>({
    table: false,
    updateDetails: false,
  });
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<any>("");
  const router = useRouter();

  const getAdvertisementTableList = async (filter: any) => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    const filterON = `page=${page}&limit=10&advertisementReferenceNumber=${searchValue}`;
    const filterOFF = `page=&limit=10&advertisementReferenceNumber=`;
    try {
      const { data, error } = (await CallGetAllAdvertisement(
        filter ? filterON : filterOFF,
      )) as any;
      console.log("data", data);
      
      if (data?.data) {
        setAllList(data?.data?.result);
        setTotalPages(data?.data?.totalPages);
      }
      if (error) {
        handleCommonErrors(Error);
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

  useEffect(() => {
    getAdvertisementTableList(false);
  }, [page]);

  const handleEdit = (id: any) => {
    router.push(
      `/admin/adhiyaachan-advertisement/advertisement-details?id=${id}`,
    );
  };

  const renderCell = useCallback(
    (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "advertisementNumberInEnglish":
          return <p>{item?.advertisementNumberInEnglish || "-"}</p>;
        case "adhiyaachanReferenceNumbers":
          return (
            <div className="mr-5 flex gap-1">
              {item?.adhiyaachanDetails?.map((details: any) => (
                <Chip
                  key={details?._id}
                  variant="flat"
                  color="primary"
                  size="sm"
                >
                  {details?.referenceNumber || "-"}
                </Chip>
              ))}
            </div>
          );
        case "releaseDate":
          return <p>{moment(cellValue).format("DD-MM-YYYY")}</p>;
        case "createdAt":
          return <p>{moment(cellValue).format("DD-MM-YYYY")}</p>;
        case "actions":
          return (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button className="more_btn rounded-full px-0" disableRipple>
                  <span className="material-symbols-rounded">more_vert</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="1" onPress={() => handleEdit(item?._id)}>
                  Edit
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return "";
      }
    },
    [page, allList],
  );

  return (
    <>
      <h1 className="mb-5 text-2xl font-semibold">Advertisement Table</h1>
      {loader.table ? (
        <TableSkeleton columnsCount={5} />
      ) : (
        <Table
          className="mt-8"
          color="default"
          aria-label="Example static collection table"
          topContent={
            <SearchInput
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              functionCall={getAdvertisementTableList}
            />
          }
          bottomContent={
            <div className="flex justify-end">
              <Pagination
                showControls
                page={page}
                total={totalPages ?? 0}
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
              >
                {column.title}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={allList}>
            {(item: any) => (
              <TableRow key={item._id}>
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

export default AdvertisementTable;
