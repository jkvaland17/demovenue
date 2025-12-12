"use client";

import {
  CallGetMaterialReceipt,
  CallGetTreasuryMaterialVerification,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import { handleCommonErrors } from "@/Utils/HandleError";
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
  Select,
  SelectItem,
  Spinner,
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

const ConfidentialMaterialReceipt = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
  const [allData, setAllData] = useState<any[]>([]);
  const [currentData, setCurrentData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });

  const {
    isOpen: isVehicle,
    onOpen: onVehicle,
    onOpenChange: onOpenVehicle,
  } = useDisclosure();

  const statusColorMap: { [key: string]: ChipColor } = {
    Yes: "success",
    No: "danger",
  };

  const columns = [
    { title: "District", key: "district" },
    { title: "User ID", key: "userId" },
    { title: "Total no. of Vehicle", key: "totalVehicle" },
    { title: "Total no. of Boxes", key: "totalBoxes" },
    { title: "Total no. of Stationary Boxes", key: "totalStationaryBoxes" },
    { title: "Date", key: "date" },
    { title: "Start Time", key: "startTime" },
    { title: "End Time", key: "endTime" },
    { title: "All Series Done", key: "seriesDone" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "district":
        return <p className="capitalize">{item?.district?.name}</p>;
      case "userId":
        return <p>{item?.user?.userId}</p>;
      case "totalVehicle":
        return (
          <p className="capitalize">
            {item?.materialReceiptData?.totalVehicles}
          </p>
        );
      case "totalBoxes":
        return (
          <p className="capitalize">{item?.materialReceiptData?.totalBoxes}</p>
        );
      case "totalStationaryBoxes":
        return (
          <p className="capitalize">
            {item?.materialReceiptData?.totalStationeryBoxes}
          </p>
        );
      case "date":
        return (
          <p className="text-nowrap capitalize">
            {item?.materialReceiptData?.captureDate}
          </p>
        );
      case "startTime":
        return (
          <p className="text-nowrap uppercase">
            {item?.materialReceiptData?.startTime}
          </p>
        );
      case "endTime":
        return (
          <p className="uppercase">{item?.materialReceiptData?.endTime}</p>
        );
      case "seriesDone":
        return (
          <Chip
            color={
              item?.materialReceiptData?.finalSubmit ? "success" : "danger"
            }
            variant="flat"
            radius="full"
            className="capitalize"
          >
            {item?.materialReceiptData?.finalSubmit ? "Yes" : "No"}
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
                key="vehicle"
                onPress={() => {
                  setCurrentData(item);
                  onVehicle();
                }}
              >
                View Vehicles and Series Data
              </DropdownItem>
              <DropdownItem key="remark" onPress={onOpen}>
                View Remark
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return <p className="capitalize">{cellValue}</p>;
    }
  }, []);

  const seriesStatus = [
    { series: "Series - A" },
    { series: "Series - B" },
    { series: "Series - C" },
    { series: "Series - D" },
    { series: "Series - E" },
    { series: "Series - F" },
    { series: "Series - G" },
    { series: "Series - H" },
    { series: "Series - J" },
    { series: "Series - K" },
    { series: "Series - L" },
    { series: "Series - M" },
    { series: "Series - N" },
    { series: "Series - P" },
    { series: "Series - Q" },
    { series: "Series - R" },
    { series: "Series - S" },
  ];

  const getReceiptData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = (await CallGetMaterialReceipt()) as any;
      console.log("getReceiptData", { data, error });

      if (data) {
        setAllData(data?.data);
        setTotalPage(data?.pagination?.totalPages);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (currentAdvertisementID) {
      getReceiptData();
    }
  }, [currentAdvertisementID]);

  const formatVehicleNumber = (vehicleNo: string) => {
    const upper = vehicleNo.toUpperCase();
    const match = upper.match(/^([A-Z]{2})(\d{2})([A-Z]{2,3})(\d{4})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    return vehicleNo;
  };

  const isSeriesReceived = (
    series: string,
    apiList: { series_name: string }[],
  ) => {
    return apiList.some((item) => item.series_name === series);
  };

  return (
    <>
      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        className="mb-4"
        topContent={
          <>
            <h2 className="text-xl font-semibold">
              Confidential Material Receipt
            </h2>
            <div className="grid grid-cols-4 flex-col gap-4 mob:flex tab:grid-cols-1">
              <div className="col-span-2 flex gap-2 mob:w-full">
                <Input
                  label="Search"
                  labelPlacement="outside"
                  placeholder="Search"
                  startContent={
                    <span className="material-symbols-rounded text-gray-500">
                      search
                    </span>
                  }
                />
                <Select
                  items={[
                    { key: "Yes", label: "Yes" },
                    { key: "No", label: "No" },
                  ]}
                  label="All Series Done"
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
                DownloadKushalExcel(`v1/treasury_material_verification/materialReceiptDataIdExcel`, "Confidential Material Receipt", setLoader);
              }}
              pdfFunction={() => {
                DownloadKushalPdf(`v1/treasury_material_verification/materialReceiptDataIdPdf`, "Confidential Material Receipt", setLoader);
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
              <FilterSearchBtn clearFunc={() => {}} searchFunc={() => {}} />
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
              className="text-wrap mob:text-nowrap tab:text-nowrap"
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
            <TableRow key={item?._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal size="5xl" isOpen={isVehicle} onOpenChange={onOpenVehicle}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>District: {currentData?.district?.name}</ModalHeader>
              <ModalBody>
                <div className="mb-4">
                  <p className="mb-2 text-lg font-semibold">Vehicles</p>
                  <div className="grid grid-cols-6 gap-2 mob:grid-cols-1">
                    {currentData?.materialReceiptData?.vehicleData.map(
                      (vehicle: any, index: number) => (
                        <VehicleChip
                          vehicle={formatVehicleNumber(vehicle?.vehicle_no)}
                          srNo={index + 1}
                          key={index}
                        />
                      ),
                    )}
                  </div>
                </div>

                <div className="mb-2">
                  <p className="mb-2 text-lg font-semibold">Series</p>
                  <div className="flex flex-wrap gap-3">
                    {seriesStatus.map((item, index) => (
                      <Chip
                        classNames={{
                          base: `${isSeriesReceived(item.series, currentData?.materialReceiptData?.seriesData) ? "bg-[#208b3a]" : "bg-[#e01e37]"}`,
                          content: "text-white",
                        }}
                        size="lg"
                        key={index}
                      >
                        {item.series}
                      </Chip>
                    ))}
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                View Remark
              </ModalHeader>
              <ModalBody>{currentData?.extra_comment}</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const VehicleChip = ({ vehicle, srNo }: { vehicle: string; srNo: number }) => {
  return (
    <div className="flex items-center gap-2 rounded-full bg-[#163278] p-2">
      <div className="flex h-[25px] w-[25px] min-w-[25px] items-center justify-center rounded-full bg-white text-small font-medium text-[#163278]">
        {srNo}
      </div>
      <p className="text-small text-white">{vehicle}</p>
    </div>
  );
};

export default ConfidentialMaterialReceipt;
