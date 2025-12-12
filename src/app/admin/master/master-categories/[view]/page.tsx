"use client";
import { CallGetAllCategories } from "@/_ServerActions";
import { Card, CardBody, CardHeader, Tooltip } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  isHOD: string;
  description: string;
};

const ViewMasterCategory = () => {
  const { view: id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log("isLoading::: ", isLoading);

  const {
    // register,
    // handleSubmit,
    watch,
    setValue,
    // formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    getAllList();
  }, []);

  const getAllList = async () => {
    setIsLoading(true);
    const { data } = await CallGetAllCategories();
    if (data) {
      const dataResponse = data as any;
      const findData = dataResponse?.data?.find(
        (item: any) => item?._id === id,
      );
      setValue("name", findData?.name);
      setValue("isHOD", findData?.isHOD);
      setValue("description", findData?.description);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Card className="max-w-full px-4 rounded-lg bg-[#fdfdfd]">
        <CardHeader className="flex gap-3 px-0 md:px-3">
          <div className="flex w-full items-center gap-x-3 mt-3">
            <div className="flex gap-2 items-center">
              <Tooltip content="Back" color="primary">
                <button onClick={() => router.back()}>
                  <i className="fa-solid fa-arrow-left text-xl me-2" />
                </button>
              </Tooltip>
            </div>
            <p className="text-xl font-semibold">Master Categories Details</p>
            {/* <div className="flex gap-2 items-center">
                  <Tooltip content="Edit" color="primary">
                    <Button
                      onClick={() => setIsEdit(true)}
                      variant="light"
                      className="rounded-full"
                    >
                      <i className="fa-solid fa-pen-to-square text-xl" />
                    </Button>
                  </Tooltip>
                </div> */}
          </div>
        </CardHeader>
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
        <CardBody className="px-0 md:px-2">
          <div className="w-full">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <tbody>
                  <tr>
                    <td className="font-semibold px-4 py-2 border border-gray-200 w-80">
                      Title:
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {watch("name")}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border border-gray-200 w-80">
                      Is this category head by someone:
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {watch("isHOD") ? "True" : "False"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold px-4 py-2 border border-gray-200 w-80">
                      Description:
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {watch("description")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default ViewMasterCategory;
