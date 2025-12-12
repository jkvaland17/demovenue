"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import AdminDashboard from "@/components/kushal-components/AdminDashboard";
import { AdvertisementProvider } from "@/components/AdvertisementContext";
import GlobalAdvertisements from "@/components/GlobalAdvertisements";
import { useSessionData } from "@/Utils/hook/useSessionData";

const Main: React.FC = (props: any) => {
  const location = usePathname();
  const [menuState, setMenuState] = useState<boolean>(true);
  const { courseId, userName } = useSessionData();
  const handleChildData = () => {
    setMenuState(!menuState);
  };

  const handleSidebarToggle = (isOpen: boolean) => {
    setMenuState(isOpen);
  };

  const hiddenAdvertisementRoutes = [
    "/admin/kushal-khiladi/kushal/application-scrutiny/candidate-application-scrutiny",
    "/admin/kushal-khiladi/kushal/document-verification/candidate-document-verification",
    "/admin/kushal-khiladi/master/committee-management/edit",
    "/admin/kushal-khiladi/master/committee-management/view",
    "/admin/kushal-khiladi/master/team-management/view",
    "/admin/kushal-khiladi/master/team-management/edit",
    "/admin/kushal-khiladi/kushal-all-exams",
    "/admin/kushal-khiladi/kushal/dashboard",
    "/admin/kushal-khiladi/kushal/kushal-dashboard",
    "/admin/dvpst-management/dvpst/member/document-verification",
    "/admin/promotion-management/promotion/dashboard",
    "/admin/written-examination",
    "/admin/kushal-khiladi/kushal/candidate-performance",
    `/admin/kushal-khiladi/kushal/application-scrutiny/statistics-details`,
    "/admin/otr-applications",
    `/admin/kushal-khiladi/kushal/card-details`,
    "/admin/vendor-management/master-data",
    "/admin/vendor-management/vendor",
    `/admin/venue-management/master-data/center/center-users`,
    `/admin/physical-efficiency/physical-selection`,
    `/admin/physical-efficiency/download-candidate-marks`,
    `/admin/physical-efficiency/upload-candidate-exam`,
    `/admin/typing-test/typing-test-selection`,
    `/admin/typing-test/download-candidate-marks`,
    `/admin/typing-test/upload-candidate-exam`,
    `/admin/final-result/final-result-selection`,
    `/admin/final-result/download-candidate-marks`,
    `/admin/final-result/upload-candidate-exam`,
    `/admin/adhiyaachan-advertisement`,
    `/admin/venue-management/omr/center-verification/verification`,
    `/admin/sectionofficer-managment/section-officer`,
    `/admin/sectionofficer-managment/master-data/user-management`,
    `/admin/venue-management/omr/to-verification/verification`,
    `/admin/section-officer`,
    `/admin/promotion-management/promotion/all-promotions`,
    `/admin/master/master-data`,
    `/admin/venue-management/omr/shift-wise-performance/`,
    `/admin/screening-admitCard/admit-card/admitcard`,
    "/admin/venue-management/omr/center-verification/dashboard/infra-report",
  ];

  const ApproxLocation = hiddenAdvertisementRoutes.some((route) =>
    location.startsWith(route),
  );

  const isAdminRoot = location === "/admin";

  return (
    <>
      <Sidebar show={menuState} onSidebarToggle={handleSidebarToggle} />
      <div className={`content ${menuState ? "show" : "hide"}`}>
        <Navbar onData={handleChildData} />

        <div
          className={`contentSub !mb-0 min-h-[100vh] px-4 ${menuState ? `pt-[100px]` : `pt-[20px]`} mob:px-3`}
        >
          <AdvertisementProvider>
            {!ApproxLocation && <GlobalAdvertisements courseId={courseId} />}
            {isAdminRoot ? <AdminDashboard userName={userName} /> : props.children}
          </AdvertisementProvider>
        </div>

        <br />
        <br />
      </div>
    </>
  );
};
export default Main;
