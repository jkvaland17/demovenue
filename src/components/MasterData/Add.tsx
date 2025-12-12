"use client";

import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import {
  CallCategoryByCode,
  CallCreateCategoriesData,
  CallCreateCourses,
  CallCreateDistricts,
  CallCreateMainSport,
  CallCreatePost,
  CallCreateZone,
  CallGetAllSpecialtiesId,
  CallUploadFile,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import ScreenLoader from "../ScreenLoader";
import {
  CombinedProps,
  formData,
  LoadingState,
} from "@/components/MasterData/types";
import AddRange from "./AddSection/AddRange";
import DefaultAdd from "./AddSection/DefaultAdd";
import AddNoticeResult from "./AddSection/AddNoticeResult";
import { Card, CardBody, CardHeader, Switch } from "@nextui-org/react";
import AddPost from "./AddSection/AddPost";
import AddMainSport from "./AddSection/AddMainSport";
import AddCadre from "./AddSection/AddCadre";

const CombinedForm: React.FC<CombinedProps> = ({ title, apiCode, route }) => {
  const router = useRouter();
  const [pdfFile, setPdfFile] = useState<any>(null);
  const [loaderFile, setLoaderFile] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<formData>({
    defaultValues: {
      status: false,
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);
  const [uploadST, setUploadST] = useState<File | null>(null);
  const [uploadPR, setUploadPR] = useState<File | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    advertisementLink: false,
    prospectusLink: false,
  });
  const [allCourse, setAllCourse] = useState<any[]>([]);
  const { slug } = useParams() as { slug: string[] };
  console.log("slug::: ", slug);

  useEffect(() => {
    getData();
  }, []);

  const getData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { data, error } = (await CallCategoryByCode(slug[0])) as any;
      if (data) {
        setValue("masterCategoryId", data?.data?._id);
        setValue("status", false);
        if (slug[0] === "advertisement") {
          await getCourseData();
        }
      }
      if (error) {
        handleCommonErrors(error);
      }
      setIsLoading(false);
    } catch (error: any) {
      console.log("error::: ", error);
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  const getCourseData: () => Promise<void> = async () => {
    try {
      if (!slug[0]) return;
      const { data, error } = (await CallCategoryByCode(slug[0])) as any;
      if (data) {
        await getAllList(data?.data?._id);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error: any) {
      console.log("error::: ", error);
      toast.error(error?.message);
    }
  };

  const getAllList = async (id: string): Promise<void> => {
    try {
      const { data, error } = (await CallGetAllSpecialtiesId(id)) as any;
      if (data) {
        setAllCourse(data?.data || []);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error: any) {
      console.log("error::: ", error);
    }
  };

  const uploadFile = async (
    file: File,
    name: keyof LoadingState,
  ): Promise<void> => {
    try {
      setLoading((prev) => ({ ...prev, [name]: true }));
      const formData = new FormData();
      formData.append("file", file);
      const response: any = await CallUploadFile(formData);
      setValue(name as keyof formData, response.data?.data?.url);
      setLoading((prev) => ({ ...prev, [name]: false }));
      if (response?.error) {
        handleCommonErrors(response?.error);
      }
    } catch (error: any) {
      console.log("error::: ", error);
      toast.error(error?.message);
      setLoading((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleChangeST = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadST(e.target.files[0]);
      uploadFile(e.target.files[0], "advertisementLink");
    } else {
      setUploadST(null);
    }
  };

  const handleChangePR = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadPR(e.target.files[0]);
      uploadFile(e.target.files[0], "prospectusLink");
    } else {
      setUploadPR(null);
    }
  };

  const onSubmit = async (data: formData): Promise<void> => {
    try {
      setIsLoadingBtn(true);
      data.status = watch("status");
      data.masterCategoryId = watch("masterCategoryId");
      if (slug[0] === "course") {
        const response = (await CallCreateCourses(data)) as any;
        if (response?.data?.message === "Course created successfully") {
          toast.success(response?.data?.message);
          router.back();
        }
        console.log("CallCreateCourses response: ", response);
      } else if (slug[0] === "post") {
        const response = (await CallCreatePost(data)) as any;
        console.log("CallCreatePost", response);
        if (response?.data?.message === "Course created successfully") {
          toast.success(response?.data?.message);
          router.back();
        }
      } else if (slug[0] === "zone") {
        const response = (await CallCreateZone(data)) as any;
        console.log("CallCreateZone", response);
        if (response?.data?.status_code === 200) {
          toast.success(response?.data?.message);
          router.back();
        }
      } else if (slug[0] === "mainsport") {
        const response = (await CallCreateMainSport(data)) as any;
        console.log("CallCreateMainSport", response);
        if (response?.data) {
          toast.success(response?.data?.message);
          router.back();
        }
      } else {
        const response: any = await CallCreateCategoriesData(data);
        if (response?.data) {
          toast.success(response?.data?.message);
          router.back();
        }
        if (response?.error) {
          handleCommonErrors(response?.error);
        }
      }
    } catch (error: any) {
      console.log("error::: ", error);
      toast.error(error?.message);
    } finally {
      setIsLoadingBtn(false);
    }
  };

  const handleChange = (e: any) => {
    if (e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
      uploadFile(e.target.files[0], "prospectusLink");
    } else {
      setPdfFile(null);
    }
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "startDate" | "endDate",
  ) => {
    const value = e.target.value;
    setValue(field, value);
  };

  return (
    <div className="relative">
      {isLoading && <ScreenLoader />}
      <Card className="max-w-full p-3">
        <CardHeader className="flex gap-3">
          <div className="mb-2 mt-3 flex w-full items-center justify-between gap-x-3 text-2xl">
            <p className="text-xl font-medium">
              {slug[0] === "advertisement" ? "advertisement" : `Add ${title}`}
            </p>
            {/* <div className="flex items-center gap-2">
              <p className="text-sm">Status</p>
              <Switch
                size="sm"
                onValueChange={(e: boolean) => setValue("status", e)}
                isSelected={watch("status")}
              />
            </div> */}
          </div>
        </CardHeader>
        <CardBody>
          {slug[0] === "range" || slug[0] === "districts" ? (
            <>
              <AddRange slugData={slug} />
            </>
          ) : slug[0] === "post" ? (
            <>
              <AddPost slugData={slug} />
            </>
          ) : slug[0] === "cadre" ? (
            <>
              <AddCadre
                slugData={slug}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                register={register}
                errors={errors}
                slug={slug}
                router={router}
                route={route}
                title={title}
                isLoadingBtn={isLoadingBtn}
              />
            </>
          ) : slug[0] === "subsport" ? (
            <>
              <AddMainSport slugData={slug} />
            </>
          ) : (
            <>
              <DefaultAdd
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                register={register}
                errors={errors}
                slug={slug}
                router={router}
                route={route}
                title={title}
                isLoadingBtn={isLoadingBtn}
              />
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default CombinedForm;
