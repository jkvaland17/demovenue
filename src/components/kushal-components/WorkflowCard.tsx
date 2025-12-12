"use client";
import { Button, useDisclosure } from "@nextui-org/react";
import React from "react";
import ViewAdhiyaachanDetails from "../Adhiyaachan/ViewAdhiyaachanDetails";

interface Demo {
  status?: string;
  stage?: string;
  title?: string;
  id: string;
  adhiyaachanId?: string;
  commentsCount: number;
  filesCount: number;
}

const WorkflowCard: React.FC<{ dataObj: Demo }> = ({ dataObj }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

//   console.log("check data status", dataObj)

//   console.log("Title:", dataObj.title);
// console.log("Stage:", dataObj.stage);
// console.log("ID:", dataObj.id);


  const handleOpenModal = () => {
    onOpen();
  };

  return (
    <div>
      <div className="rounded-xl bg-white p-3">
        <div className="flex items-center justify-between">
          <div className="rounded-md bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
            {dataObj?.stage}
          </div>
          <Button
            onPress={handleOpenModal}
            className="more_btn min-w-fit bg-white"
          >
            <span className="material-symbols-rounded">more_horiz</span>
          </Button>
        </div>

        <h1 className="my-2 text-lg font-semibold">{dataObj?.title}</h1>
        <p className="mb-8 text-sm text-slate-400">{dataObj?.id}</p>

        <div className="flex justify-end gap-1">
          <Button size="sm" variant="light" className="text-sm text-gray-500">
            <span className="material-symbols-rounded">chat_bubble</span>{" "}
            {dataObj?.commentsCount} comments
          </Button>
          <Button size="sm" variant="light" className="text-sm text-gray-500">
            <span className="material-symbols-rounded">draft</span>{" "}
            {dataObj?.filesCount} files
          </Button>
        </div>
      </div>

      {isOpen && (
        <ViewAdhiyaachanDetails
          id={dataObj?.adhiyaachanId}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </div>
  );
};

export default WorkflowCard;
