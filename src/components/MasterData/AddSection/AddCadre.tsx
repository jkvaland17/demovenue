"use client";
import {
  Button,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { CallGetAllMasterCourses } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";

const AddCadre = ({
  handleSubmit,
  onSubmit,
  register,
  slug,
  router,
  isLoadingBtn,
}: any) => {
  const [loading, setLoading] = useState<any>(false);
  const [advertisement, setAllAdvertisement] = useState<any>([]);

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

  useEffect(() => {
    getAllCourse();
  }, []);

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
            >
              {advertisement?.map((item: any) => (
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

export default AddCadre;
