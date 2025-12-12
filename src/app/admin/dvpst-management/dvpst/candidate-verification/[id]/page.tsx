"use client";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Select,
  SelectItem,
  Chip,
  Button,
} from "@nextui-org/react";

import FlatCard from "@/components/FlatCard";
import { useEffect, useState } from "react";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  CallFetchDVPSTScreeningDetails,
  CallGetAllDVPSTApplications,
  CallUpdateDVPSTBoardDecision,
} from "@/_ServerActions";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";
import toast from "react-hot-toast";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

export default function CandidateVerification() {
  const { id } = useParams();
  const router = useRouter();
  const [boardDecision, setBoardDecision] = useState<string>("");
  const [applicationDatadata, setApplicationDataData] = useState<any>([]);
  const [showPrintBtn, setShowPrintBtn] = useState<boolean>(false);
  const screeningDetails = applicationDatadata?.userDetail?.userScreeningData;
  const personalDetails = applicationDatadata?.userDetail?.personaldata;
  const [loader, setLoader] = useState<any>({
    page: false,
    boardDecision: false,
  });

  const statusColorMap: { [key: string]: ChipColor } = {
    pending: "warning",
    UNFIT: "danger",
    FIT: "success",
  };

  const fitnessData = [
    { criteria: "Age", status: personalDetails?.Age?.status },
    { criteria: "Category", status: personalDetails?.Category?.status },
    {
      criteria: "Category Certificate Issuing Date",
      status: personalDetails?.CategoryCertificateIssuingDate?.status,
    },
    {
      criteria: "Domicile Certificate Issue date",
      status: personalDetails?.DomicileCertificateIssueDate?.status,
    },
    {
      criteria: "Ex-Serviceman",
      status: personalDetails?.ExServiceman?.status,
    },
    { criteria: "HSC Education Status", status: personalDetails?.HSC?.status },
  ];

  const UserDetails = [
    {
      label: "Application Number",
      value: screeningDetails?.applicationNo,
    },
    {
      label: "Roll No.",
      value: screeningDetails?.admitCardDetails?.rollNo,
    },
    {
      label: "Post Applied For",
      value: screeningDetails?.advertisementDetails?.titleInEnglish,
    },
    {
      label: "DV/PST Date",
      value: moment(screeningDetails?.admitCardDetails?.exam_date).format(
        "DD-MM-YYYY",
      ),
    },
    {
      label: "Venue of DV/PST",
      value: screeningDetails?.admitCardDetails?.center?.school_name,
    },
    { label: "Panel Details", value: "-" },
  ];

  const GetApplicationData = async () => {
    setLoader((prev: any) => ({
      ...prev,
      page: true,
    }));
    try {
      const Params = `applicationId=${id}`;
      const { data, error } = (await CallFetchDVPSTScreeningDetails(
        Params,
      )) as any;
      if (data?.response) {
        setApplicationDataData(data?.response);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        page: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        page: false,
      }));
    }
  };

  const UpdateBoardDecision = async () => {
    setLoader((prev: any) => ({
      ...prev,
      boardDecision: true,
    }));
    try {
      const decisionData = {
        id: id,
        isVerifiedByBoard: boardDecision,
      };
      const { data, error } = (await CallUpdateDVPSTBoardDecision(
        decisionData,
      )) as any;
      console.log("callUpdated Dvpst", data, error);
      if (data?.message) {
        toast.success(data?.message);
        setShowPrintBtn(true);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        boardDecision: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        boardDecision: false,
      }));
    }
  };

  const FinalizedStatus = (status: string) => {
    switch (status) {
      case "Matched":
        return "FIT";
      case "Unmatched":
        return "UNFIT";
      default:
        return "-";
    }
  };

  useEffect(() => {
    if (id) {
      GetApplicationData();
    }
  }, [id]);

  console.log("boardDecision", boardDecision);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">
        Application Details / Document Verification
      </h1>

      <FlatCard>
        <div className="grid md:grid-cols-[200px,1fr]">
          <div className="flex items-start justify-center p-6">
            <div className="relative h-[100px] w-[100px]">
              <Image
                src={
                  applicationDatadata?.userDetail?.userScreeningData?.photoGraph
                }
                alt="Applicant photo"
                fill
                className="rounded-full border object-cover"
                priority
              />
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-2 gap-y-4 p-4 md:grid-cols-2 lg:grid-cols-3">
              {UserDetails.map((item, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-default-500">{item.label}</p>
                  <p className="truncate font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FlatCard>
      <FlatCard>
        <Table
          aria-label="Fitness criteria and status"
          classNames={{
            wrapper: "shadow-none",
            th: "bg-default-100 text-default-800 font-semibold",
          }}
        >
          <TableHeader>
            <TableColumn>Fitness Criteria</TableColumn>
            <TableColumn>Fitness Status</TableColumn>
          </TableHeader>
          <TableBody>
            {fitnessData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.criteria}</TableCell>
                <TableCell>
                  <Chip
                    color={statusColorMap[FinalizedStatus(item.status)]}
                    variant="flat"
                    radius="full"
                    size="md"
                  >
                    {FinalizedStatus(item.status)}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="my-5 flex flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="text-default-500">System Report:</span>
            {/* <Chip
              color={statusColorMap[item?.status]}
              variant="flat"
              radius="full"
              size="md"
            >
              {item?.status}
            </Chip> */}
            <Chip color={"success"} variant="flat" radius="full" size="sm">
              FIT
            </Chip>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-default-500">Board Decision:</span>
            <Select
              placeholder="Select decision"
              className="w-[200px]"
              size="sm"
              items={[
                { key: "fit", value: "FIT" },
                { key: "unfit", value: "UNFIT" },
                { key: "provisionallyFit", value: "PROVISIONALLY FIT" },
                { key: "provisionallyUnfit", value: "PROVISIONALLY UNFIT" },
                { key: "pending", value: "PENDING" },
              ]}
              selectedKeys={[boardDecision]}
              onChange={(e: any) => {
                setBoardDecision(e?.target?.value);
              }}
            >
              {(option: any) => (
                <SelectItem key={option?.key} value={option?.key}>
                  {option?.value}
                </SelectItem>
              )}
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="shadow"
            color="primary"
            onPress={() => {
              showPrintBtn
                ? router.push(`/admin/dvpst-management/dvpst/print-page/${id}`)
                : UpdateBoardDecision();
            }}
            isLoading={loader.boardDecision}
            isDisabled={!boardDecision}
          >
            {showPrintBtn ? "Print" : "Save"}
          </Button>
        </div>
      </FlatCard>
    </div>
  );
}
