"use client";
import { CallGetAdhiyaachanWorkflow } from "@/_ServerActions";
import CardSkeleton from "@/components/kushal-components/loader/CardSkeleton";
import WorkflowStatus from "@/components/kushal-components/WorkflowStatus";
import { handleCommonErrors } from "@/Utils/HandleError";
import React, { useEffect, useState } from "react";

const AdhiyaachanApprovalWorkflow = () => {
  const [loader, setLoader] = useState<any>({
    card: false,
  });
  const [allList, setAllList] = useState<any>([]);

  const getAdhiyaachanWorkflowList = async () => {
    setLoader((prev: any) => ({
      ...prev,
      card: true,
    }));

    try {
      const { data, error } = (await CallGetAdhiyaachanWorkflow()) as any;
      if (data?.data) {
        setAllList(data?.data);
      }
      if (error) {
        handleCommonErrors(Error);
      }
      setLoader((prev: any) => ({
        ...prev,
        card: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        card: false,
      }));
    }
  };

  useEffect(() => {
    getAdhiyaachanWorkflowList();
  }, []);
  return (
    <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm mob:p-2">
      <h1 className="mb-12 text-2xl font-semibold">
        Adhiyaachan Approval Workflow
      </h1>

      {loader.card ? (
        <CardSkeleton cardsCount={4} columns={4} />
      ) : (
        <WorkflowStatus data={allList} />
      )}
    </div>
  );
};

export default AdhiyaachanApprovalWorkflow;
