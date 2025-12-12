"use client";
import React, { useState } from "react";
import profile_avatar from "@/assets/img/icons/common/noImage.png";
import { Button, CircularProgress } from "@nextui-org/react";
import { CallAllowInterviewStatesUpdate } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import Image from "next/image";
const ScoreCard: React.FC<any> = ({
  item,
  applicationData,
  GetApplicationById,
}) => {
  const [loader, setLoader] = useState(false);

  const handleEnableEdit = async () => {
    try {
      setLoader(true);
      const formData = {
        id: applicationData?._id,
        memberId: item?.admin?._id,
      };
      const { data, error } = await CallAllowInterviewStatesUpdate(formData);
      console.log(data);
      if (data) {
        GetApplicationById(false);
      } else if (error) {
        handleCommonErrors(error);
      }
      setLoader(false);
    } catch (error) {
      console.log("error::: ", error);
      setLoader(false);
    }
  };
  return (
    <div className="student_overview mb-3 border-1">
      <div className="overview_header" style={{ padding: "15px" }}>
        <div className="overview_head flex justify-between items-center">
          <div className="flex justify-start items-center gap-4">
            <div>
              <Image
                width={50}
                src={item?.photo?.presignedUrl ?? profile_avatar?.src}
                alt="profile"
              />
            </div>
            <div className="candidate_details">
              <p className="text-xs">{item?.admin?.name}</p>
              <p className="text-xs font-medium">{item?.admin?.role}</p>
            </div>
          </div>

          {!item?.editAllowed && (
            <div className="h-full gap-3 flex justify-end items-center">
              <Button
                isLoading={loader}
                className="chat_btn me-2 px-8"
                color="primary"
                onPress={() => handleEnableEdit()}
              >
                Enable edit
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="overview_desc ">
        <div className="grid grid-cols-3 pb-2">
          <div className="col-span-1 pe-2">
            <h6 className="mb-1 text-sm font-medium text-sky-600">Grade</h6>
            <p className="text-sm font-medium">{item?.grade}</p>
          </div>
          <div className="col-span-1 pe-2">
            <h6 className="mb-1 text-sm font-medium text-sky-600">Marks</h6>
            <p className="text-sm font-medium">{item?.marks}</p>
          </div>
          <div className="col-span-1 pe-2">
            <div className="progress_bar">
              <CircularProgress
                classNames={{
                  svg: "h-12 w-12",
                  value: "text-sm",
                }}
                size="lg"
                value={item?.marks ?? 0}
                color="success"
                showValueLabel={true}
              />
            </div>
          </div>
        </div>
        <div className=" border-t-1">
          <h6 className="mt-2 text-sm mb-1 font-medium text-sky-600">Remark</h6>
          <p className="text-xs">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Perspiciatis quod velit corrupti ullam facere, labore hic laboriosam
            ab magnam officia officiis asperiores minima ratione voluptas
            doloremque architecto id?
          </p>
        </div>
      </div>
    </div>
  );
};
export default ScoreCard;
