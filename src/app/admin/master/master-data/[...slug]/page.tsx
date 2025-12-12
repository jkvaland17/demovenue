"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import CommonTable from "@/components/CommonTable/CommonTable";
import AddData from "@/components/MasterData/Add";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  CallCategoryByCode,
  CallGetAllDvpstDistricts,
  CallGetAllMasterCourses,
  CallGetAllMasterDistrict,
  CallGetAllMasterPost,
  CallGetAllSpecialtiesId,
  CallGetAllSports,
  CallGetAllSubSports,
  CallGetDvpstAllZone,
  CallGetDvpstMandal,
  CallGetRange,
  CallUpdateMasterData,
} from "@/_ServerActions";
import {
  Advertisement,
  ApiResponse,
} from "../../../../../components/MasterData/types";
import ViewEdit from "@/components/MasterData/EditView";
import CommonHeaderActions from "@/components/CommonHeaderActions";

const AllComponent = () => {
  const { slug } = useParams() as { slug: string[] };
  const [route, setRoute] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [advertisements, setAllAdvertisement] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  console.log("slug::: ", slug);
  // console.log("advertisements", advertisements);

  useEffect(() => {
    if (slug?.length > 0) {
      setRoute(slug[0]);
    }
  }, [slug]);

  useEffect(() => {
    if (route) {
      void fetchCategoryData();
    }
  }, [route]);

  const fetchCategoryData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { data, error } = (await CallCategoryByCode(route)) as any;
      console.log("CallCategoryByCode", { data, error });
      if (data) {
        setCategory(data.data?._id);
      }
      if (error) handleCommonErrors(error);
    } catch (error) {
      console.error("Error fetching category data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllList = async (id: string): Promise<void> => {
    try {
      if (slug[0] === "course") {
        const { data, error } = (await CallGetAllMasterCourses()) as any;
        console.log("CallGetAllMasterCourses", { data, error });
        if (data) setAllAdvertisement(data);
      } else if (slug[0] === "post") {
        const { data, error } = (await CallGetAllMasterPost()) as any;
        console.log("CallGetAllMasterPost", { data, error });
        if (data) setAllAdvertisement(data);
      } else if (slug[0] === "zone") {
        const { data, error } = (await CallGetDvpstAllZone()) as any;
        console.log("CallGetDvpstAllZone", { data, error });
        if (data) setAllAdvertisement(data.data);
        if (error) handleCommonErrors(error);
      } else if (slug[0] === "range") {
        const query = `page=${page}&limit=10`;
        const { data, error } = (await CallGetRange(query)) as any;
        console.log("range", { data, error });
        if (data) setAllAdvertisement(data.data);
        if (error) handleCommonErrors(error);
        setTotalPage(data?.pagination?.totalPages);
      } else if (slug[0] === "districts") {
        const query = `page=${page}&limit=10`;
        const { data, error } = (await CallGetAllMasterDistrict(query)) as any;
        console.log("CallGetAllMasterDistrict", { data, error });
        if (data) setAllAdvertisement(data.data);
        if (error) handleCommonErrors(error);
        setTotalPage(data?.pagination?.totalPages);
      } else if (slug[0] === "mainsport") {
        const query = `page=${page}&limit=10`;
        const { data, error } = (await CallGetAllSports(query)) as any;
        console.log("CallGetAllSports", { data, error });
        if (data) setAllAdvertisement(data.data);
        if (error) handleCommonErrors(error);
        setTotalPage(data?.pagination?.totalPages);
      } else if (slug[0] === "subsport") {
        const query = `page=${page}&limit=10`;
        const { data, error } = (await CallGetAllSubSports(query)) as any;
        console.log("CallGetAllSubSports", { data, error });
        if (data) setAllAdvertisement(data.data);
        if (error) handleCommonErrors(error);
        setTotalPage(data?.pagination?.totalPages);
      } else {
        const { data, error } = (await CallGetAllSpecialtiesId(id)) as any;
        console.log("CallGetAllSpecialtiesId", { data, error });
        if (data) setAllAdvertisement(data.data);
        if (error) handleCommonErrors(error);
      }
    } catch (error) {
      console.error("Error fetching all list:", error);
    }
  };
  

  useEffect(() => {
    fetchAllList("");
  }, [page]);

  const statusChange = useCallback(
    async (id: string, field: string, value: boolean): Promise<void> => {
      try {
        setIsLoading(true);
        const response: ApiResponse<{ message: string }> =
          await CallUpdateMasterData({ [field]: value, id });
        console.log("CallUpdateMasterData", response);
        if (response.data) {
          toast.success(response.data.message);
          await fetchAllList(category);
        }
        if (response.error) handleCommonErrors(response.error);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "An error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [category],
  );

  const getColumns = useMemo(() => {
    switch (route.toLowerCase()) {
      case "course":
        return ["Sr No", "name", "description", "action"];
      case "range":
        return ["zone", "name", "description", "action"];
      case "districts":
        return ["code", "name", "description", "action"];
      case "subsport":
        return ["sport", "subSport", "description", "action"];
      default:
        return ["name", "description", "action"];
    }
  }, [route]);

  const displayName = useMemo(() => {
    switch (route.toLowerCase()) {
      case "course":
        return "course";
      case "faqs":
      case "faq":
        return "FAQs";
      default:
        return route.charAt(0).toUpperCase() + route.slice(1);
    }
  }, [route]);

  const searchPlaceholder = `Search ${displayName.toLowerCase()} name`;
  const createButtonText =
    displayName === "FAQs" ? "Add FAQ" : `Create ${displayName}`;

  // const filteredList = useMemo(() => {
  //   if (!advertisements) return [];
  //   const searchLower = searchQuery?.toLowerCase();
  //   return advertisements?.filter((item: any) =>
  //     item?.value?.toLowerCase()?.includes(searchLower),
  //   );
  // }, [advertisements, searchQuery]);

  if (slug?.length === 2 && slug?.includes("add")) {
    return (
      <AddData
        title={route}
        apiCode={route}
        route={`/admin/master/master-data/${route}`}
      />
    );
  }
  if (slug?.length === 3 && slug?.includes("edit")) {
    return <ViewEdit title={slug[0]} route={slug[0]} slug={slug} />;
  }
  // console.log("advertisements", advertisements);

  return (
    <>
      {slug?.length === 1 && (
        <>
          <div className="mb-5 flex w-full flex-col justify-between lg:flex-row lg:items-center">
            <p className="text-xl">{displayName} List</p>
            <CommonHeaderActions
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder={searchPlaceholder}
              createButtonText={createButtonText}
              route={slug[0]}
            />
          </div>
          <CommonTable
            columns={getColumns}
            data={advertisements}
            isLoading={isLoading}
            basePath={`/admin/master/master-data/${route}`}
            onStatusChange={statusChange}
            page={page}
            setPage={setPage}
            totalPage={totalPage}
          />
        </>
      )}
    </>
  );
};

export default AllComponent;
