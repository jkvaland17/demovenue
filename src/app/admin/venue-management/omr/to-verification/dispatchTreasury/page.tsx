"use client";

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
import imageIcon from "@/assets/img/icons/image.png";
import Link from "next/link";
import Image from "next/image";
import {
  CallGetAllDistrict,
  CallGetCentersToTreasury,
  CallGetTreasuryMaterialUser,
  CallGetTreasuryMaterialVerification,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

type Props = {};

const DispatchExaminationTreasury = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
  const [currentCenter, setCurrentCenter] = useState<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [districts, setDistricts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });

  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userId, setUserId] = useState<string>("");
  const [filterData, setFilterData] = useState<any>({
    searchValue: "",
    box1Status: "",
    box2Status: "",
  });
  const statusColorMap: { [key: string]: ChipColor } = {
    yes: "success",
    no: "danger",
  };

  const cardData = [
    {
      title: "Total Centers",
      value: currentCenter?.totalCenters,
    },
  ];
  const columns = [
    { title: "Center Name", key: "center_name" },
    { title: "Center Code", key: "center_code" },
    { title: "Box 1", key: "box_1" },
    { title: "Box 2", key: "box_2" },
    { title: "Photos", key: "photos" },
    { title: "Remark", key: "remark" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "box_1":
      case "box_2":
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
      case "photos":
        return (
          <Link href={`#`} target="_blank">
            <Image
              src={imageIcon}
              alt="img"
              className="h-[40px] w-[40px] object-contain"
            />
          </Link>
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
                setCurrentRow(item);
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
      const query = `district=${selectedDistrict}&userId=${userId}&searchValue=${filterData?.searchValue}&box1Status=${filterData?.box1Status}&box2Status=${filterData?.box2Status}`;
      const { data, error } = (await CallGetCentersToTreasury(query)) as any;
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
      // console.log("getAllDistrict", { data, error });

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
      box1Status: "",
      box2Status: "",
    });
    getTreasuryCenters(userId);
  };

  console.log("filterData", filterData);
  return (
    <>
      <FlatCard
        heading=" Dispatch Confidential material from the Examination Centre to
            Treasury"
      >
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
          <div className="grid grid-cols-4 flex-col gap-4 mob:flex tab:grid-cols-1">
            <div className="col-span-3 flex gap-2">
              <Input
                value={filterData?.searchValue}
                label="Search"
                labelPlacement="outside"
                placeholder="Search by center name"
                onChange={(e) => {
                  setFilterData({
                    ...filterData,
                    searchValue: e.target.value,
                  });
                }}
                startContent={
                  <span className="material-symbols-rounded text-gray-500">
                    search
                  </span>
                }
              />

              <Select
                items={[
                  { key: "yes", label: "Yes" },
                  { key: "no", label: "No" },
                ]}
                selectedKeys={[filterData?.box1Status]}
                onChange={(e) => {
                  setFilterData({
                    ...filterData,
                    box1Status: e.target.value,
                  });
                }}
                label="Box 1 Status"
                labelPlacement="outside"
                placeholder="Select"
              >
                {(item: any) => (
                  <SelectItem key={item?.key}>{item?.label}</SelectItem>
                )}
              </Select>
              <Select
                items={[
                  { key: "yes", label: "Yes" },
                  { key: "no", label: "No" },
                ]}
                selectedKeys={[filterData?.box2Status]}
                onChange={(e) => {
                  setFilterData({
                    ...filterData,
                    box2Status: e.target.value,
                  });
                }}
                label="Box 2 Status"
                labelPlacement="outside"
                placeholder="Select"
              >
                {(item: any) => (
                  <SelectItem key={item?.key}>{item?.label}</SelectItem>
                )}
              </Select>
            </div>
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
            <FilterSearchBtn
              clearFunc={() => {
                clearFilter();
              }}
              searchFunc={() => {
                getTreasuryCenters(userId);
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
              key={column?.key}
              align={column?.key === "actions" ? "center" : "start"}
              className="text-wrap mob:text-nowrap tab:text-nowrap"
            >
              {column?.title}
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
              <ModalHeader className="flex flex-col gap-1">Remark</ModalHeader>
              <ModalBody>
                <p className="mb-4">{currentRow?.extra_comment}</p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DispatchExaminationTreasury;
