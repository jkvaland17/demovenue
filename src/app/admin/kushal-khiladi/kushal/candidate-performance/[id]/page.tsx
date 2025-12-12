"use client";
import { CallGetCandidatePerformance } from "@/_ServerActions";
import CardSkeleton from "@/components/kushal-components/loader/CardSkeleton";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import moment from "moment";
import { useSessionData } from "@/Utils/hook/useSessionData";
import BackButton from "@/components/BackButton";
import PerformanceSummeryStats from "@/components/kushal-components/candidate-performance/PerformanceSummeryStats";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

function CandidatePerformance() {
  const { id } = useParams();
  const { advertisementId } = useSessionData();
  const [PerformanceData, setPerformanceData] = useState<any>([]);
  const [loader, setLoader] = useState<any>({
    page: false,
  });

  const statusColorMap: { [key: string]: ChipColor } = {
    Eligible: "success",
    Passed: "success",
    Pending: "warning",
    Failed: "danger",
  };

  const GetCandidatePerformanceDetails = async () => {
    setLoader((prev: any) => ({
      ...prev,
      page: true,
    }));
    console.log("dd", advertisementId, id);
    const query = `advertisementId=${advertisementId}&applicationId=${id}`;
    try {
      const { data, error } = (await CallGetCandidatePerformance(query)) as any;
      console.log("GetCandidatePerformanceDetails", { data, error });

      if (data?.data) {
        setPerformanceData(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        page: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        page: false,
      }));
    }
  };

  const candidateDetails = [
    {
      name: "Registration ID",
      value: PerformanceData?.candidateId,
      type: "text",
    },
    {
      name: "Name",
      value: PerformanceData?.personalDetails?.fullName,
      type: "text",
    },
    {
      name: "Father Name",
      value: PerformanceData?.personalDetails?.fatherName,
      type: "text",
    },
    {
      name: "Gender",
      value: PerformanceData?.personalDetails?.gender,
      type: "text",
    },
    {
      name: "DOB",
      value: moment(PerformanceData?.personalDetails?.dateOfBirth).format(
        "DD/MM/YYYY",
      ),
      type: "text",
    },
    { name: "Sport", value: PerformanceData?.sports, type: "text" },
    {
      name: "State",
      value: PerformanceData?.addressDetails?.permanentAddress?.state,
      type: "text",
    },
    {
      name: "Category",
      value: PerformanceData?.personalDetails?.reservationCategory,
      type: "text",
    },
    {
      name: "Final Result",
      value: PerformanceData?.finalResultStatus,
      type: "chip",
    },
    { name: "Doc Attached", value: "", type: "doc" },
  ];

  useEffect(() => {
    if (advertisementId && id) {
      GetCandidatePerformanceDetails();
    }
  }, [advertisementId, id]);

  return (
    <div className="mb-5">
      {loader?.page ? (
        <CardSkeleton cardsCount={1} columns={1} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-semibold">Candidate Performance</h3>
            <BackButton />
          </div>
          <Card className="overflow-hidden">
            <CardHeader className="bg-default-100 p-5">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                <Avatar
                  isBordered
                  className="h-24 w-24"
                  src={PerformanceData?.photograph}
                  alt="userImage"
                />

                <div className="space-y-1">
                  <h3 className="mb-2 text-2xl font-semibold capitalize">
                    {candidateDetails[1].value}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Chip variant="flat" color="primary">
                      ID: {candidateDetails[0].value}
                    </Chip>
                    <Chip variant="flat" color="primary">
                      Sport: {candidateDetails[5].value}
                    </Chip>
                    <Chip
                      variant="solid"
                      className="text-white"
                      color={statusColorMap[candidateDetails[8].value]}
                    >
                      {candidateDetails[8].value}
                    </Chip>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardBody className="pt-6">
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
                {candidateDetails.slice(1).map((item: any, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="mt-0.5 text-gray-500">{item.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {item.name}
                      </p>
                      <div className="mt-1">
                        {item.type === "chip" ? (
                          <Chip
                            variant="solid"
                            className="text-white"
                            color={statusColorMap[item.value]}
                          >
                            {item.value}
                          </Chip>
                        ) : item.type === "doc" ? (
                          <Link href={item?.value} target="_blank">
                            {item?.value !== "" ? (
                              <Image
                                src={pdf}
                                className="h-[30px] w-[30px] object-contain"
                                alt="pdf"
                              />
                            ) : (
                              "-"
                            )}
                          </Link>
                        ) : (
                          <p className="font-medium capitalize">
                            {item.value || "-"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Divider className="my-6" />
              {PerformanceData?.subSportsData?.map(
                (performance: any, index: number) => (
                  <PerformanceSummeryStats
                    details={performance}
                    title={performance?.name}
                    key={index}
                  />
                ),
              )}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}

export default CandidatePerformance;
