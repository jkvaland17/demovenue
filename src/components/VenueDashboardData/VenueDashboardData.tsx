"use client";
import { CallGetcenterVerificationDashboard } from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Divider, Pagination, Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import FilterSearchBtn from "../FilterSearchBtn";
import Image from "next/image";
import check from "@/assets/img/icons/check.png";
import warning from "@/assets/img/icons/warning.png";

type Props = {
  currentAdvertisementID: string;
  filterData: any;
  setFitlerData: React.Dispatch<React.SetStateAction<any>>;
  dashboardStats: React.Dispatch<React.SetStateAction<any>>;
  getCenterDashboardData: React.Dispatch<React.SetStateAction<any>>;
};

const VenueDashboardData: React.FC<Props> = ({
  currentAdvertisementID,
  filterData,
  setFitlerData,
  dashboardStats,
  getCenterDashboardData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dashboard, setDashboard] = useState<[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  const vanueDashboard = async (filter: boolean) => {
    try {
      setIsLoading(true);
      const filterON = `advertisementId=${currentAdvertisementID}&user=${filterData?.user}`;
      const filterOFF = `advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetcenterVerificationDashboard(
        filter ? filterON : filterOFF,
      )) as any;
      setDashboard(data?.stats);
      setTotalPage(data?.pagination?.totalPages);
      setPage(data?.pagination?.page);
      console.log("vanueDashboard Data:_________- ", { data, error });
      setIsLoading(false);
      if (error) {
        handleCommonErrors(error);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
// console.log("Dashboard data mil gya:- ", dashboard);

useEffect(() => {
  if (!currentAdvertisementID) return;

  if (filterData?.user) {
    vanueDashboard(true);
  } else {
    vanueDashboard(false);
  }
}, [currentAdvertisementID, filterData?.user]);


  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      default:
        return cellValue;
    }
  }, []);

  // const clearFilter = () => {
  //   setFitlerData({
  //     user: "",
  //   });
  //   vanueDashboard(false);
  //   dashboardStats(false);
  //   getCenterDashboardData(false);
  // };

  return (
    <FlatCard heading="Venue Dashboard">
      {/* <div className="mb-3 flex items-end gap-4">
        <Select
          label="User"
          className="w-64"
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

        <FilterSearchBtn
          searchFunc={() => {
            vanueDashboard(true);
            dashboardStats(true);
            getCenterDashboardData(true);
          }}
          clearFunc={clearFilter}
        />
      </div> */}
      <div>
        <Divider className="my-4" />
        <div className="mb-5 flex gap-12">
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
      </div>

      <div className="overflow-auto rounded-lg p-2">
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
                State
              </th>
              <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                Raw Capacity
              </th>
              <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                Allocated Capacity
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
                Webcam <br /> (Functional/Shortage)
              </th>
              <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                Biometric <br /> (Functional/Shortage)
              </th>
              <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                IRIS Devices <br /> (Functional/Shortage)
              </th>
              <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                Biometric Manpower <br /> (Functional/Shortage)
              </th>
              <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                Required
              </th>
              <th className="align-center whitespace-nowrap border px-2 py-1 text-center">
                Aadhaar Authentication <br /> (Functional/Shortage)
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
            {dashboard?.map((item: any, idx: any) => {
              return (
                <tr key={idx}>
                  <td className="border px-2 py-1 text-center">
                    {item?.stateName || "-"}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {item?.roomcctv?.total_raw_capacity || 0}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {item?.roomcctv?.total_allocated_capacity || 0}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {item?.roomcctv?.total_required_cctv || 0}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {/* {item?.roomcctv?.total_functional_cctv || 0} */}
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
                          {/* {Math.max(
                            0,
                            item?.biometricDevice?.webcam_required -
                              item?.roomcctv?.total_functional_cctv,
                          )} */}
                          {item?.roomcctv?.total_shortage_cctv || 0}
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
                            item?.biometricDevice?.biometric_devices_required -
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
                            item?.biometricDevice?.biometric_manpower_required -
                              item?.biometricDevice?.biometric_manpower,
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {item?.biometricDevice?.webcam_required || 0}
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
                    {item?.checkingFrisking?.female_frisking_enclosure_count ||
                      0}
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
                    {item?.centerStaff?.electricianStaff || 0}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {item?.centerStaff?.supporting_staff_count || 0}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {item?.centerStaff?.centreHead || 0}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {item?.centerStaff?.cctvSiteSupervisor || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </FlatCard>
  );
};

export default VenueDashboardData;
