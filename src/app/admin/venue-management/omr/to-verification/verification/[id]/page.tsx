"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Tabs, Tab, Card, Button } from "@nextui-org/react";
import TreasuryHallDetails from "@/components/TreasuryVerification/TesuryHallDetails";
import OtherTreasuryInformation from "@/components/TreasuryVerification/OtherTesuryInformation";
import { CallGetTreasuryVerificationByDistrictId } from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import { DownloadKushalPdf } from "@/Utils/DownloadExcel";
import ConditionalDownloadButton from "@/components/ConditionalDownloadButton";

const TreasuryVerificationPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentAdvertisementID } = useAdvertisement();
  const { id } = useParams();
  const date = searchParams.get("date");
  const [isLoading, setIsLoading] = useState(false);
  const [officersData, setOfficersData] = useState<any[]>([]);
  const [loader, setLoader] = useState<any>({ table: false, pdf: false });
  const router = useRouter();

  const formatRoomData = (data: any) => {
    if (!data) return [{ fields: [] }];

    // Handle both single object and array
    const items = Array.isArray(data) ? data : [data];

    const formattedItems = items.map((item: any, index: number) => {
      const fields = [
        { key: "Length", title: "Length (ft)", input: item.length || "-" },
        { key: "Width", title: "Width (ft)", input: item.width || "-" },
        { key: "Area", title: "Area (sq ft)", input: item.area || "-" },
        { key: "Doors", title: "Doors", input: item.doors || "-" },
        { key: "Windows", title: "Windows", input: item.windows || "-" },
        { key: "CCTV", title: "Is CCTV Available?", input: item.cctv || "-" },
        {
          key: "CCTVCount",
          title: "Number of CCTV",
          input: item.cctvCount || "-",
        },
        {
          key: "Comment",
          title: "Additional Comment",
          input: item.comment || "-",
        },
        { key: "Images", title: "Image of Room", input: item.images || [] },
      ];
      return {
        location: item.geo_location,
        centerVerificationData: item.updated_at || item.date || new Date(),
        fields,
        roomNumber: item.room || index + 1, // Use the 'room' field if available, else index-based
      };
    });

    return formattedItems;
  };

  const formatOtherData = (data: any) => {
    if (!data) return [{ fields: [] }];

    // Handle both single object and array
    const items = Array.isArray(data) ? data : [data];

    const formattedItems = items.map((item: any, index: number) => {
      const fields = [
        {
          key: "EntryCCTV",
          title: "Entry CCTV Functional",
          input: item.cctv_entry_camera || "-",
        },
        {
          key: "ExitCCTV",
          title: "Exit CCTV Functional",
          input: item.cctv_exit_camera || "-",
        },
        {
          key: "ControlRoom",
          title: "Control Room CCTV Functional",
          input: item.cctv_control_room_camera || "-",
        },
        {
          key: "GalleryCCTV",
          title: "Gallery CCTV Functional",
          input: item.cctv_gallery_camera || "-",
        },
        {
          key: "OtherCCTV",
          title: "Other Area CCTV Functional",
          input: item.cctv_other_area_camera || "-",
        },
        {
          key: "DoubleGuard",
          title: "Double Guard Duty Assigned?",
          input: item.personal_assigned_double_duty || "-",
        },
        {
          key: "FireExt",
          title: "Fire Extinguishers Available?",
          input: item.availabilty_of_fire_extinguishers || "-",
        },
      ];
      return {
        location: item.geo_location,
        centerVerificationData: item.updated_at || item.date || new Date(),
        fields,
        infoIndex: index + 1, // For labeling if multiple
      };
    });

    return formattedItems;
  };

  const getTreasuryVerification = async () => {
    if (!id || !currentAdvertisementID) return;

    try {
      setIsLoading(true);
      const query = new URLSearchParams({
        districtId: Array.isArray(id) ? id[0] : id,
        advertisementId: String(currentAdvertisementID),
        ...(date ? { date } : {}),
      }).toString();

      const { data } = (await CallGetTreasuryVerificationByDistrictId(
        query,
      )) as any;
      console.log("data from details page:-", data);

      if (data?.data && Array.isArray(data.data)) {
        const formatted = data.data.map((officer: any, index: number) => ({
          ...officer,
          key: officer.user?._id || officer.user?.userId || `officer-${index}`,
          roomData: formatRoomData(officer.roomData),
          otherData: formatOtherData(officer.otherData),
        }));
        setOfficersData(formatted);
      } else setOfficersData([]);
    } catch (err) {
      console.error(err);
      setOfficersData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentAdvertisementID) getTreasuryVerification();
  }, [id, date, currentAdvertisementID]);

  return (
    <Card className="space-y-4 p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold text-gray-700">
          Treasury Verification
        </h2>
        <Button
          radius="md"
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
      </div>

      {isLoading && (
        <p className="font-medium text-blue-500">Loading data...</p>
      )}

      {!isLoading && officersData.length === 0 && (
        <p className="py-10 text-center text-gray-500">
          No verification data found for this district.
        </p>
      )}

      {!isLoading && officersData.length > 0 && (
        <Tabs
          aria-label="Officer Tabs"
          color="primary"
          variant="underlined"
          className="w-full"
        >
          {officersData?.map((officer: any) => (
            <Tab
              key={officer?.key}
              title={officer?.user?.role?.title || "Officer"}
            >
              <div className="flex justify-end">
                <ConditionalDownloadButton
                  pdfFunction={() =>
                    DownloadKushalPdf(
                      `v1/treasury/admin/downloadTreasuryReportPdf?advertisementId=${currentAdvertisementID}&districtId=${id ?? ""}&date=${date ?? ""}&userId=${officer.user?._id ?? officer.user?.userId ?? ""}`,
                      "Tesury Verification Report",
                      setLoader,
                    )
                  }
                  pdfLoader={loader?.pdf}
                  hideExcel={true}
                />
              </div>

              <Tabs
                aria-label="Officer Details Tabs"
                color="secondary"
                variant="solid"
                className="mt-6"
              >
                <Tab key="room" title="Room Details">
                  <TreasuryHallDetails
                    hallData={officer?.roomData}
                    centerName={officer?.user?.name || ""}
                  />
                </Tab>
                <Tab key="other" title="Other Information">
                  <OtherTreasuryInformation
                    otherInfoData={officer?.otherData}
                    centerName={officer?.user?.name || ""}
                  />
                </Tab>
              </Tabs>
            </Tab>
          ))}
        </Tabs>
      )}
    </Card>
  );
};

export default TreasuryVerificationPage;
