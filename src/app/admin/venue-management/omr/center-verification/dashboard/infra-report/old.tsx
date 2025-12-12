"use client";

import FilterSearchBtn from "@/components/FilterSearchBtn";
import {
  Button,
  Card,
  Chip,
  Divider,
  Pagination,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import check from "@/assets/img/icons/check.png";
import warning from "@/assets/img/icons/warning.png";
import {
  CallGetAllCenters,
  CallGetAllDistricts,
  CallGetAllInfraData,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import { useAdvertisement } from "@/components/AdvertisementContext";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";

type Props = {};

const InfraReport = (props: Props) => {
  const router = useRouter();
  const [allDistricts, setAllDistricts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [allCenter, setAllCenter] = useState<any[]>([]);
  const [filterData, setFitlerData] = useState<any>({
    center: "",
    district: "",
  });
  const [allData, setAllData] = useState<any[]>([]);
  const { currentAdvertisementID } = useAdvertisement();
  const [loaderDownload, setLoaderDownload] = useState<any>({
    excel: false,
    pdf: false,
  });

  const getAllDistricts = async () => {
    try {
      const { data, error } = (await CallGetAllDistricts()) as any;
      if (data) {
        setAllDistricts(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCenters = async () => {
    try {
      const { data, error } = (await CallGetAllCenters()) as any;
      if (data) {
        setAllCenter(data?.data);
        setTotalPage(data?.pagination?.totalPages);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllInfraData = async (filter: boolean) => {
    try {
      setIsLoading(true);
      const filterON = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}&district=${filterData?.district}&center=${filterData?.center}`;
      const filterOFF = `page=&limit=10&advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetAllInfraData(
        filter ? filterON : filterOFF,
      )) as any;
      console.log("getAllInfraData", data);
      if (data) {
        setAllData(data?.stats);
        setIsLoading(false);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllDistricts();
    getAllCenters();
    if (currentAdvertisementID) {
      getAllInfraData(false);
    }
  }, [currentAdvertisementID]);

  const columns = [
    { title: "District", key: "district" },
    { title: "Raw Capacity", key: "rawCapacity" },
    { title: "Allocated", key: "allocated" },
    { title: "Required", key: "required" },
    { title: "Status", key: "status" },
    { title: "CCTV Total", key: "cctvTotal" },
    { title: "CCTV Req.", key: "cctvRequired" },
    { title: "Webcam", key: "webcam" },
    { title: "Biometric", key: "biometric" },
    { title: "IRIS", key: "iris" },
    { title: "Aadhaar", key: "aadhaar" },
    { title: "Bio Staff", key: "bioStaff" },
    { title: "Frisking", key: "frisking" },
    { title: "HHMD", key: "hhmd" },
    { title: "Female Area", key: "femaleArea" },
    { title: "Female Staff", key: "femaleStaff" },
    { title: "Superintendent", key: "superintendent" },
    { title: "Head", key: "head" },
    { title: "Assistant", key: "assistant" },
    { title: "Invigilator", key: "invigilator" },
    { title: "Asst. Invig.", key: "asstInvigilator" },
    { title: "Electrician", key: "electrician" },
    { title: "Support", key: "support" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "district":
        return <p className="font-semibold capitalize">{item?.districtName}</p>;
      case "allocated":
        return (
          <Chip
            variant="flat"
            color="primary"
            size="sm"
            className="font-medium"
            classNames={{ base: "p-5", content: "font-medium" }}
          >
            <span className="text-center">
              {cellValue?.value || "0"} <br /> ({cellValue?.percentage || "0 %"}
              )
            </span>
          </Chip>
        );
      case "required":
        return <p>{0}</p>;
      case "cctvTotal":
        return <span>{item?.outsideRoom?.totalCCTV}</span>;
      case "cctvRequired":
        return <span>{item?.roomcctv?.total_required_cctv}</span>;
      case "status":
        return (
          <div className="pe-4">
            <div className="mb-2 flex items-center gap-2">
              <Image
                src={check.src}
                alt="check"
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
              />
              <p className="text-sm font-medium text-slate-500">{0}</p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src={warning.src}
                alt="warning"
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
              />
              <p className="text-sm font-medium text-slate-500">{0}</p>
            </div>
          </div>
        );
      case "webcam":
        return (
          <div className="pe-4">
            <div className="mb-2 flex items-center gap-2">
              <Image
                src={check.src}
                alt="check"
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
              />
              <p className="text-sm font-medium text-slate-500">
                {item?.biometricDevice?.webcam}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src={warning.src}
                alt="warning"
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
              />
              <p className="text-sm font-medium text-slate-500">
                {Math.max(
                  0,
                  item?.biometricDevice?.webcam -
                    item?.biometricDevice?.webcam_required,
                )}
              </p>
            </div>
          </div>
        );
      case "biometric":
        return (
          <div className="pe-4">
            <div className="mb-2 flex items-center gap-2">
              <Image
                src={check.src}
                alt="check"
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
              />
              <p className="text-sm font-medium text-slate-500">
                {item?.biometricDevice?.biometric_devices}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src={warning.src}
                alt="warning"
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
              />
              <p className="text-sm font-medium text-slate-500">
                {Math.max(
                  0,
                  item?.biometricDevice?.biometric_devices -
                    item?.biometricDevice?.biometric_devices_required,
                )}
              </p>
            </div>
          </div>
        );
      case "iris":
        return (
          <div className="pe-4">
            <div className="mb-2 flex items-center gap-2">
              <Image
                src={check.src}
                alt="check"
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
              />
              <p className="text-sm font-medium text-slate-500">
                {item?.biometricDevice?.iris}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src={warning.src}
                alt="warning"
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
              />
              <p className="text-sm font-medium text-slate-500">
                {Math.max(
                  0,
                  item?.biometricDevice?.iris -
                    item?.biometricDevice?.iris_required,
                )}
              </p>
            </div>
          </div>
        );
      case "aadhaar":
        return (
          <div className="pe-4">
            <div className="mb-2 flex items-center gap-2">
              <Image
                src={check.src}
                alt="check"
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
              />
              <p className="text-sm font-medium text-slate-500">
                {item?.biometricDevice?.aadhaar}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src={warning.src}
                alt="warning"
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
              />
              <p className="text-sm font-medium text-slate-500">
                {Math.max(
                  0,
                  item?.biometricDevice?.aadhaar -
                    item?.biometricDevice?.aadhaar_required,
                )}
              </p>
            </div>
          </div>
        );
      case "bioStaff":
        return (
          <div className="pe-4">
            <div className="mb-2 flex items-center gap-2">
              <Image
                src={check.src}
                alt="check"
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
              />
              <p className="text-sm font-medium text-slate-500">
                {item?.biometricDevice?.biometric_manpower}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src={warning.src}
                alt="warning"
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
              />
              <p className="text-sm font-medium text-slate-500">
                {Math.max(
                  0,
                  item?.biometricDevice?.biometric_manpower -
                    item?.biometricDevice?.biometric_manpower_required,
                )}
              </p>
            </div>
          </div>
        );
      case "frisking":
        return <p>{item?.checkingFrisking?.deputy_staff || 0}</p>;
      case "hhmd":
        return <p>{item?.checkingFrisking?.hhmd || 0}</p>;
      case "femaleArea":
        return (
          <p>{item?.checkingFrisking?.female_frisking_enclosure_count || 0}</p>
        );
      case "femaleStaff":
        return <p>{item?.checkingFrisking?.female_staff || 0}</p>;
      case "superintendent":
        return <p>{item?.centerStaff?.centreSuperintendent || 0}</p>;
      case "head":
        return <p>{0}</p>;
      case "assistant":
        return <p>{item?.centerStaff?.examination_assistant_required || 0}</p>;
      case "invigilator":
        return <p>{item?.centerStaff?.room_invigilator || 0}</p>;
      case "asstInvigilator":
        return <p>{item?.centerStaff?.assistant_room_invigilator || 0}</p>;
      case "electrician":
        return <p>{0}</p>;
      case "support":
        return <p>{item?.centerStaff?.supporting_staff_count || 0}</p>;
      default:
        return <p className="capitalize">{cellValue}</p>;
    }
  }, []);

  const clearFilter = () => {
    setFitlerData({
      center: "",
      district: "",
    });
    getAllInfraData(false);
  };

  return (
    <>
      <Button
        radius="full"
        className="mb-4 font-medium"
        onPress={() => {
          router.back();
        }}
        startContent={
          <span className="material-symbols-rounded">arrow_back</span>
        }
      >
        Go Back
      </Button>

      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        className="mb-6"
        topContentPlacement="outside"
        bottomContentPlacement="outside"
        topContent={
          <Card className="p-4">
            <h1 className="text-xl font-semibold">
              District Infrastructure Data
            </h1>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div className="min-w-[200px] flex-1">
                <Select
                  label="District"
                  labelPlacement="outside"
                  placeholder="Select"
                  items={allDistricts}
                  selectedKeys={
                    filterData?.district ? [filterData.district] : []
                  }
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setFitlerData((prev: any) => ({
                      ...prev,
                      district: selectedKey,
                    }));
                  }}
                >
                  {(item: any) => (
                    <SelectItem key={item?._id}>{item?.district}</SelectItem>
                  )}
                </Select>
              </div>

              <div className="min-w-[200px] flex-1">
                <Select
                  label="Center"
                  labelPlacement="outside"
                  placeholder="Select"
                  items={allCenter}
                  selectedKeys={filterData?.center ? [filterData.center] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setFitlerData((prev: any) => ({
                      ...prev,
                      center: selectedKey,
                    }));
                  }}
                >
                  {(item: any) => (
                    <SelectItem key={item?._id}>{item?.school_name}</SelectItem>
                  )}
                </Select>
              </div>

              <FilterSearchBtn
                searchFunc={() => {
                  getAllInfraData(true);
                }}
                clearFunc={clearFilter}
              />

              <ExcelPdfDownload
                excelFunction={() =>
                  DownloadKushalExcel(
                    `v1/center_verification/admin/getCentersByDistrictExcel?advertisementId=${currentAdvertisementID}&district=${filterData?.district}&center=${filterData?.center}`,
                    "Infra Report",
                    setLoaderDownload,
                  )
                }
                pdfFunction={() =>
                  DownloadKushalPdf(
                    `v1/center_verification/admin/getCentersByDistrictPdf?advertisementId=${currentAdvertisementID}&district=${filterData?.district}&center=${filterData?.center}`,
                    "Infra Report",
                    setLoaderDownload,
                  )
                }
                excelLoader={loaderDownload?.excel}
                pdfLoader={loaderDownload?.pdf}
              />
            </div>

            <Divider className="my-4" />

            <div className="flex gap-12">
              <p className="font-medium">Status Indicators</p>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Image
                    src={check.src}
                    alt="check"
                    className="min-h-[20px] min-w-[20px]"
                    height={20}
                    width={20}
                  />
                  <p className="text-sm font-medium text-slate-600">
                    Functional
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Image
                    src={warning.src}
                    alt="warning"
                    className="min-h-[20px] min-w-[20px]"
                    height={20}
                    width={20}
                  />
                  <p className="text-sm font-medium text-slate-600">Shortage</p>
                </div>
              </div>
            </div>
          </Card>
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
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default InfraReport;
