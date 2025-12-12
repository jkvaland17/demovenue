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
import { CallGetKushalSubSportDetails } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Chip } from "@nextui-org/react";
import BackButton from "@/components/BackButton";
import TableSkeleton from "@/components/kushal-components/loader/TableSkeleton";
import FlatCard from "@/components/FlatCard";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSessionData } from "@/Utils/hook/useSessionData";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import moment from "moment";
import { ColumnDecider } from "@/Utils/kushal-khiladi/advertisementTilesColumn";
import MaleFemaleButton from "@/components/kushal-components/common/MaleFemaleBtn";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const SubSportsInfo = () => {
  const { id: sportsId } = useParams() as any;
  const { advertisementId, selectedTile } = useSessionData();
  const [subSportsData, setSubSportsData] = useState<any>([]);
  const [loader, setLoader] = useState<any>({
    table: true,
    excel: false,
    pdf: false,
  });
  const [selectedFilter, setSelectedFilter] = useState<any>({
    gender: "",
  });

  const SubSportsColumn = useMemo(() => {
    const baseColumn = ColumnDecider[selectedTile] ?? [];
    return [...baseColumn, { title: "Duplicate Count", key: "totalDuplicate" }];
  }, [selectedTile]);

  const statusColorMap: { [key: string]: ChipColor } = {
    pending: "warning",
    released: "success",
  };

  const GetSubSportsData = async () => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    try {
      const query = `advertisementId=${advertisementId}&sportId=${sportsId}&tilesType=${selectedTile}&gender=${selectedFilter?.gender}`;
      const { data, error } = (await CallGetKushalSubSportDetails(
        query,
      )) as any;
      console.log("CallGetKushalSubSportDetails", { data, error });
      
      if (data) {
        setSubSportsData(data?.data);
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

  const routeDecider = (key: string, params: Record<string, any>) => {
    const routes: any = {
      totalApplicants: `/admin/kushal-khiladi/kushal/card-details/total/${params?.tilesType}/${params.sportsId}/${params.subSportsId}`,
      totalScrutiny: `/admin/kushal-khiladi/kushal/card-details/scrutinized/${params?.tilesType}/${params.sportsId}/${params.subSportsId}`,
      foundFit: `/admin/kushal-khiladi/kushal/card-details/Accepted/${params?.tilesType}/${params.sportsId}/${params.subSportsId}`,
      foundUnfit: `/admin/kushal-khiladi/kushal/card-details/Rejected/${params?.tilesType}/${params.sportsId}/${params.subSportsId}`,
      pendingScrutinyCount: `/admin/kushal-khiladi/kushal/card-details/Pending/${params?.tilesType}/${params.sportsId}/${params.subSportsId}`,
      pendingCount: `/admin/kushal-khiladi/kushal/card-details/Pending/${params?.tilesType}/${params.sportsId}/${params.subSportsId}`,
      pendingDvCandidates: `/admin/kushal-khiladi/kushal/card-details/Pending/${params?.tilesType}/${params.sportsId}/${params.subSportsId}`,
      admitCardReleased: `/admin/kushal-khiladi/kushal/card-details/Released/${params?.tilesType}/${params.sportsId}/${params.subSportsId}`,
      totalDuplicate: `/admin/kushal-khiladi/kushal/card-details/total/${params?.tilesType}/${params.sportsId}/${params.subSportsId}/duplicate`,
      sportsName: `/admin/kushal-khiladi/kushal-all-exams/sub-sports/categories/${params.sportsId}/${params.subSportsId}`,
    };

    return routes[key] || "#";
  };

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key, index: number) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "srNo":
          return <p className="text-bold text-sm capitalize">{index + 1}</p>;
        case "sportsName":
          return (
            <div>
              {item?.isHaveSubsports ? (
                <Link
                  href={routeDecider(columnKey, {
                    sportsId: sportsId,
                    subSportsId: item?._id,
                    tilesType: selectedTile,
                  })}
                  className={`text-bold text-sm capitalize ${cellValue != 0 && `text-blue-600`}`}
                >
                  {cellValue}
                </Link>
              ) : (
                <p className="text-nowrap">{cellValue}</p>
              )}
            </div>
          );
        case "advertisementName":
        case "totalApplicants":
        case "totalScrutiny":
        case "foundUnfit":
        case "foundFit":
        case "pendingScrutinyCount":
        case "pendingCount":
        case "totalDuplicate":
        case "pendingDvCandidates":
        case "admitCardReleased":
          return (
            <Link
              href={routeDecider(columnKey, {
                sportsId: sportsId,
                subSportsId: item?._id,
                tilesType: selectedTile,
              })}
              className={`text-bold text-sm capitalize ${cellValue != 0 && `text-blue-600`}`}
            >
              {cellValue}
            </Link>
          );
        case "startDate":
        case "endDate":
          return (
            <p className="text-nowrap">
              {cellValue && moment(cellValue).isValid()
                ? moment(cellValue).format("DD-MM-YYYY")
                : "-"}
            </p>
          );
        case "status":
          return (
            <Chip
              color={statusColorMap[cellValue]}
              variant="flat"
              radius="full"
              size="md"
            >
              {cellValue || `-`}
            </Chip>
          );
        default:
          return <p className="text-nowrap">{cellValue}</p>;
      }
    },
    [selectedTile, subSportsData],
  );

  useEffect(() => {
    if (advertisementId && sportsId && selectedTile) {
      GetSubSportsData();
    }
  }, [advertisementId, selectedFilter]);

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
              {/* {subSportsData?.tilesName} */}
              Sub-Sport Details
            </h1>
            <BackButton />
          </div>
          <div className="mb-3 flex justify-end mob:justify-start">
            <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(
                  `v1/admin/downloadSubSportsDataTilesWiseExcel?advertisementId=${advertisementId}&gender=${selectedFilter?.gender}&sportId=${sportsId}&tilesType=${selectedTile}`,
                  "SportsDetail",
                  setLoader,
                );
              }}
              pdfFunction={() => {
                DownloadKushalPdf(
                  `v1/admin/downloadSubSportsDataTilesWisePdf?advertisementId=${advertisementId}&sportId=${sportsId}&tilesType=${selectedTile}&gender=${selectedFilter?.gender}`,
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
            className="mb-6 overflow-x-auto"
            aria-label="Example static collection table"
            topContent={
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <p className="mb-2 font-medium">Filters</p>
                  <MaleFemaleButton
                    selectedBtn={subSportsData?.gender}
                    filterFunction={setSelectedFilter}
                  />
                </div>
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
            <TableBody emptyContent="No data">
              {subSportsData?.sportsData?.map((item: any, index: number) => (
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

export default SubSportsInfo;
