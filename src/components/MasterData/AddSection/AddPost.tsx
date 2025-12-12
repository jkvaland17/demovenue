"use client";
import {
  Button,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  CallCreateDistricts,
  CallCreatePost,
  CallCreateZoneRange,
  CallGetAllMasterCader,
  CallGetAllMasterCourses,
} from "@/_ServerActions";
import { useRouter } from "next/navigation";
import { handleCommonErrors } from "@/Utils/HandleError";

type FormData = {
  description: string;
  name: string;
  courseId: string;
  cadreId: string;
};

const AddPost = (slugData: any) => {
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
  const [advertisement, setAllAdvertisement] = useState<any>([]);
  const [cader, setAllCader] = useState<any>([]);
  const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);

  const getAllCourse = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = (await CallGetAllMasterCourses()) as any;
      console.log("CallGetAllMasterCourses", { data, error });
      if (error) {
        handleCommonErrors(error);
      }
      if (data) {
        setAllAdvertisement(data);
      }
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  const getAllCader = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const query = `courseId=${id}`;
      const { data, error } = (await CallGetAllMasterCader(query)) as any;
      console.log("CallGetAllMasterCader", { data, error });
      if (error) {
        handleCommonErrors(error);
      }
      if (data) {
        setAllCader(data?.data);
      }
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCourse();
  }, []);

  //   console.log("slug::: ", slug);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoadingBtn(true);
      const { data: response, error } = (await CallCreatePost(data)) as any;
      console.log("CallCreatePost", { response, error });
      if (response) {
        toast.success(response?.message);
        route.back();
      }
      if (error) {
        handleCommonErrors(error);
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
              errorMessage={"Please select a course"}
              fullWidth
              label="Course"
              placeholder="Select Course"
              labelPlacement="outside"
              {...register("courseId", { required: true })}
               onChange={(e) => {
                setValue("courseId", e.target.value);
                getAllCader(e.target.value);
              }}
            >
              {advertisement?.map((item: any) => (
                <SelectItem key={item?._id}>{item?.name}</SelectItem>
              ))}
            </Select>
            <Select
              isRequired
              errorMessage={"Please select a Cadre"}
              isLoading={loading}
              fullWidth
              label="Cadre"
              placeholder="Select Cadre"
              labelPlacement="outside"
              {...register("cadreId", { required: true })}
            >
              {cader?.map((item: any) => (
                <SelectItem key={item?._id}>{item?.name}</SelectItem>
              ))}
            </Select>
            <Input
              isRequired
              {...register("name", { required: true })}
              label="Name"
              type="text"
              placeholder={`Enter ${slug[0]} Name`}
              errorMessage={`Please enter ${slug[0]} name`}
              labelPlacement="outside"
              radius="sm"
            />
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

export default AddPost;
