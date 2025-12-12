"use client";
import { Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { CallGetKuhsalAdvertisements } from "@/_ServerActions";
import AdminEventCard from "@/components/kushal-components/AdminEventCard";
import { handleCommonErrors } from "@/Utils/HandleError";
import CardSkeleton from "@/components/kushal-components/loader/CardSkeleton";
import { useSessionData } from "@/Utils/hook/useSessionData";

const KushalAllExams = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loader, setLoader] = useState<boolean>(false);
  const { sessionTeamId } = useSessionData();

  const GetKuhsalAdvertisements = async () => {
    setLoader(true);
    try {
      const query = `courseName=KUSHAL%20KHILADI&teamId=${sessionTeamId}`;
      const { data, error } = (await CallGetKuhsalAdvertisements(query)) as any;
      console.log("CallGetKuhsalAdvertisements", { data, error });
      
      if (data) {
        setAdvertisements(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader(false);
    } catch (error) {
      console.log("error", error);
      setLoader(false);
    }
  };

  useEffect(() => {
    GetKuhsalAdvertisements();
  }, [sessionTeamId]);

  return (
    <div>
      {loader ? (
        <CardSkeleton cardsCount={2} columns={1} />
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between mob:flex-col gap-2">
            <h1 className="text-2xl font-semibold mob:text-xl">
              Recruitment of Skilled Sports Person
            </h1>
            <Select
              className="max-w-sm"
              classNames={{
                trigger: "bg-white",
              }}
              items={[
                {
                  name: "Live",
                  key: "live",
                },
                {
                  name: "Completed",
                  key: "completed",
                },
              ]}
              // selectedKeys={[filterData?.Gender]}
              labelPlacement="outside"
              placeholder="Sort"
              // onChange={(e) => {
              //   setFilterData({ ...filterData, Gender: e.target.value });
              // }}
            >
              {(item) => <SelectItem key={item.key}>{item.name}</SelectItem>}
            </Select>
          </div>

          {advertisements
            ?.slice(0, 2)
            ?.map((advertisement: any) => (
              <AdminEventCard key={advertisement._id} item={advertisement} />
            ))}
        </>
      )}
    </div>
  );
};

export default KushalAllExams;
