import { Button } from "@nextui-org/react";

import STARING from "@/assets/img/star.png";
import React from "react";
import Image from "next/image";

type Props = {
  icon?: any;
  heading?: string;
  subHeading?: string;
  view?: boolean;
};

function InterviewerHeader({ heading, subHeading, view, icon }: Props) {
  return (
    <div className="rounded-3xl shadow-sm bg-blue-600 flex justify-between interviewer_header min-h-[170px] max-h-[170px]">
      <div className="p-6">
        <h2 className="text-start text-3xl font-medium text-white">
          {heading}
        </h2>
        <h6 className={`text-base text-gray-100`}>{subHeading}</h6>
        {view && (
          <Button
            variant="solid"
            size="sm"
            radius="full"
            className="bg-black text-white mt-10"
          >
            View
          </Button>
        )}
      </div>

      {icon ? (
        <div className="p-4 flex items-end">
          <span className="material-symbols-rounded text-8xl mt-auto text-white font-light">
            {icon}
          </span>
        </div>
      ) : (
        <div className="h-[170px] aspect-[4/3]">
          <Image
            src={STARING}
            className="h-full w-full object-cover object-left"
            alt="img"
          />
        </div>
      )}
    </div>
  );
}

export default InterviewerHeader;
