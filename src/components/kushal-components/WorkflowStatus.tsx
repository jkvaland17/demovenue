import React from "react";
import WorkflowCard from "./WorkflowCard";

interface Demo {
  status: string;
  category: string;
  title: string;
  id: string;
  commentsCount: number;
  filesCount: number;
}
interface WorkflowStatusProps {
  data: Demo[];
}

const WorkflowStatus: React.FC<WorkflowStatusProps> = ({ data }) => {
  const pendingData = data.filter((item) => item?.status === "Pending");
  const CompletedData = data.filter((item) => item?.status === "Completed");
  const ongoingData = data.filter((item) => item?.status === "Ongoing");
  const forthcomingData = data.filter((item) => item?.status === "ForthComing");


  return (
    <div className="grid grid-cols-4 gap-4 tab:grid-cols-2 mob:grid-cols-1">
      {/* Completed Slab */}
      <div className="bg-gray-100 p-3 rounded-xl">
        <div className="flex items-center gap-4 border-b-4 border-green-600 pb-4 mb-6">
          <div className="h-[10px] w-[10px] rounded-full bg-green-600"></div>
          <p className="font-medium text-xl">Completed</p>
          <div className="h-[30px] w-[30px] rounded-full bg-gray-300 flex justify-center items-center">
            {CompletedData?.length}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {CompletedData?.map((item) => (
            <WorkflowCard key={item.id} dataObj={item} />
          ))}
        </div>
      </div>

      {/* Ongoing Slab */}
      <div className="bg-gray-100 p-3 rounded-xl">
        <div className="flex items-center gap-4 border-b-4 border-yellow-300 pb-4 mb-6">
          <div className="h-[10px] w-[10px] rounded-full bg-yellow-300"></div>
          <p className="font-medium text-xl">Ongoing</p>
          <div className="h-[30px] w-[30px] rounded-full bg-gray-300 flex justify-center items-center">
            {ongoingData?.length}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {ongoingData?.map((item) => (
            <WorkflowCard key={item.id} dataObj={item} />
          ))}
        </div>
      </div>

      {/* Pending Slab */}
      <div className="bg-gray-100 p-3 rounded-xl">
        <div className="flex items-center gap-4 border-b-4 border-blue-700 pb-4 mb-6">
          <div className="h-[10px] w-[10px] rounded-full bg-blue-700"></div>
          <p className="font-medium text-xl">Pending</p>
          <div className="h-[30px] w-[30px] rounded-full bg-gray-300 flex justify-center items-center">
            {pendingData?.length}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {pendingData?.map((item) => (
            <WorkflowCard key={item.id} dataObj={item} />
          ))}
        </div>
      </div>

      {/* Completed Slab */}
      <div className="bg-gray-100 p-3 rounded-xl">
        <div className="flex items-center gap-4 border-b-4 border-rose-600 pb-4 mb-6">
          <div className="h-[10px] w-[10px] rounded-full bg-rose-600"></div>
          <p className="font-medium text-xl">Returned</p>
          <div className="h-[30px] w-[30px] rounded-full bg-gray-300 flex justify-center items-center">
            {forthcomingData?.length}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {forthcomingData?.map((item) => (
            <WorkflowCard key={item.id} dataObj={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowStatus;
