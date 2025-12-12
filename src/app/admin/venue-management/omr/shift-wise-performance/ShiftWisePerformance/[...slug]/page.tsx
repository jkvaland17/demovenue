"use client";
import FlatCard from "@/components/FlatCard";
import { Button, Select, SelectItem, Tab, Tabs } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CenterVerification from "@/components/shitwisereportview/CenterVerification";
import ControlRoom from "@/components/shitwisereportview/ControlRoom";
import CenttreStaff from "@/components/shitwisereportview/CenttreStaff";
import { handleCommonErrors } from "@/Utils/HandleError";
import { DownloadKushalPdf } from "@/Utils/DownloadExcel";
import { CallGetShiftWiseParsedFields } from "@/_ServerActions";
import CardAndTable from "@/components/kushal-components/loader/CardAndTable";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import ConditionalDownloadButton from "@/components/ConditionalDownloadButton";
import AttendanceSheet from "@/components/shitwisereportview/AttendanceSheet";

const ShiftWisePerformance = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>({});
  const [centerverificationId, setcenterverificationId] = useState<string>("");
  const [centerVerificationData, setcenterVerificationData] = useState<any[]>(
    [],
  );
  const [centerName, setcenterName] = useState<string>("");
  const [examDate, setExamDate] = useState<string>("");
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
    pdf: false,
  });

  const centerId = slug?.[0];
  const userId = slug?.[1];
  const shift = slug?.[2];
  const advertisementId = slug?.[3];
  const examDateParam = slug?.[4];

  const [filterData, setFitlerData] = useState<any>({
    date: "",
    shift: shift || "",
  });

  const centerVerificationParsedFields = async (filter: boolean) => {
    try {
      setLoader((prev: any) => ({
        ...prev,
        table: true,
      }));
      const FilterOff = `advertisementId=${advertisementId}&centerId=${centerId}&userId=${userId}&examDate=${examDateParam}&shift=${shift}`;
      const FilterOn = `advertisementId=${advertisementId}&centerId=${centerId}&userId=${userId}&examDate=${examDateParam}&shift=${filterData?.shift}`;
      const { data, error } = (await CallGetShiftWiseParsedFields(
        filter ? FilterOn : FilterOff,
      )) as any;
      if (data?.message === "Success") {
        setExamDate(data?.date || "-");
        setUser(data?.user || {});
        setcenterVerificationData(data?.data || []);
        setcenterverificationId(data?.centerverificationId || "");
        setcenterName(data?.centerName || "");
        setLoader((prev: any) => ({
          ...prev,
          table: false,
        }));
      } else {
        setcenterVerificationData([]);
        setExamDate("-");
        handleCommonErrors(error);
        setLoader((prev: any) => ({
          ...prev,
          table: false,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    centerVerificationParsedFields(false);
  }, []);

  const getPhaseData = (phaseKey: string) => {
    return (
      centerVerificationData?.find(
        (phase: any) => phase?.phaseKey === phaseKey,
      ) || {}
    );
  };

  const clearFilter = () => {
    setFitlerData({
      date: "",
      shift: shift || "",
    });
    centerVerificationParsedFields(false);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between gap-12">
        <h2 className="mb-4 text-xl font-semibold">
          Shift Wise Performance Report
        </h2>
        <Button
          radius="full"
          className="font-medium"
          onPress={() => router.back()}
          startContent={
            <span className="material-symbols-rounded">arrow_back</span>
          }
        >
          Go Back
        </Button>
      </div>

      {loader?.table ? (
        <div className="rounded-lg border bg-white p-5">
          <CardAndTable
            cardCount={1}
            filterCount={2}
            tableColumns={5}
            tableRows={10}
          />
        </div>
      ) : (
        <FlatCard>
          <div className="mb-5 flex items-end gap-4">
            <Select
              items={[
                { key: "1", label: "Shift-1" },
                { key: "2", label: "Shift-2" },
                { key: "3", label: "Shift-3" },
              ]}
              selectedKeys={[filterData?.shift]}
              label="Shift"
              labelPlacement="outside"
              placeholder="Select"
              onChange={(e) =>
                setFitlerData((prev: any) => ({
                  ...prev,
                  shift: e.target.value,
                }))
              }
              className="w-48"
            >
              {(item: any) => (
                <SelectItem key={item?.key}>{item?.label}</SelectItem>
              )}
            </Select>
            <FilterSearchBtn
              searchFunc={() => centerVerificationParsedFields(true)}
              clearFunc={clearFilter}
            />
            <div className="flex justify-end">
              <ConditionalDownloadButton
                pdfFunction={() =>
                  DownloadKushalPdf(
                    `v1/shiftWise/admin/downloadShiftWiseParsedPdf?advertisementId=${advertisementId}&centerId=${centerId}&userId=${userId}&examDate=${examDateParam}&shift=${filterData?.shift}`,
                    "Shift Wise Report",
                    setLoader,
                  )
                }
                pdfLoader={loader?.pdf}
                hideExcel={true}
              />
            </div>
          </div>
          <FlatCard>
            <div className="flex flex-col gap-1 px-4 py-3">
              <h2 className="text-base font-semibold text-black">
                {user?.name}{" "}
              </h2>
              <p className="text-sm text-blue-500">{user?.role?.title}</p>
              <p className="text-xs text-gray-600">
                ID: {user?.userId} | Email: {user?.email}
              </p>
            </div>
          </FlatCard>
          <Tabs aria-label="Options" variant="underlined" color="primary">
            <Tab key="centerVerification" title="Center Verification">
              <CenterVerification
                centerVerificationData={getPhaseData("center_verification")}
                centerverificationId={centerverificationId}
                centerVerification={centerVerificationParsedFields}
                centerVerificationParsedFields={centerVerificationParsedFields}
                centerName={centerName}
                examDate={examDate}
              />
            </Tab>
            <Tab
              key="centerControlRoom"
              title="Centre Control Room & Biometric Details"
            >
              <ControlRoom
                controlRoomData={getPhaseData("center_control_room")}
                centerName={centerName}
                examDate={examDate}
              />
            </Tab>
            <Tab key="centerStaff" title="Centre Staff for Exam Conduct">
              <CenttreStaff
                staffData={getPhaseData("center_staff")}
                centerName={centerName}
                examDate={examDate}
              />
            </Tab>
            <Tab key="attendanceSheet" title="Attendance Sheet">
              <AttendanceSheet
                additionalData={getPhaseData("attendance_sheet")}
                centerName={centerName}
                examDate={examDate}
              />
            </Tab>
            {/* <Tab key="centerStaffAdditional" title="Additional Details">
              <AdditionalDetails
                additionalData={getPhaseData("additional_details")}
                centerName={centerName}
              />
            </Tab> */}
          </Tabs>
        </FlatCard>
      )}
    </div>
  );
};

export default ShiftWisePerformance;
