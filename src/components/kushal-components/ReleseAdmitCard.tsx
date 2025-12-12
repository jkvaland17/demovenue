import React, { useEffect, useState } from "react";
import { CallGetReleaseAdmitCardDetails } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import CandidateVenueAllocation from "./admit-card-release/CandidateVenueAllocationTable";
import { useAdvertisement } from "../AdvertisementContext";

function ReleaseAdmitCard() {
  const { currentAdvertisementID } = useAdvertisement();

  const [loader, setLoader] = useState<any>({
    admitCard: false,
    table: false,
  });
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [releaseDetails, setReleaseDetails] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>({
    startDate: "",
    endDate: "",
  });

  const ReleaseAdmitCardDetails = async () => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    try {
      const query = `advertisementId=${currentAdvertisementID}&startDate=${filterData.startDate}&endDate=${filterData.endDate}`;
      const { data, error } = (await CallGetReleaseAdmitCardDetails(
        query,
      )) as any;
      console.log("CallGetReleaseAdmitCardDetails", data, error);
      if (data) {
        setReleaseDetails(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    }
  };

  const clearFilter = () => {
    setFilterData({
      startDate: "",
      endDate: "",
    });
    setPage(1);
    ReleaseAdmitCardDetails();
  };

  useEffect(() => {
    if (currentAdvertisementID) {
      ReleaseAdmitCardDetails();
    }
  }, [currentAdvertisementID]);

  return (
    <>
      <CandidateVenueAllocation
        tableData={releaseDetails}
        page={page}
        setPage={setPage}
        setTotalPages={setTotalPages}
        totalPages={totalPages}
        loader={loader?.table}
        title="Release Admit Card Details"
        setFilterData={setFilterData}
        filterData={filterData}
        type="releaseAdmitCard"
        functionCall={ReleaseAdmitCardDetails}
        clearFilter={clearFilter}
      />
    </>
  );
}

export default ReleaseAdmitCard;
