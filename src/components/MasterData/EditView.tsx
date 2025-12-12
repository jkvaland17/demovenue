"use client";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  CallGetAllMasterCourseById,
  CallGetAllMasterPostById,
  CallGetAllMasterZoneById,
  CallGetCategoriesId,
  CallGetMainSportById,
  CallGetSubSportById,
  CallUpdateMainSport,
  CallUpdateMasterCourses,
  CallUpdateMasterData,
  CallUpdateMasterDistrict,
  CallUpdateMasterPost,
  CallUpdateMasterRange,
  CallUpdateMasterZone,
  CallUpdateSubSport,
} from "@/_ServerActions";
import { Card, CardBody, CardHeader, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ScreenLoader from "../ScreenLoader";
import DefaultEdit from "./EditSection/DefaultEdit";
import EditRange from "./EditSection/EditRange";
import EditPost from "./EditSection/EditPost";
import EditSubSport from "./EditSection/EditSubSport";
import EditCadre from "./EditSection/EditCadre";

type FormData = {
  name: string;
  description: string;
  id: string;
  status: boolean;
};

type ListProps = {
  title: string;
  route: string;
  slug: any;
};

const ViewEdit: React.FC<ListProps> = ({ title, route, slug }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [Data, setData] = useState<any>(null);

  useEffect(() => {
    if (slug.length === 3) {
      setType(slug[2]);
      setId(slug[1]);
    } else {
      router.back();
    }
  }, [slug]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (id) {
      getAllList();
    }
  }, [id]);
  console.log("slug::: ", slug);

  const getAllList = async () => {
    try {
      setIsLoading(true);
      if (slug[0] === "course") {
        const { data, error } = await CallGetAllMasterCourseById(id);
        console.log("CallGetAllMasterCourseById", { data, error });
        if (data) {
          const dataResponse = data as any;
          setData({
            ...Data,
            id: dataResponse._id,
            ...dataResponse,
          });
        }
        if (error) {
          handleCommonErrors(error);
        }
      } else if (
        slug[0] === "zone" ||
        slug[0] === "range" ||
        slug[0] === "districts"
      ) {
        const { data, error } = (await CallGetAllMasterZoneById(id)) as any;
        console.log("CallGetAllMasterZoneById", { data, error });
        if (data?.data) {
          const dataResponse = data?.data as any;
          setData({
            ...Data,
            id: dataResponse?._id,
            district: dataResponse?._id,
            zoneId:
              dataResponse?.parentRangeId || dataResponse?.parentGlobalMasterId,
            ...dataResponse,
          });
        }
        if (error) {
          handleCommonErrors(error);
        }
      } else if (slug[0] === "post") {
        const { data, error } = (await CallGetAllMasterPostById(id)) as any;
        console.log("CallGetAllMasterPostById", { data, error });
        if (data) {
          const dataResponse = data as any;
          setData({
            ...Data,
            id: dataResponse?._id,
            ...dataResponse,
          });
        }
      } else if (slug[0] === "mainsport") {
        const { data, error } = (await CallGetMainSportById(id)) as any;
        console.log("CallGetMainSportById", { data, error });
        if (data) {
          const dataResponse = data?.data as any;
          setData({
            ...Data,
            id: dataResponse?._id,
            ...dataResponse,
          });
        }
      } else if (slug[0] === "subsport") {
        const { data, error } = (await CallGetSubSportById(id)) as any;
        console.log("CallGetSubSportById", { data, error });
        if (data) {
          const dataResponse = data?.data as any;
          setData({
            ...Data,
            id: dataResponse?._id,
            ...dataResponse,
          });
        }
      } else {
        const { data, error } = await CallGetCategoriesId(id);
        console.log("CallGetCategoriesId", { data, error });
        if (data) {
          const dataResponse = data as any;
          setData({
            ...Data,
            id: dataResponse.data._id,
            ...dataResponse?.data,
          });
        }
        if (error) {
          handleCommonErrors(error);
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.log("error::: ", error);
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      let response;
      if (slug[0] === "course") {
        response = await CallUpdateMasterCourses(Data);
        console.log("CallUpdateMasterCourses", response);
      } else if (slug[0] === "zone") {
        response = await CallUpdateMasterZone(Data);
        console.log("CallUpdateMasterZone", response);
      } else if (slug[0] === "range") {
        response = await CallUpdateMasterRange(Data);
        console.log("CallUpdateMasterRange", response);
      } else if (slug[0] === "districts") {
        response = await CallUpdateMasterDistrict(Data);
        console.log("CallUpdateMasterDistrict", response);
      } else if (slug[0] === "post") {
        response = await CallUpdateMasterPost(Data);
        console.log("CallUpdateMasterPost", response);
      } else if (slug[0] === "mainsport") {
        response = await CallUpdateMainSport(Data);
        console.log("CallUpdateMainSport", response);
      } else if (slug[0] === "subsport") {
        response = await CallUpdateSubSport(Data);
        console.log("CallUpdateSubSport", response);
      } else {
        response = await CallUpdateMasterData(Data);
        console.log("CallUpdateMasterData", response);
      }
      if (response?.data) {
        const dataResponse = response as any;
        toast.success(dataResponse?.data?.message);
        router.push(`/admin/master/master-data/${route}`);
      }
      if (response?.error) {
        console.log("error::: ", response?.error);
        toast.error(response?.error);
        setIsLoading(false);
      }
      if (response?.error) {
        handleCommonErrors(response?.error);
      }
    } catch (error) {
      console.log("error::: ", error);
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {type === "view" && (
        <Card className="max-w-full rounded-lg bg-[#fdfdfd] px-4">
          <CardHeader className="flex gap-3 px-0 md:px-2">
            <div className="mt-3 flex w-full items-center gap-x-3 text-xl">
              <div className="flex items-center gap-2">
                <Tooltip content="Back" color="primary">
                  <button
                    onClick={() =>
                      router.push(`/admin/master/master-data/${route}`)
                    }
                    className="me-2"
                  >
                    <i className="fa-solid fa-arrow-left text-xl" />
                  </button>
                </Tooltip>
              </div>
              <p className="text-xl font-medium">{title} Details</p>
            </div>
          </CardHeader>
          <CardBody className="px-0 md:px-2">
            <div className="w-full">
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <tbody>
                    <tr>
                      <td className="w-80 border border-gray-200 px-4 py-2 font-semibold">
                        Name:
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {Data?.value || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-semibold">
                        Description:
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {Data?.description || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {(type === "edit" && slug[0] === "range") || slug[0] === "districts" ? (
        <EditRange
          setData={setData}
          Data={Data}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          title={title}
          register={register}
          errors={errors}
          router={router}
          route={route}
          isLoading={isLoading}
          control={control}
          slug={slug}
        />
      ) : type === "edit" && slug[0] === "post" ? (
        <EditPost
          setData={setData}
          Data={Data}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          title={title}
          register={register}
          errors={errors}
          router={router}
          route={route}
          isLoading={isLoading}
          control={control}
          slug={slug}
        />
      ) : type === "edit" && slug[0] === "cadre" ? (
        <EditCadre
          setData={setData}
          Data={Data}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          title={title}
          register={register}
          errors={errors}
          router={router}
          route={route}
          isLoading={isLoading}
          control={control}
          slug={slug}
        />
      ) : type === "edit" && slug[0] === "subsport" ? (
        <EditSubSport
          setData={setData}
          Data={Data}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          title={title}
          register={register}
          errors={errors}
          router={router}
          route={route}
          isLoading={isLoading}
          control={control}
          slug={slug}
        />
      ) : (
        <>
          {isLoading && <ScreenLoader />}
          {type === "edit" && (
            <DefaultEdit
              setData={setData}
              Data={Data}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              title={title}
              register={register}
              errors={errors}
              router={router}
              route={route}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ViewEdit;
