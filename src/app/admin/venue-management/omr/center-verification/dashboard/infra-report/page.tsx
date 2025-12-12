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
  user,
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
import React, { use, useEffect, useState } from "react";
import check from "@/assets/img/icons/check.png";
import warning from "@/assets/img/icons/warning.png";
import {
  CallDownloadInfraExcel,
  CallDownloadInfraPDF,
  CallGetAllCenters,
  CallGetAllDistricts,
  CallGetAllInfraData,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import { useAdvertisement } from "@/components/AdvertisementContext";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import TableSkeleton from "@/components/kushal-components/loader/TableSkeleton";

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
    user: "CIP",
  });
  const [allData, setAllData] = useState<any[]>([]);
  const { currentAdvertisementID } = useAdvertisement();
  const [loaderDownload, setLoaderDownload] = useState<any>({
    excel: false,
    pdf: false,
    isExcelDownloading: false,
    isPDFDownloading: false,
  });

  const getAllDistricts = async () => {
    try {
      const query = `type=sorting`;
      const { data, error } = (await CallGetAllDistricts(query)) as any;
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

  const getAllCenters = async (districtId: string) => {
    try {
      const query = `district=${districtId}&type=sorting&advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetAllCenters(query)) as any;
      console.log("getAllCenters", { data, error });
      if (data) {
        setAllCenter(data?.data);
        setTotalPage(data?.pagination?.totalPages);
      }
      if (error) {
        handleCommonErrors(error);
        setAllCenter([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllInfraData = async (filter: boolean) => {
    try {
      setIsLoading(true);
      const filterON = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}&district=${filterData?.district}&center=${filterData?.center}&user=${filterData?.user}`;
      const filterOFF = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}&user=CIP`;
      const { data, error } = (await CallGetAllInfraData(
        filter ? filterON : filterOFF,
      )) as any;
      console.log("getAllInfraData", data);
      if (data) {
        setAllData(data?.stats);
        setTotalPage(data?.pagination?.totalPages);
        setPage(data?.pagination?.page);
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
    if (currentAdvertisementID) {
      getAllInfraData(false);
    }
  }, [currentAdvertisementID]);

  const clearFilter = () => {
    setFitlerData({
      center: "",
      district: "",
      user: "CIP",
    });
    getAllInfraData(false);
  };

  const downloadExcel = (fileUrl: string) => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "final_result.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downlaodInfraExcel = async () => {
    setLoaderDownload((prev: any) => ({
      ...prev,
      isExcelDownloading: true,
    }));
    try {
      const query = `district=${filterData?.district}&advertisementId=${currentAdvertisementID}&user=${filterData?.user}`;
      const { data, error } = (await CallDownloadInfraExcel(query)) as any;
      if (data?.fileUrl) {
        downloadExcel(data?.fileUrl);
        setLoaderDownload((prev: any) => ({
          ...prev,
          isExcelDownloading: false,
        }));
      }
      if (error) {
        handleCommonErrors(error);
        setLoaderDownload((prev: any) => ({
          ...prev,
          isExcelDownloading: false,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const downlaodInfraPDF = async () => {
    setLoaderDownload((prev: any) => ({
      ...prev,
      isPDFDownloading: true,
    }));
    try {
      const query = `district=${filterData?.district}&advertisementId=${currentAdvertisementID}&user=${filterData?.user}`;
      const { data, error } = (await CallDownloadInfraPDF(query)) as any;
      if (data?.fileUrl) {
        window.open(data.fileUrl, "_blank");
        setLoaderDownload((prev: any) => ({
          ...prev,
          isPDFDownloading: false,
        }));
      }
      if (error) {
        handleCommonErrors(error);
        setLoaderDownload((prev: any) => ({
          ...prev,
          isPDFDownloading: false,
        }));
      }
    } catch (error) {
      console.log(error);
    }
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

      {/* this is page of infra report page */}

      <Card className="p-4">
        <h1 className="text-xl font-semibold">District Infrastructure Data</h1>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div className="min-w-[200px] flex-1">
            <Select
              label="District"
              labelPlacement="outside"
              placeholder="Select"
              items={allDistricts}
              selectedKeys={filterData?.district ? [filterData.district] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                setFitlerData((prev: any) => ({
                  ...prev,
                  district: selectedKey,
                  center: "",
                }));
                if (selectedKey) {
                  getAllCenters(selectedKey);
                }
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

          <div className="min-w-[200px] flex-1">
            <Select
              label="User"
              labelPlacement="outside"
              placeholder="Select"
              selectedKeys={filterData?.user ? [filterData.user] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                setFitlerData((prev: any) => ({
                  ...prev,
                  user: selectedKey,
                }));
              }}
            >
              <SelectItem key="CIP">CIP</SelectItem>
              <SelectItem key="CS">CS</SelectItem>
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
                `v1/center_verification/admin/getCentersByDistrictExcel?advertisementId=${currentAdvertisementID}&district=${filterData?.district}&center=${filterData?.center}&user=${filterData?.user}`,
                "Infra Report",
                setLoaderDownload,
              )
            }
            pdfFunction={() =>
              DownloadKushalPdf(
                `v1/center_verification/admin/getCentersByDistrictPdf?advertisementId=${currentAdvertisementID}&district=${filterData?.district}&center=${filterData?.center}&user=${filterData?.user}`,
                "Infra Report",
                setLoaderDownload,
              )
            }
            excelLoader={loaderDownload?.excel}
            pdfLoader={loaderDownload?.pdf}
          />
          <Button
            isDisabled={!filterData?.district}
            color="primary"
            onPress={downlaodInfraExcel}
            startContent={
              loaderDownload?.isExcelDownloading ? (
                <Spinner color="default" size="sm" />
              ) : (
                <span className="material-symbols-rounded">description</span>
              )
            }
          >
            All Centre Report Excel
          </Button>
          <Button
            isDisabled={!filterData?.district}
            color="primary"
            onPress={downlaodInfraPDF}
            startContent={
              loaderDownload?.isPDFDownloading ? (
                <Spinner color="default" size="sm" />
              ) : (
                <span className="material-symbols-rounded">picture_as_pdf</span>
              )
            }
          >
            All Centre Report PDF
          </Button>
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
              <p className="text-sm font-medium text-slate-600">Functional</p>
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

      <Card className="mt-4 p-4">
        <div className="overflow-auto rounded-lg p-2">
          {isLoading ? (
            <TableSkeleton columnsCount={5} />
          ) : (
            <table className="round-border-table min-w-[1800px] border-collapse rounded-lg border border-black text-sm">
              <thead>
                <tr>
                  <th
                    colSpan={3}
                    className="align-center whitespace-nowrap rounded-tl-lg border px-3 py-2 text-center text-black"
                  >
                    CIP/Centre Superintendent - Centre Verification
                  </th>
                  <th
                    colSpan={2}
                    className="align-center whitespace-nowrap border bg-gray-200 px-3 py-2 text-center text-black"
                  >
                    Room CCTV
                  </th>
                  <th
                    rowSpan={1}
                    className="align-center whitespace-nowrap border bg-blue-200 px-3 py-2 text-center text-black"
                  >
                    Outside the Room
                  </th>
                  <th
                    colSpan={7}
                    className="align-center whitespace-nowrap border bg-orange-200 px-3 py-2 text-center text-black"
                  >
                    Biometric Devices
                  </th>
                  <th
                    colSpan={4}
                    className="align-center whitespace-nowrap border bg-gray-200 px-3 py-2 text-center text-black"
                  >
                    Checking Frisking (Administration Staff)
                  </th>
                  <th
                    colSpan={8}
                    className="align-center whitespace-nowrap rounded-tr-lg border bg-yellow-200 px-3 py-2 text-center text-black"
                  >
                    Centre Staff for Exam Conduction
                  </th>
                </tr>

                <tr>
                  {/* CIP Section */}
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    District
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Raw Capacity
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Allocated
                  </th>
                  {/* CIP Section */}
                  {/* Room CCTV Section*/}
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Required
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Functional/Shortage
                  </th>
                  {/* Room CCTV Section*/}
                  {/* Outside the Room */}
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Total No of CCTV
                  </th>
                  {/* Outside the Room */}
                  {/* Biometric Devices Section */}
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Required
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Webcam
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Biometric
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    IRIS Devices
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Biometric Manpower
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Required
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Aadhaar Authentication
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Deputed Frisking Staff
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    HHMD Devices
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Enclosure For Female Candidates
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Female Frisking Staff
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Centre Superintendent (Administration Staff)
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Examination Assistant
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Room Invigilator
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Assistant Room Invigilator
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Electrician Staff
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Supporting Staff
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    Centre Head (Conducting Agency)
                  </th>
                  <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                    CCTV Site Supervisor (Security Agency)
                  </th>
                </tr>
              </thead>
              <tbody>
                {allData?.map((item: any, idx: any) => {
                  return (
                    <tr key={idx}>
                      <td className="border px-2 py-1 text-center">
                        {item?.districtName || "-"}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.rawCapacity || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.roomcctv?.total_allocated_capacity || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.roomcctv?.total_required_cctv || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <div className="flex flex-col items-center">
                          <div className="mb-2 flex items-center gap-2">
                            <Image
                              src={check.src}
                              alt="check"
                              className="min-h-[20px] min-w-[20px]"
                              height={20}
                              width={20}
                            />
                            <p className="text-sm font-medium text-slate-500">
                              {item?.roomcctv?.total_functional_cctv || 0}
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
                                item?.roomcctv?.total_required_cctv -
                                  item?.roomcctv?.total_functional_cctv,
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.outsideRoom?.totalCCTV || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.biometricDevice?.biometric_devices_required || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <div className="flex flex-col items-center">
                          <div className="mb-2 flex items-center gap-2">
                            <Image
                              src={check.src}
                              alt="check"
                              className="min-h-[20px] min-w-[20px]"
                              height={20}
                              width={20}
                            />
                            <p className="text-sm font-medium text-slate-500">
                              {item?.biometricDevice?.webcam || 0}
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
                                item?.biometricDevice?.webcam_required -
                                  item?.biometricDevice?.webcam,
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="border px-2 py-1 text-center">
                        <div className="flex flex-col items-center">
                          <div className="mb-2 flex items-center gap-2">
                            <Image
                              src={check.src}
                              alt="check"
                              className="min-h-[20px] min-w-[20px]"
                              height={20}
                              width={20}
                            />
                            <p className="text-sm font-medium text-slate-500">
                              {item?.biometricDevice?.biometric_devices || 0}
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
                                item?.biometricDevice
                                  ?.biometric_devices_required -
                                  item?.biometricDevice?.biometric_devices,
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <div className="flex flex-col items-center">
                          <div className="mb-2 flex items-center gap-2">
                            <Image
                              src={check.src}
                              alt="check"
                              className="min-h-[20px] min-w-[20px]"
                              height={20}
                              width={20}
                            />
                            <p className="text-sm font-medium text-slate-500">
                              {item?.biometricDevice?.iris || 0}
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
                                item?.biometricDevice?.iris_required -
                                  item?.biometricDevice?.iris,
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <div className="flex flex-col items-center">
                          <div className="mb-2 flex items-center gap-2">
                            <Image
                              src={check.src}
                              alt="check"
                              className="min-h-[20px] min-w-[20px]"
                              height={20}
                              width={20}
                            />
                            <p className="text-sm font-medium text-slate-500">
                              {item?.biometricDevice?.biometric_manpower || 0}
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
                                item?.biometricDevice
                                  ?.biometric_manpower_required -
                                  item?.biometricDevice?.biometric_manpower,
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.biometricDevice?.aadhaar_required || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <div className="flex flex-col items-center">
                          <div className="mb-2 flex items-center gap-2">
                            <Image
                              src={check.src}
                              alt="check"
                              className="min-h-[20px] min-w-[20px]"
                              height={20}
                              width={20}
                            />
                            <p className="text-sm font-medium text-slate-500">
                              {item?.biometricDevice?.aadhaar || 0}
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
                                item?.biometricDevice?.aadhaar_required -
                                  item?.biometricDevice?.aadhaar,
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.checkingFrisking?.deputy_staff || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.checkingFrisking?.hhmd || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.checkingFrisking
                          ?.female_frisking_enclosure_count || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.checkingFrisking?.female_staff || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.centerStaff?.centreSuperintendent || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.centerStaff?.examination_assistant || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.centerStaff?.room_invigilator || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.centerStaff?.assistant_room_invigilator || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.centerStaff?.electricianStaff?.input || "-"}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.centerStaff?.supporting_staff_count || 0}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.centerStaff?.centerHead || "-"}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item?.centerStaff?.cctvSiteSupervisor || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-end">
          <Pagination
            showControls
            total={totalPage}
            page={page}
            onChange={(page) => setPage(page)}
          />
        </div>
      </Card>
    </>
  );
};

export default InfraReport;
