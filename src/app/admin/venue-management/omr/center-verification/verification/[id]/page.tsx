"use client";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FlatCard from "@/components/FlatCard";
import { Button, Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Check, CircleAlert } from "lucide-react";
import CenterVerification from "@/components/CenterVerification/CenterVerification";
import ControlRoom from "@/components/CenterVerification/ControlRoom";
import CenttreStaff from "@/components/CenterVerification/CenttreStaff";
import AdditionalDetails from "@/components/CenterVerification/AdditionalDetails";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  CallGetcenterUsersWithSubmitStatus,
  CallGetcenterVerificationParsedFields,
  CallUpdateCenterVerificationOfficers,
} from "@/_ServerActions";
import CardAndTable from "@/components/kushal-components/loader/CardAndTable";

const Verification = () => {
  const { id } = useParams();
  const router = useRouter();

  const { currentAdvertisementID } = useAdvertisement();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<any[]>([]);
  const [parsedFields, setparsedFields] = useState<any[]>([]);
  const [saveUserID, setSaveUserID] = useState<string>("");
  const [centerverificationId, setcenterverificationId] = useState<string>("");
  const [centerVerificationData, setcenterVerificationData] =
    useState<any>(null);
  const [centerName, setcenterName] = useState<string>("");
  // console.log(userName);
  // console.log("saveUserID", saveUserID);

  // yaha pe advertisement aur centreid ja rhi hai but filled data nhi a rha yahi find out krna hai
  const centerVerification = async () => {
    try {
      setIsLoading(true);
      const query = `advertisementId=${currentAdvertisementID}&centerId=${id}`;
      console.log("query:-", query);
      
      const { data, error } = (await CallGetcenterUsersWithSubmitStatus(
        query,
      )) as any;
      setUserName(data?.data);
      console.log("CallGetcenterUsersWithSubmitStatus", { data, error });
      setIsLoading(false);
      if (data?.message === "No users found in center") {
        handleCommonErrors(data?.message);
      }
      if (error) {
        handleCommonErrors(error);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const centerVerificationParsedFields = async () => {
    try {
      const query = `advertisementId=${currentAdvertisementID}&centerId=${id}&userId=${saveUserID}`;
      const { data, error } = (await CallGetcenterVerificationParsedFields(
        query,
      )) as any;
      setparsedFields(data?.data);
      setcenterVerificationData(data?.data || []);
      setcenterverificationId(data?.centerverificationId);
      setcenterName(data?.centerName);
      console.log("CallGetcenterVerificationParsedFields", { data, error });
      setIsLoading(false);
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentAdvertisementID) {
      centerVerification();
    }
    if (saveUserID) {
      centerVerificationParsedFields();
    }
  }, [currentAdvertisementID, saveUserID]);

  const getPhaseData = (phaseKey: string) => {
    return (
      centerVerificationData?.find(
        (phase: any) => phase?.phaseKey === phaseKey,
      ) || {}
    );
  };

  return (
    <div>
      <div className="mb-4 flex justify-between gap-12">
        <h2 className="mb-4 text-xl font-semibold">Center Verification</h2>
        <Button
          radius="full"
          className="font-medium"
          onPress={() => {
            router.back();
          }}
          startContent={
            <span className="material-symbols-rounded">arrow_back</span>
          }
        >
          Go Back
        </Button>
      </div>
      {isLoading ? (
        <div className="rounded-lg border bg-white p-5">
          <CardAndTable
            cardCount={1}
            filterCount={2}
            tableColumns={5}
            tableRows={10}
          />
        </div>
      ) : (
        <FlatCard>
          <Tabs
            aria-label="Center Staff Tabs"
            variant="underlined"
            color="primary"
            selectedKey={saveUserID}
            onSelectionChange={(key) => setSaveUserID(String(key))}
          >
            {userName?.map((item: any) => {
              const displayName = `${item?.user?.name} (${item?.user?.userId})`;
              const Icon = item?.submitted ? Check : CircleAlert;
              const iconColor = item?.submitted ? "#16A34A" : "#F97316";

              return (
                <Tab
                  key={item?.userId}
                  title={
                    <div className="flex items-center space-x-2">
                      <span>{displayName}</span>
                      <Icon color={iconColor} strokeWidth={3} />
                    </div>
                  }
                >
                  <>
                    <FlatCard>
                      <div className="flex flex-col gap-1 px-4 py-3">
                        <h2 className="text-base font-semibold text-black">
                          {displayName}
                        </h2>
                        <p className="text-sm text-blue-500">
                          {item?.user?.role?.title}
                        </p>
                      </div>
                    </FlatCard>
                    <Tabs
                      aria-label="Options"
                      variant="underlined"
                      color="primary"
                    >
                      <Tab key="centerVerification" title="Center Verification">
                        <CenterVerification
                          centerVerificationData={getPhaseData(
                            "center_verification",
                          )}
                          centerverificationId={centerverificationId}
                          centerVerification={centerVerification}
                          centerVerificationParsedFields={
                            centerVerificationParsedFields
                          }
                          centerName={centerName}
                        />
                      </Tab>
                      <Tab
                        key="centerControlRoom"
                        title="Centre Control Room & Biometric Details"
                      >
                        <ControlRoom
                          controlRoomData={getPhaseData("center_control_room")}
                          centerName={centerName}
                        />
                      </Tab>
                      <Tab
                        key="centerStaff"
                        title="Centre Staff for Exam Conduct"
                      >
                        <CenttreStaff
                          staffData={getPhaseData("center_staff")}
                          centerName={centerName}
                        />
                      </Tab>
                      <Tab
                        key="centerStaffAdditional"
                        title="Additional Details"
                      >
                        <AdditionalDetails
                          additionalData={getPhaseData("additional_details")}
                          centerName={centerName}
                        />
                      </Tab>
                    </Tabs>
                  </>
                </Tab>
              );
            })}
          </Tabs>
        </FlatCard>
      )}
    </div>
  );
};

export default Verification;
