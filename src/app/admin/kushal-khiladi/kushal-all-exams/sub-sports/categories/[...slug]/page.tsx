"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { CallGetKushalSubSportCategoriesDetails } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Pagination } from "@nextui-org/react";
import BackButton from "@/components/BackButton";
import TableSkeleton from "@/components/kushal-components/loader/TableSkeleton";
import FlatCard from "@/components/FlatCard";
import { useParams } from "next/navigation";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import Link from "next/link";
import { useSessionData } from "@/Utils/hook/useSessionData";
import { ColumnDecider } from "@/Utils/kushal-khiladi/advertisementTilesColumn";
import MaleFemaleButton from "@/components/kushal-components/common/MaleFemaleBtn";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";

const SubSportsCategoriesDetails = () => {
  const { advertisementId, selectedTile } = useSessionData();
  const { slug } = useParams();
  const sportId = slug[0] ?? "";
  const subSportId = slug[1] ?? "";
  const [loader, setLoader] = useState<any>({
    table: true,
    excel: false,
    pdf: false,
  });
  const [dashboardData, setDashboardData] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<any>({
    gender: "",
  });

  const SubSportsColumn = useMemo(() => {
    const baseColumn = ColumnDecider[selectedTile] ?? [];
    return [...baseColumn, { title: "Duplicate Count", key: "totalDuplicate" }];
  }, [selectedTile]);

  const routeDecider = (key: string, params: Record<string, any>) => {
    const routes: any = {
      totalApplicants: `/admin/kushal-khiladi/kushal/card-details/total/${params?.tilesType}/${params.sportsId}/${params.subSportsId}/original/${params.subSportsCategories}`,
      totalScrutiny: `/admin/kushal-khiladi/kushal/card-details/scrutinized/${params?.tilesType}/${params.sportsId}/${params.subSportsId}/original/${params.subSportsCategories}`,
      foundFit: `/admin/kushal-khiladi/kushal/card-details/Accepted/${params?.tilesType}/${params.sportsId}/${params.subSportsId}/original/${params.subSportsCategories}`,
      foundUnfit: `/admin/kushal-khiladi/kushal/card-details/Rejected/${params?.tilesType}/${params.sportsId}/${params.subSportsId}/original/${params.subSportsCategories}`,
      pendingScrutinyCount: `/admin/kushal-khiladi/kushal/card-details/Pending/${params?.tilesType}/${params.sportsId}/${params.subSportsId}/original/${params.subSportsCategories}`,
      pendingDvCandidates: `/admin/kushal-khiladi/kushal/card-details/Pending/${params?.tilesType}/${params.sportsId}/${params.subSportsId}/original/${params.subSportsCategories}`,
      admitCardReleased: `/admin/kushal-khiladi/kushal/card-details/Released/${params?.tilesType}/${params.sportsId}/${params.subSportsId}/original/${params.subSportsCategories}`,
      totalDuplicate: `/admin/kushal-khiladi/kushal/card-details/total/${params?.tilesType}/${params.sportsId}/${params.subSportsId}/duplicate/${params.subSportsCategories}`,
    };
    return routes[key] || "#";
  };

  const GetSubSportsDetailsData = async () => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    try {
      const query = `advertisementId=${advertisementId}&gender=${selectedFilter?.gender}&subSportId=${subSportId}`;
      const { data, error } = (await CallGetKushalSubSportCategoriesDetails(
        query,
      )) as any;
      console.log("CallGetKushalSubSportCategoriesDetails", { data, error });
      
      if (data?.data) {
        setDashboardData(data?.data);
        setTotalPage(data?.pagination?.totalPages);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    }
  };

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key, index: number) => {
      const cellValue = item[columnKey as any];
      const actualIndex = Math.abs(page - 1) * 10 + (index + 1);
      switch (columnKey) {
        case "srNo":
          return <p className="text-bold text-sm capitalize">{actualIndex}</p>;
        case "totalApplicants":
        case "totalScrutiny":
        case "totalScrutiny":
        case "foundFit":
        case "foundUnfit":
        case "totalDuplicate":
        case "pendingDvCandidates":
        case "admitCardReleased":
          return (
            <Link
              href={routeDecider(columnKey, {
                subSportsId: subSportId,
                subSportsCategories: item?._id,
                sportsId: sportId,
                tilesType: selectedTile,
              })}
              className={`text-bold text-sm capitalize ${cellValue != 0 && `text-blue-600`}`}
            >
              {cellValue}
            </Link>
          );
        default:
          return <p className="text-nowrap">{cellValue}</p>;
      }
    },
    [page, dashboardData],
  );

  useEffect(() => {
    if (advertisementId && subSportId) {
      GetSubSportsDetailsData();
    }
  }, [advertisementId, subSportId, selectedFilter]);

  return (
    <>
      {loader?.table ? (
        <FlatCard>
          <TableSkeleton columnsCount={7} filters filtersCount={6} />
        </FlatCard>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="col-span-4 mb-5 text-2xl font-semibold">
              {dashboardData?.sportsData?.name} Sub-Sports Details
            </h1>
            <BackButton />
          </div>
          <div className="mb-3 flex justify-end mob:justify-start">
            <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(
                  `v1/admin/downloadCategoriesWiseExcel?advertisementId=${advertisementId}&gender=${selectedFilter?.gender}&sportId=${subSportId}&tilesType=${selectedTile}`,
                  "SportsDetail",
                  setLoader,
                );
              }}
              pdfFunction={() => {
                DownloadKushalPdf(
                  `v1/admin/downloadCategoriesWisePdf?advertisementId=${advertisementId}&gender=${selectedFilter?.gender}&sportId=${subSportId}&tilesType=${selectedTile}`,
                  "SportsDetail",
                  setLoader,
                );
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
          </div>
          <Table
            isStriped
            color="default"
            className="mb-6"
            aria-label="Example static collection table"
            topContent={
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <p className="mb-2 font-medium">Filters</p>
                  <MaleFemaleButton
                    selectedBtn={dashboardData?.gender}
                    filterFunction={setSelectedFilter}
                  />
                </div>
              </div>
            }
            bottomContent={
              <div className="flex justify-end">
                <Pagination
                  showControls
                  total={totalPage}
                  page={page}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
          >
            <TableHeader columns={SubSportsColumn}>
              {(column: any) => (
                <TableColumn
                  key={column.key}
                  align={column.key === "actions" ? "center" : "start"}
                  className="text-nowrap"
                >
                  {column.title}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent="No Data!">
              {dashboardData?.subSportsData?.map((item: any, index: number) => (
                <TableRow key={item._id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey, index)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
};

export default SubSportsCategoriesDetails;
