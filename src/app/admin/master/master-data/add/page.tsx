"use client";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CallCreateCategories, CallGetAllCategories } from "@/_ServerActions";
import { Button, Card, CardBody, CardHeader, Input, Textarea } from "@nextui-org/react";

type FormData = {
  name: string;
  code: string;
  description: string;
  isHOD: string;
  orgAdminId: string;
  labelId: string;
  status: boolean;
  parentMasterCategoryId: boolean;
};

const AddCategory = () => {
  const Auth: any = useSession();
  const route = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [categoryList, setCategoryList] = useState([]);
  console.log("categoryList::: ", categoryList);

  useEffect(() => {
    const getData = async () => {
      const { data } = await CallGetAllCategories();
      if (data) {
        const dataResponse = data as any;
        setCategoryList(dataResponse?.data as any);
      }
    };
    getData();
  }, []);

  const onSubmit = async (data: FormData) => {
    console.log("data::: ", data);
    try {
      data.labelId = Auth?.data?.user?.data?.parentId as string;
      data.code = data?.name?.toLowerCase();
      const response = await CallCreateCategories(data);
      console.log("response::: ", response);
      if (response?.data) {
        const dataResponse = response as any;
        toast.success(dataResponse?.data?.message);
        route.back();
      }
    } catch (error) {
      console.log("error::: ", error);
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
    }
  };

  return (
    <>
      <Card className="max-w-full p-3">
        <CardHeader className="flex gap-3">
          <div className="flex items-center gap-x-3 my-0 text-xl">
            <p className="font-medium">ADD CATEGORIES</p>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              <Input
                isRequired
                {...register("name")}
                className={`${errors?.name && "border border-red-600"}`}
                label="Title"
                type="text"
                placeholder="Enter a name"
                labelPlacement="outside"
                radius="sm"
                // startContent={
                //   <div className="pr-2">
                //     <i className="fa-solid fa-user" />
                //   </div>
                // }
              />
              <Textarea
                isRequired
                {...register("description")}
                label="Description"
                labelPlacement="outside"
                placeholder="Enter your description"
              />
              <div className="col-span-1 my-3 flex justify-end items-center gap-x-2">
                <Button
                  variant="flat"
                  type="button"
                  color="danger"
                  radius="sm"
                  onPress={() => route.push("/admin/master/master-data")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  radius="sm"
                  color="primary"
                  className="float-right w-full md:w-fit"
                >
                  Create Category
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default AddCategory;
