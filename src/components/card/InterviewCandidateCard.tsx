"use client";
import {
  CallGetApplicationSummaryUrl,
  CallUpdateInterviewStats,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Image,
  Input,
  Select,
  SelectItem,
  // Snippet,
  Spinner,
} from "@nextui-org/react";
import moment from "moment";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
type listItemType = {
  candidate: { name: string; candidateId: string; registration?: string };
  rollNo?: string;
  application: { registration?: string };
  advertisement: { formTemplate?: string };
  stats: { isMarksSubmitted: boolean };
  _id: string;
};
type InterviewCandidateCardType = {
  title: string;
  count: number | undefined;
  candidateDetail: { _id: string };
  setCandidateDetail: any;
  allList: listItemType[];
  type: string;
};
const InterviewCandidateCard: React.FC<InterviewCandidateCardType> = ({
  title,
  count,
  candidateDetail,
  setCandidateDetail,
  allList,
  type,
}) => {
  const handleListItemColor = (item: listItemType) => {
    if (type === "Present") {
      if (item?._id === candidateDetail?._id || item?.stats?.isMarksSubmitted) {
        return "bg-green-300/70";
      }
      return "bg-gray-100";
    }
    if (item?._id === candidateDetail?._id) {
      return "bg-red-300/70";
    }
    return "bg-red-100";
  };

  return (
    <div className="sticky top-0 bg-white max-h-[450px] pb-3 mb-3 rounded-lg overflow-y-scroll z-20 border-bottom p-3">
      <div className="all_status_btn flex gap-2 flex-wrap">
        <p className="text-xs mb-3 font-semibold">
          {`${title} Candidates: ${count}`}
        </p>
      </div>
      {allList?.map((item: listItemType, index: number) => (
        <Card className={`shadow-none rounded-md mb-1 w-full`} key={index}>
          <Button
            className={`rounded-none   hover:bg-gray-300 h-full px-0 ${handleListItemColor(item)}`}
            onPress={() => setCandidateDetail(item)}
          >
            <CardBody>
              <div className="flex justify-between text-wrap items-center text-[1rem] font-medium">
                <div>
                  <div>{item?.candidate?.name}</div>
                  <div className="text-xs font-normal">
                    {item?.advertisement?.formTemplate === "AIIMS_JAMMU"
                      ? item?.application?.registration
                      : item?.candidate?.candidateId}
                  </div>
                </div>
                {item?.rollNo}
                {item?.stats?.isMarksSubmitted && (
                  <span className="material-symbols-outlined float-right text-success">
                    check
                  </span>
                )}
              </div>
            </CardBody>
          </Button>
        </Card>
      ))}
    </div>
  );
};
export default InterviewCandidateCard;
