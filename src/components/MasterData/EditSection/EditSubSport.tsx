import {
  CallGetAllMasterCader,
  CallGetAllMasterCourses,
  CallGetAllSports,
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

const EditSubSport = ({
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

  const getAllSport = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = (await CallGetAllSports()) as any;
      console.log("CallGetAllSports", { data, error });
      if (error) {
        handleCommonErrors(error);
      }
      if (data) {
        setAllAdvertisement(data?.data);
      }
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSport();
  }, []);

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
                {...register("parentSportsId")}
                items={advertisement || []}
                label="Sport"
                labelPlacement="outside"
                placeholder="Select Course"
                radius="sm"
                isRequired
                isLoading={isLoading?.zones}
                selectedKeys={Data?.parentSportsId ? [Data.parentSportsId] : []}
                onSelectionChange={(e: any) => {
                  const value = Array.from(e)[0] as string;
                  setData({ ...Data, parentSportsId: value });
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
              <Input
                isRequired
                {...register("code")}
                value={Data?.code}
                onChange={(e) => setData({ ...Data, code: e.target.value })}
                className={`${errors?.value && "border border-red-600"}`}
                label="Code"
                type="text"
                placeholder={`Enter ${title} Code`}
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

export default EditSubSport;
