"use client";
import { useSession } from "next-auth/react";
import { CallFindAllAdvertisement, CallGetAdvByCourse, CallGetAdvByCourseDvpst } from "@/_ServerActions";
import { useEffect, useState } from "react";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Select, SelectItem } from "@nextui-org/select";
type FieldProps = {
  value: string | any;
  setValue: any;
  disabled?: boolean;
};

const DvpstAdvertisement: React.FC<FieldProps> = ({
  value,
  setValue,
  disabled,
}) => {
  const [allAdvertisement, setAllAdvertisement] = useState<any>([]);
  const [advloading, setAdvloading] = useState<boolean>(false);

  useEffect(() => {
    getAdvertisement();
  }, []);

  const getAdvertisement = async () => {
    try {
      setAdvloading(true);
      // get khushal khiladi admin only by static Id
      const query = `parentMasterId=Direct recruitment`;
      const { data, error } = (await CallGetAdvByCourseDvpst(query)) as any;
      if (data) {
        console.log("Advertisements", { data, error });
        setAllAdvertisement(data?.data);
        if (data?.data?.length > 0) {
          if (typeof window !== "undefined") {
            const id = sessionStorage.getItem("advertisementId");
            const template = id
              ? data?.data?.find((ele: any) => ele?._id === id)?.formTemplate
              : data?.data[0]?.formTemplate;
            if (id) {
              setValue(id, template);
            } else {
              setValue(data?.data[0]?._id, template);
              sessionStorage.setItem("advertisementId", data?.data[0]?._id);
            }
          }
        }
        setAdvloading(false);
      }
      if (error) {
        handleCommonErrors(error);
        setAdvloading(false);
      }
    } catch (error) {
      setAdvloading(false);
      // console.log("error::: ", error);
    }
  };

  return (
    <>
      <Select
        isDisabled={disabled}
        value={value}
        selectedKeys={[value]}
        items={allAdvertisement}
        isRequired
        endContent={
          <span className="material-symbols-outlined">post_add</span>
        }
        placeholder="Please Select advertisement"
        label="Advertisement"
        labelPlacement="outside"
        // isMultiline
        isLoading={advloading}
        onSelectionChange={(e: any) => {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("departmentId", "");
          }
          const id = Array.from(e)[0] as string;
          if (id) {
            const template = allAdvertisement?.find(
              (ele: any) => ele?._id === id,
            )?.formTemplate;
            setValue(id, template);
            if (typeof window !== "undefined") {
              sessionStorage.setItem("advertisementId", id);
            }
          }
        }}
      >
        {(option: any) => (
          <SelectItem key={option?._id}>{option?.titleInEnglish}</SelectItem>
        )}
      </Select>
    </>
  );
};

export default DvpstAdvertisement;
