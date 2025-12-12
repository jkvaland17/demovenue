import {
  CallGetAllMasterCader,
  CallGetAllMasterCourses,
  CallGetDvpstAllZone,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";

const EditPost = ({
  setData,
  Data,
  handleSubmit,
  onSubmit,
  title,
  register,
  errors,
  router,
  route,
  isLoading,
  slug,
}: any) => {
  const [loading, setLoading] = useState<any>(false);
  const [advertisement, setAllAdvertisement] = useState<any>([]);
  const [cader, setAllCader] = useState<any>([]);

  const getAllCourse = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = (await CallGetAllMasterCourses()) as any;
      // console.log("CallGetAllMasterCourses", { data, error });
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
      console.log("id", id);
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

  useEffect(() => {
    if (Data?.courseId) {
      getAllCader(Data?.courseId);
    }
  }, [Data?.courseId]);

  return (
    <>
      <Card className="max-w-full p-3">
        <CardHeader className="flex">
          <div className="mb-2 mt-3 flex w-full flex-col justify-between gap-x-3 text-2xl md:flex-row md:items-center">
            <p className="text-xl font-medium">Update {title}</p>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-6">
              <Select
                {...register("courseId")}
                items={advertisement || []}
                label="Course"
                isDisabled={slug[2] === "edit"}
                labelPlacement="outside"
                placeholder="Select Course"
                radius="sm"
                isRequired
                isLoading={isLoading?.zones}
                selectedKeys={Data?.courseId ? [Data.courseId] : []}
                onSelectionChange={(e: any) => {
                  const value = Array.from(e)[0] as string;
                  setData({ ...Data, courseId: value });
                }}
              >
                {(item: any) => (
                  <SelectItem key={item?._id}>{item?.name}</SelectItem>
                )}
              </Select>
              <Select
                {...register("cadreId")}
                isDisabled={slug[2] === "edit"}
                items={cader || []}
                label="Cadre"
                labelPlacement="outside"
                placeholder="Select Cadre"
                radius="sm"
                isRequired
                isLoading={isLoading?.zones}
                selectedKeys={Data?.cadreId ? [Data.cadreId] : []}
                onSelectionChange={(e: any) => {
                  const value = Array.from(e)[0] as string;
                  setData({ ...Data, cadreId: value });
                }}
              >
                {(item: any) => (
                  <SelectItem key={item?._id}>{item?.name}</SelectItem>
                )}
              </Select>

              <Input
                isRequired
                {...register("name")}
                value={Data?.name}
                onChange={(e) => setData({ ...Data, name: e.target.value })}
                className={`${errors?.value && "border border-red-600"}`}
                label="Name"
                type="text"
                placeholder={`Enter ${title} Name`}
                labelPlacement="outside"
                radius="sm"
              />
              <div className="col-span-1 md:col-span-2">
                <Textarea
                  {...register("description")}
                  value={Data?.description}
                  onChange={(e) =>
                    setData({ ...Data, description: e.target.value })
                  }
                  label="Description"
                  labelPlacement="outside"
                  placeholder={`Enter your ${title} description`}
                />
              </div>
            </div>
            <div className="mt-3 flex w-full items-center justify-end gap-3">
              <Button
                variant="flat"
                type="button"
                color="danger"
                radius="sm"
                onPress={() =>
                  router.push(`/admin/master/master-data/${route}`)
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                radius="sm"
                color="primary"
                className="float-right w-full md:w-fit"
                isLoading={isLoading}
              >
                Update {title} Data
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default EditPost;
