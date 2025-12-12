"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, CardFooter, Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";
import StepProgressBar from "@/components/AdhiyaachanAdmitCard/stepbar";
import { AdmitCardList } from "@/components/AdhiyaachanAdmitCard/stepper/formsteps";
import FlatCard from "@/components/FlatCard";
import {
  CallAddScheduleForExam,
  CallAutoGenAdmitCard,
  CallUploadAdmitCardExcel,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";

export default function Admitcard() {
  const [completedStep, setCompletedStep] = useState<number>(0);
  const [currentCompIdx, setCurrentCompIdx] = useState<number>(0);
  const [finalSubmit, setFinalSubmit] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [profileFile, setProfileFile] = useState<any>(null);
  const router = useRouter();

  const formMethods = useForm<any>({
    defaultValues: {
      advertisementId: "",
      masterDataIds: [],
      schedules: [],
    },
    mode: "onChange",
  });
  const { watch } = formMethods;
  const SIDE_LIST = AdmitCardList(formMethods, setProfileFile);
  const current_component = SIDE_LIST[currentCompIdx];
  const currentFormData: string = current_component?.apiPropsRelation;
  const {
    handleSubmit,
    reset,
    getValues,
    formState: { isValid },
  } = formMethods;

  const nextStep = async () => {
    setCurrentCompIdx(currentCompIdx + 1);
    setCompletedStep(currentCompIdx + 1);
  };

  const preStep = () => {
    setCurrentCompIdx(currentCompIdx - 1);
    setCompletedStep(currentCompIdx - 1);
  };

  const nextSave = async (data: any) => {
    setIsNextLoading(true);
    try {
      const { data: response, error } = (await CallAddScheduleForExam(
        data,
      )) as any;
      console.log("response", { response, error });
      if (response?.status_code === 200) {
        toast.success(response?.message);
        nextStep();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsNextLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setFinalSubmit(true);
    try {
      if (profileFile) {
        //menual Generate Admit Card
        const formData = new FormData();
        formData.append("excel", profileFile);
        formData.append("advertisementId", data?.advertisementId);
        formData.append("masterDataIds", data?.masterDataIds);
        const responseData = (await CallUploadAdmitCardExcel(formData)) as any;
        console.log("CallUploadAdmitCardExcel", responseData);
        if (responseData?.data) {
          toast.success(responseData?.data?.message);
          reset();
          setCurrentCompIdx(0);
          setCompletedStep(0);
          setProfileFile(null);
          router.push("/admin/screening-admitCard/admit-card/all-admit-card");
          return;
        }
        if (responseData?.error) {
          handleCommonErrors(responseData?.error);
          return;
        }
      }

      //auto Generate Admit Card data
      const { data: response, error } = (await CallAutoGenAdmitCard(
        data,
      )) as any;
      console.log("CallAutoGenAdmitCard", { response, error });
      if (response?.status === 200) {
        toast.success(response?.message);
        reset();
        setCurrentCompIdx(0);
        setCompletedStep(0);
        router.push("/admin/screening-admitCard/admit-card/all-admit-card");
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      handleCommonErrors(error);
    } finally {
      setFinalSubmit(false);
    }
  };
  console.log(watch());

  return (
    <FlatCard>
      <Suspense
        fallback={
          <div className="text-center">
            <Spinner />
          </div>
        }
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl">Create Admit Card</h1>
          {/* <Button
            href="/admin"
            as={Link}
            color="default"
            variant="solid"
            size="sm"
            startContent={
              <i className="material-symbols-outlined">keyboard_backspace</i>
            }
          >
            Go Back
          </Button> */}
        </div>

        <div className="m-10">
          <StepProgressBar
            items={SIDE_LIST}
            currentStep={currentCompIdx}
            completedStep={completedStep}
          />
        </div>

        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        {current_component?.component}
        <div className="flex justify-end gap-4">
          {currentCompIdx > 0 && (
            <Button
              type="button"
              variant="solid"
              color="default"
              size="sm"
              className="w-32"
              onPress={preStep}
            >
              Back
            </Button>
          )}
          {currentCompIdx < SIDE_LIST.length - 1 ? (
            <Button
              className="w-32"
              type="button"
              variant="solid"
              color="primary"
              size="sm"
              isLoading={isNextLoading}
              onPress={() => {
                handleSubmit((data) => {
                  nextSave(data);
                })();
              }}
              // onPress={nextStep}
            >
              Next
            </Button>
          ) : (
            <Button
              className="w-32"
              type="button"
              variant="solid"
              color="primary"
              isLoading={finalSubmit}
              size="sm"
              onPress={() => handleSubmit(onSubmit)()}
            >
              Submit
            </Button>
          )}
        </div>
        {/* </form> */}
      </Suspense>
    </FlatCard>
  );
}
