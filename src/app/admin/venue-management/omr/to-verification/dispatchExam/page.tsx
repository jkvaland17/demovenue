"use client";

import {
  CallGetAllDistrict,
  CallGetTreasuryCenters,
  CallGetTreasuryMaterialUser,
  CallGetTreasuryMaterialVerification,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
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
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import React, { useEffect, useState } from "react";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

type Props = {};

const DispatchExaminationCenter = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
  const [currentCenter, setCurrentCenter] = useState<any>();
  const [allData, setAllData] = useState<any[]>([]);
  const [currentData, setCurrentData] = useState<any>();
  const [districts, setDistricts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userId, setUserId] = useState<string>("");
    const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });

  const [filterData, setFilterData] = useState<any>({
    searchValue: "",
    shift: "",
    Dispatch: "",
  });
  const statusColorMap: { [key: string]: ChipColor } = {
    Yes: "success",
    No: "danger",
  };

  const cardData = [
    {
      title: "Total Centers",
      value: currentCenter?.totalCenters,
    },
    {
      title: "Total Boxes",
      value: currentCenter?.totalBoxes,
    },
  ];
  const columns = [
    { title: "Center Name", key: "center_name" },
    { title: "Center Code", key: "center_code" },
    { title: "Date", key: "date" },
    { title: "Shift", key: "shift" },
    { title: "Exam time", key: "exam_time" },
    { title: "Series selected for the shift", key: "selected_series" },
    { title: "Selected Boxes Count", key: "selected_box_count" },
    { title: "Dispatched", key: "dispatched" },
    { title: "Remark", key: "remark" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "dispatched":
        return (
          <Chip
            color={statusColorMap[cellValue]}
            variant="flat"
            radius="full"
            className="capitalize"
          >
            {cellValue}
          </Chip>
        );
      case "remark":
        return (
          <Tooltip content="View remark" showArrow={true}>
            <Button
              color="primary"
              radius="full"
              variant="light"
              size="sm"
              isIconOnly
              onPress={() => {
                onOpen();
                setCurrentData(item);
              }}
              startContent={
                <span className="material-symbols-rounded">visibility</span>
              }
            ></Button>
          </Tooltip>
        );
      default:
        return <p className="capitalize">{cellValue}</p>;
    }
  }, []);

  const getTreasuryCenters = async (userId: string) => {
    setIsLoading(true);
    try {
      const query = `district=${selectedDistrict}&userId=${userId}&shift=${filterData?.shift}&Dispatch=${filterData?.Dispatch}&searchValue=${filterData?.searchValue}`;
      const { data, error } = (await CallGetTreasuryCenters(query)) as any;
      console.log("getTreasuryCenters", { data, error });

      if (data) {
        setCurrentCenter(data.data);
        setAllData(data?.data?.centerData);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getAllDistrict = async () => {
    try {
      const { data, error } = (await CallGetAllDistrict()) as any;
      console.log("getAllDistrict", { data, error });

      if (data) {
        setDistricts(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllDistrict();
  }, []);

  const getUsers = async (districtId: string) => {
    setIsUserLoading(true);
    try {
      const query = `advertisementId=${currentAdvertisementID}&district=${districtId}`;
      const { data, error } = (await CallGetTreasuryMaterialUser(query)) as any;
      console.log("getUsers", { data, error });

      if (data) {
        setUsers(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsUserLoading(false);
  };

  const clearFilter = () => {
    setFilterData({
      searchValue: "",
      shift: "",
      Dispatch: "",
    });
    getTreasuryCenters(userId);
  };

  // console.log("filterData", filterData);

  return (
    <>
      <FlatCard heading="Dispatch of confidential material to the Examination Centre">
        <div className="grid grid-cols-2 gap-4">
          <Autocomplete
            defaultItems={districts}
            label="Select District"
            labelPlacement="outside"
            placeholder="Select"
            isRequired
            onSelectionChange={(e: any) => {
              if (e) {
                getUsers(e);
              } else {
                setUsers([]);
              }
              setSelectedDistrict(e);
            }}
          >
            {(item: any) => (
              <AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>
            )}
          </Autocomplete>

          <Autocomplete
            defaultItems={users}
            label="Select User"
            labelPlacement="outside"
            placeholder="Select"
            isRequired
            isLoading={isUserLoading}
            onSelectionChange={(e: any) => {
              if (e) {
                getTreasuryCenters(e);
                setUserId(e);
              }
            }}
          >
            {(item: any) => (
              <AutocompleteItem key={item?.user?._id}>
                {item?.user?.userId}
              </AutocompleteItem>
            )}
          </Autocomplete>
        </div>
      </FlatCard>

      <div className={`${!currentCenter && "hidden"}`}>
        <FlatCard>
          <div className="mb-4 flex justify-between gap-6">
            <p className="text-lg font-medium">
              Exam Date: {currentCenter?.examDate}
            </p>
            <div className="flex gap-2">
              <p className="text-lg font-medium">Final submit status:</p>
              <Chip
                variant="flat"
                color={currentCenter?.finalSubmit ? "success" : "danger"}
              >
                {currentCenter?.finalSubmit ? "Submitted" : "Not Submitted"}
              </Chip>
            </div>
          </div>
          <CardGrid data={cardData} columns={4} />
        </FlatCard>
      </div>

      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        className="mb-4"
        topContent={
                  <div className="grid grid-cols-4 tab:grid-cols-1 gap-4 mob:flex flex-col">
      <div className="flex gap-2 col-span-3">
            <Input
              value={filterData?.searchValue}
              label="Search"
              labelPlacement="outside"
              placeholder="Search by center name"
              startContent={
                <span className="material-symbols-rounded text-gray-500">
                  search
                </span>
              }
              onChange={(e) => {
                setFilterData({
                  ...filterData,
                  searchValue: e.target.value,
                });
              }}
            />
            <Select
              items={[
                { key: "1", label: "1" },
                { key: "2", label: "2" },
              ]}
              selectedKeys={[filterData?.shift]}
              label="Shift"
              labelPlacement="outside"
              placeholder="Select"
              onChange={(e) => {
                setFilterData({
                  ...filterData,
                  shift: e.target.value,
                });
              }}
            >
              {(item: any) => (
                <SelectItem key={item?.key}>{item?.label}</SelectItem>
              )}
            </Select>
            <Select
              items={[
                { key: "Yes", label: "Yes" },
                { key: "No", label: "No" },
              ]}
              selectedKeys={[filterData?.Dispatch]}
              label="Dispatch Status"
              classNames={{
                label: "text-nowrap"
              }}
              labelPlacement="outside"
              placeholder="Select"
              onChange={(e) => {
                setFilterData({
                  ...filterData,
                  Dispatch: e.target.value,
                });
              }}
            >
              {(item: any) => (
                <SelectItem key={item?.key}>{item?.label}</SelectItem>
              )}
              </Select>
               <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(``, "Document verification", setLoader);
              }}
              pdfFunction={() => {
                DownloadKushalPdf(``, "Document verification", setLoader);
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
            </div>
            <FilterSearchBtn
              searchFunc={() => {
                getTreasuryCenters(userId);
              }}
              clearFunc={() => {
                clearFilter();
              }}
            />
          </div>
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
              className="text-wrap mob:text-nowrap"
            >
              {column.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={allData}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent="No data"
        >
          {(item: any) => (
            <TableRow key={`${item?.shift}-${item?.date}`}>
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
              <ModalHeader className="flex flex-col gap-1">
                View Remark
              </ModalHeader>
              <ModalBody>
                <p className="mb-4">{currentData?.extra_comment}</p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DispatchExaminationCenter;
