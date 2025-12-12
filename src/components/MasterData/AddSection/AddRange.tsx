"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  CallCategoryByCode,
  CallCreateCategoriesData,
  CallCreateDistricts,
  CallCreateZoneRange,
  CallGetDvpstAllZone,
} from "@/_ServerActions";
import { useRouter } from "next/navigation";
import { handleCommonErrors } from "@/Utils/HandleError";

type FormData = {
  description: string;
  name: string;
  zoneId: string;
  code?: string;
};

const AddRange = (slugData: any) => {
  const slug = slugData?.slugData;
  const router = useRouter();
  const route = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState<any>(false);
  const [advertisement, setAllAdvertisement] = useState<any>(null);
  const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);

  const getAllAdvertisement = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data: Advertisement, error } =
        (await CallGetDvpstAllZone()) as any;
      if (error) {
        handleCommonErrors(error);
      }
      if (Advertisement?.message) {
        setAllAdvertisement(Advertisement?.data);
      }
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAdvertisement();
  }, []);
  console.log("slug::: ", slug);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoadingBtn(true);
      if (slug[0] === "districts") {
        const response = (await CallCreateDistricts(data)) as any;
        console.log("CallCreateDistricts", response);
        if (response?.data?.status_code === 200) {
          toast.success(response?.data?.message);
          router.back();
        }
      } else {
        const { data: response, error } = (await CallCreateZoneRange(
          data,
        )) as any;

        if (response?.data) {
          toast.success(response?.message);
          route.back();
        }
        if (error) {
          handleCommonErrors(error);
        }
      }
    } catch (error) {
      console.log("error::: ", error);
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
    } finally {
      setIsLoadingBtn(false);
      setLoading(false);
    }
  };

  return (
    <>
      <CardBody className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-6">
            <Select
              isRequired
              isLoading={loading}
              fullWidth
              label="Zone"
              placeholder="Select Zone"
              labelPlacement="outside"
              {...register("zoneId", { required: true })}
            >
              {advertisement?.map((item: any) => (
                <SelectItem key={item?._id}>{item?.name}</SelectItem>
              ))}
            </Select>
            <Input
              isRequired
              {...register("name", { required: true })}
              isInvalid={!!errors.name}
              label="Name"
              type="text"
              placeholder={`Enter ${slug[0]} Name`}
              errorMessage={`Please enter ${slug[0]} name`}
              labelPlacement="outside"
              radius="sm"
            />
            {slug[0] === "districts" && (
              <Input
                isRequired
                {...register("code", { required: true })}
                isInvalid={!!errors.code}
                label="Code"
                type="text"
                placeholder={`Enter ${slug[0]} Code`}
                errorMessage={`Please enter ${slug[0]} code`}
                labelPlacement="outside"
                radius="sm"
              />
            )}
            <Textarea
              {...register("description")}
              label="Description"
              labelPlacement="outside"
              placeholder={`Enter your ${slug[0]} description`}
              minRows={4}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="flat"
              type="button"
              color="danger"
              onPress={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              isLoading={isLoadingBtn}
              type="submit"
              radius="sm"
              color="primary"
              className="min-w-[120px]"
            >
              Create {slug[0]}
            </Button>
          </div>
        </form>
      </CardBody>
    </>
  );
};

export default AddRange;
