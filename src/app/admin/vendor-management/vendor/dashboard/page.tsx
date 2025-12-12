"use client";
import React, { useEffect, useState } from "react";
import FlatCard from "@/components/FlatCard";
import { CallVendorDashboard } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import VendorCard from "@/components/kushal-components/VendorCard";
import { Chip } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const { data, error } = (await CallVendorDashboard()) as any;
      console.log("Dashboard Data:", data);
      if (data?.data) {
        setDashboardData(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupByPrefix = () => {
    const vendorCreationStatus = [
      { status: "Vendor Approved", title: "Approved Vendors" },
      { status: "Vendor Pending", title: "Pending Vendor Approvals" },
      { status: "Total Vendor", title: "Total Number of Vendors" },
    ];

    const workCompletionStatus = [
      { status: "Work Completion Complete", title: "Review Approved" },
      {
        status: "Work Completion Pending",
        title: "Approval Pending (Committee Review)",
      },
    ];

    const paymentStatus = [
      { status: "Payment Success", title: "Payment Successful" },
    ];

    const mapData = (statuses: { status: string; title: string }[]) =>
      statuses.map((item) => {
        const matched = dashboardData?.find((d) => d?.status === item?.status);
        return {
          title: item.title,
          value: matched?.count ?? 0,
        };
      });

    return {
      vendorCreationOverview: mapData(vendorCreationStatus),
      workCompletionStatus: mapData(workCompletionStatus),
      paymentStatus: mapData(paymentStatus),
    };
  };

  const groupedData = groupByPrefix();

  return (
    <FlatCard heading="">
      <div className="space-y-6">
        {/* Vendor Creation Overview */}
        <div>
          <div className="mb-6 flex justify-between">
            <h3 className="text-lg font-semibold">Vendor Creation Overview</h3>
            <Chip
              onClick={() => {
                router.push("/admin/vendor-management/vendor/vendor-table");
              }}
              color="danger"
              variant="bordered"
              radius="sm"
              size="lg"
              className="cursor-pointer"
              startContent={
                <div className="live_session_btn mt-4 border-none">
                  <span className="material-symbols-outlined">circle</span>
                </div>
              }
            >
              Status of Live Examinations
            </Chip>
          </div>

          <VendorCard
            data={groupedData?.vendorCreationOverview}
            columns={3}
            isLoading={loading}
          />
        </div>

        {/* Work Completion Status */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Work Completion Status</h3>
          <VendorCard
            data={groupedData?.workCompletionStatus}
            columns={2}
            isLoading={loading}
          />
        </div>

        {/* Payment Status */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Payment Status</h3>
          <VendorCard
            data={groupedData?.paymentStatus}
            columns={2}
            isLoading={loading}
          />
        </div>
      </div>
    </FlatCard>
  );
};

export default Dashboard;
