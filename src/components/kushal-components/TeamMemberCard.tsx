import { Button } from "@nextui-org/react";
import React from "react";

const TeamMemberCard = ({ item }: any) => {
  return (
    <>
      <div className="bg-gray-100 p-4 rounded-xl">
        <div className="flex justify-between gap-8">
          <h1 className="font-semibold text-lg">{item?.userId?.name}</h1>

          <Button className="bg-white min-w-fit more_btn h-fit bg-transparent">
            <span className="material-symbols-rounded">more_horiz</span>
          </Button>
        </div>

        <p className="text-slate-500">{item?.designation}</p>
      </div>
    </>
  );
};

export default TeamMemberCard;
