"use client";
import {
  CallGetAdvByCourse,
  CallGetKushalAdvertisementSelect,
} from "@/_ServerActions";
import { Button, Chip, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAdvertisement } from "./AdvertisementContext";

type Props = {
  courseId: string;
};

const GlobalAdvertisements: React.FC<Props> = ({ courseId }) => {
  const router = useRouter();
  const [allAdvertisements, setAllAdvertisements] = useState<any[]>([]);
  const { currentAdvertisementID, setCurrentAdvertisementID } =
    useAdvertisement();
  const [isLoading, setIsLoading] = useState(false);

  const getAllAdv = async () => {
    setIsLoading(true);
    try {
      const query = `parentMasterId=${courseId}`;
      const { data, error } = (await CallGetAdvByCourse(query)) as any;
      if (data) {
        setAllAdvertisements(data?.data);
        setCurrentAdvertisementID(data?.data[0]?._id);
        if (typeof window !== "undefined") {
          localStorage.setItem("globalAdvertisementID", data?.data[0]?._id);
        }
        setIsLoading(false);
      }
      if (error) {
        toast.error(error);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (courseId) {
      getAllAdv();
    }
  }, [courseId]);

  return (
    <div className="m-0 flex w-full items-center justify-between gap-4 overflow-hidden mob:mb-2 mob:items-end mob:gap-2">
      <div className="min-w-0 flex-1">
        <p className="text-md mb-2 font-medium">Advertisment</p>

        <Select
          radius="full"
          items={allAdvertisements}
          placeholder="Select"
          className="mb-6 mob:mb-0"
          classNames={{
            trigger: "bg-white",
          }}
          isLoading={isLoading}
          onChange={(e) => {
            console.log(e.target.value);
            setCurrentAdvertisementID(e.target.value);
          }}
          selectedKeys={[currentAdvertisementID]}
        >
          {(item: any) => (
            <SelectItem
              key={item?._id}
              classNames={{
                title: "whitespace-normal break-words",
              }}
              endContent={
                <>
                  {item?.isActive ? (
                    <Chip
                      color="danger"
                      variant="flat"
                      startContent={
                        <div className="live_session_btn mt-4 border-none">
                          <span className="material-symbols-outlined">
                            circle
                          </span>
                        </div>
                      }
                    >
                      Live
                    </Chip>
                  ) : (
                    <Chip
                      color="success"
                      variant="flat"
                      startContent={<CheckIcon size={18} />}
                    >
                      Completed
                    </Chip>
                  )}
                </>
              }
            >
              {item?.titleInEnglish}
            </SelectItem>
          )}
        </Select>
      </div>
      <Button
        radius="full"
        className="font-medium mob:hidden mob:w-auto"
        onPress={() => {
          router.back();
        }}
        startContent={
          <span className="material-symbols-rounded">arrow_back</span>
        }
      >
        Go Back
      </Button>

      {/* ---------for-responsive------------ */}
      <Button
        isIconOnly
        radius="full"
        className="hidden font-medium mob:inline"
        onPress={() => {
          router.back();
        }}
        startContent={
          <span className="material-symbols-rounded">arrow_back</span>
        }
      ></Button>
    </div>
  );
};

export default GlobalAdvertisements;

export const CheckIcon = ({ size, height, width, ...props }: any) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
        fill="currentColor"
      />
    </svg>
  );
};
