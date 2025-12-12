"use client";
import { memo, useEffect, useState } from "react";
import {
  CallGetAdvByCourse,
  CallGetAllAdvertisementData,
  CallGetAllExamType,
  CallGetAllMasterCader,
  CallGetAllMasterCourses,
  CallGetAllMasterData,
  CallGetAllMasterPost,
  CallGetAllSpecialtiesId,
  CallGetAllSportsData,
  CallGetDvpstAllZone,
} from "@/_ServerActions";
import { MasterCode } from "@/app/admin/adhiyaachan-advertisement/adhiyaachan-submission/types";
import { Select, SelectItem } from "@nextui-org/select";
import { useSessionData } from "@/Utils/hook/useSessionData";

type UseMasterByCodeSelectProps = {
  code: MasterCode;
  onChange?: (value: any) => void;
  value?: string | string[];
  label?: string;
  icon?: string;
  placeholder: string;
  labelPlacement: "outside" | "inside";
  variant?: "flat" | "bordered" | "faded" | "underlined" | undefined;
  size: "lg" | "md" | "sm";
  multiple?: "single" | "multiple";
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRRDisabled?: boolean;
  isRequired?: boolean;
  errorMessage?: string;
  excludedKeys?: string[];
};

const UseMasterByCodeSelect = ({
  code,
  onChange,
  value,
  label,
  labelPlacement,
  variant,
  placeholder,
  size,
  icon,
  multiple,
  isInvalid,
  errorMessage,
  isDisabled,
  isRequired,
  isRRDisabled,
  excludedKeys = [],
}: UseMasterByCodeSelectProps) => {
  const [data, setData] = useState<{ key: string; label: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDisabledkeys, setIsDisabledkeys] = useState<string[]>([]);
  const { courseId } = useSessionData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let APICALL;
        let path = `code=${code}`;
        if (code === MasterCode?.Course) {
          APICALL = CallGetAllMasterCourses();
        } else if (code === MasterCode?.Cader) {
          APICALL = CallGetAllMasterCader();
        } else if (code === MasterCode?.Post) {
          APICALL = CallGetAllMasterPost();
        } else if (code === MasterCode?.Sport) {
          APICALL = CallGetAllSportsData("");
        } else if (code === MasterCode?.Advertisement) {
          const query = `parentMasterId=${courseId || "679cfae430000d1df590aac5"}`;
          // APICALL = CallGetAllAdvertisementData(query);
          APICALL = CallGetAdvByCourse(query);
        } else if (code === MasterCode?.ExamType) {
          APICALL = CallGetAllExamType();
        } else if (code === MasterCode?.GroupClassification) {
          APICALL = CallGetAllSpecialtiesId("6862316f85b757d8fd7244ef");
        } else if (code === MasterCode?.Zone) {
          APICALL = CallGetDvpstAllZone();
        } else {
          APICALL = CallGetAllMasterData(path);
        }
        const { data, error } = (await APICALL) as any;
        if (data) {
          const responseData = Array.isArray(data) ? data : data?.data;
          if (responseData) {
            let FinalData = responseData.map((item: any) => ({
              key: item?._id,
              label: item?.value ?? item?.type ?? item?.title ?? item?.name ?? item?.titleInEnglish,
            }));
            if (isRRDisabled) {
              const DisableListIds = responseData
                ?.filter((item: any) => item?.existRR === false)
                .map((item: any) => item._id);
              setIsDisabledkeys(DisableListIds);
            }
            setData(FinalData);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code, courseId]);

  return (
    <Select
      label={label ? label : ""}
      isLoading={loading}
      placeholder={placeholder}
      labelPlacement={labelPlacement}
      variant={variant}
      defaultSelectedKeys={
        value ? (Array.isArray(value) ? value : [value]) : []
      }
      selectedKeys={value ? (Array.isArray(value) ? value : [value]) : []}
      value={value}
      onSelectionChange={(e) => {
        const id = Array.from(e);
        onChange?.(multiple === "multiple" ? id : id[0]);
      }}
      isRequired={isRequired}
      isDisabled={isDisabled ?? false}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      items={
        excludedKeys?.length
          ? data.filter((item) => !excludedKeys.includes(item.key))
          : data
      }
      disabledKeys={isDisabledkeys}
      size={size}
      selectionMode={multiple ? multiple : "single"}
      startContent={
        <>
          <span className="material-symbols-rounded me-2">
            {icon ? icon : null}
          </span>
        </>
      }
    >
      {(item: any) => (
        <SelectItem key={item.key} value={item.key}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
};

export default memo(UseMasterByCodeSelect);
