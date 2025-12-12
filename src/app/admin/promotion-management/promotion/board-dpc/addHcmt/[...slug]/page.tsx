"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  Divider,
  CardHeader,
  Accordion,
  AccordionItem,
  Input,
  form,
} from "@nextui-org/react";
import SectionTitle from "@/components/DPCForm/SectionTitle";
import { useParams, useRouter } from "next/navigation";
import {
  CallHTCMotionList,
  CallSeniorityForPromotionById,
  CallSubmitHCMT,
  CallUpdateHtcpPromotion,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import toast from "react-hot-toast";
import Link from "next/link";
import Details from "@/components/HCMTForm/Details";
import HCMTBasicForm from "@/components/HCMTForm/HCMTBasicForm";
import HCMTTotalService from "@/components/HCMTForm/HCMTTotalService";
import HCMTAwards from "@/components/HCMTForm/HCMTAwards";
import HCMTConfidential from "@/components/HCMTForm/HCMTConfidential";
import HCMTMedal from "@/components/HCMTForm/HCMTMedal";
import HCMTPenalties from "@/components/HCMTForm/HCMTPenalties";

const AddEligibilityList = () => {
  const [hcmtLodding, setHcmtLodding] = useState(false);
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const { slug } = useParams();

  console.log("slug", slug);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      designation: "",
      homeDistrict: "",
      dateOfAppointment: "",
      pnoNumber: "",
      employeeName: "",
      dateOfBirth: "",
      currentPosting: "",
      ageOnDate: {
        years: "",
        months: "",
        days: "",
      },
      totalServiceOnDate: {
        years: "",
        months: "",
        days: "",
      },
      medals: {
        PresidentPoliceMedal: {
          count: "",
          date: "",
        },
        GovernorCMPoliceMedal: {
          count: "",
          date: "",
        },
        dGPExcellenceServiceAward: {
          count: "",
          date: "",
        },
      },
      status: "",
      awards: [
        {
          awardNumber: "",
          awardDate: "",
        },
      ],
      additionalAwards: [
        {
          awardNumber: "",
          awardDate: "",
        },
      ],
      integritySchema: {
        integrityHoldYear: "",
        adverseEntryYear: "",
      },
      remarks: "",
      departmentalInquiry: "",
      longPunishment: [
        {
          countAndYear: "", //string
          date: "",
          incidentDate: "",
        },
      ],
      minorPunishment: [
        {
          countAndYear: "", //string
          date: "",
          incidentDate: "",
        },
      ],
      pettyPunishment: [
        {
          countAndYear: "", //string
          date: "",
          incidentDate: "",
        },
      ],
      confidential: [{ year: 1998, Remarks: "" }],
    },
  });

  useEffect(() => {
    if (slug && slug.length > 0) {
      if (slug.length === 1) {
        getEligibilityData(slug[0]);
      } else if (slug.length === 2 && slug[0] === "edit") {
        setIsEditMode(true);
        getEditAllHCMT(slug[1]);
      }
    }
  }, [slug]);

  const getEligibilityData = async (id: string) => {
    try {
      const { data, error } = (await CallSeniorityForPromotionById(
        `id=${id}`,
      )) as any;
      // console.log("error::: ", error);
      if (data?.data) {
        setValue("pnoNumber", data?.data?.pnoNumber);
        setValue("dateOfBirth", data?.data?.dateOfBirth);
        setValue("currentPosting", data?.data?.currentPosting);
        setValue("employeeName", data?.data?.employeeName);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEditAllHCMT = async (id: string) => {
    try {
      const { data, error } = (await CallHTCMotionList(id)) as any;
      console.log("CallHTCMotionList", data);

      // Date formatting function
      const formatDateToYYYYMMDD = (isoDate: any) => {
        if (!isoDate) return "";
        return isoDate.split("T")[0];
      };

      if (data?.data) {
        // General information
        setValue("designation", data?.data?.designation || "");
        setValue("homeDistrict", data?.data?.homeDistrict || "");
        setValue(
          "dateOfAppointment",
          formatDateToYYYYMMDD(data?.data?.dateOfAppointment) || "",
        );
        setValue("pnoNumber", data?.data?.pnoNumber || "");
        setValue("employeeName", data?.data?.employeeName || "");
        setValue(
          "dateOfBirth",
          formatDateToYYYYMMDD(data?.data?.dateOfBirth) || "",
        );
        setValue("currentPosting", data?.data?.currentPosting || "");

        // Age on Date
        setValue("ageOnDate", {
          years: data?.data?.ageOnDate?.years?.toString() || "",
          months: data?.data?.ageOnDate?.months?.toString() || "",
          days: data?.data?.ageOnDate?.days?.toString() || "",
        });

        // Total Service on Date
        setValue("totalServiceOnDate", {
          years: data?.data?.totalServiceOnDate?.years?.toString() || "",
          months: data?.data?.totalServiceOnDate?.months?.toString() || "",
          days: data?.data?.totalServiceOnDate?.days?.toString() || "",
        });

        // Medals
        setValue("medals", {
          PresidentPoliceMedal: {
            count:
              data?.data?.medals?.PresidentPoliceMedal?.count?.toString() || "",
            date:
              formatDateToYYYYMMDD(
                data?.data?.medals?.PresidentPoliceMedal?.date,
              ) || "",
          },
          GovernorCMPoliceMedal: {
            count:
              data?.data?.medals?.GovernorCMPoliceMedal?.count?.toString() ||
              "",
            date:
              formatDateToYYYYMMDD(
                data?.data?.medals?.GovernorCMPoliceMedal?.date,
              ) || "",
          },
          dGPExcellenceServiceAward: {
            count:
              data?.data?.medals?.dGPExcellenceServiceAward?.count?.toString() ||
              "",
            date:
              formatDateToYYYYMMDD(
                data?.data?.medals?.dGPExcellenceServiceAward?.date,
              ) || "",
          },
        });

        // Status
        setValue("status", data?.data?.status || "");

        // Awards
        setValue(
          "awards",
          data?.data?.awards?.awards?.length
            ? data?.data?.awards?.awards.map((item: any) => ({
                awardNumber: item?.awardNumber || "",
                awardDate: formatDateToYYYYMMDD(item?.awardDate) || "",
              }))
            : [{ awardNumber: "", awardDate: "" }],
        );

        // Additional Awards
        setValue(
          "additionalAwards",
          data?.data?.awards?.additionalAwards?.length
            ? data.data?.awards?.additionalAwards.map((item: any) => ({
                awardNumber: item?.awardNumber || "",
                awardDate: formatDateToYYYYMMDD(item?.awardDate) || "",
              }))
            : [{ awardNumber: "", awardDate: "" }],
        );

        // Integrity Schema
        setValue("integritySchema", {
          integrityHoldYear:
            data?.data?.punishment?.integrityRecords?.integrityHoldYear || "",
          adverseEntryYear:
            data?.data?.punishment?.integrityRecords?.adverseEntryYear || "",
        });

        // Remarks
        setValue("remarks", data?.data?.remarks || "");

        // Departmental Inquiry
        setValue("departmentalInquiry", data?.data?.departmentalInquiry || "");

        // Long Punishment
        setValue(
          "longPunishment",
          data?.data?.punishment?.longPunishment?.length
            ? data.data.punishment?.longPunishment.map((item: any) => ({
                countAndYear: item?.countAndYear || "",
                date: formatDateToYYYYMMDD(item?.date) || "",
                incidentDate: formatDateToYYYYMMDD(item?.incidentDate) || "",
              }))
            : [{ countAndYear: "", date: "", incidentDate: "" }],
        );

        // Minor Punishment
        setValue(
          "minorPunishment",
          data?.data?.punishment?.minorPunishment?.length
            ? data.data?.punishment?.minorPunishment.map((item: any) => ({
                countAndYear: item?.countAndYear || "",
                date: formatDateToYYYYMMDD(item?.date) || "",
                incidentDate: formatDateToYYYYMMDD(item?.incidentDate) || "",
              }))
            : [{ countAndYear: "", date: "", incidentDate: "" }],
        );

        // Petty Punishment
        setValue(
          "pettyPunishment",
          data?.data?.punishment?.pettyPunishment?.length
            ? data?.data?.punishment?.pettyPunishment?.map((item: any) => ({
                countAndYear: item?.countAndYear || "",
                date: formatDateToYYYYMMDD(item?.date) || "",
                incidentDate: formatDateToYYYYMMDD(item?.incidentDate) || "",
              }))
            : [{ countAndYear: "", date: "", incidentDate: "" }],
        );

        // Confidential
        setValue(
          "confidential",
          data?.data?.selectionYearConfidentialRemarks?.length
            ? data?.data?.selectionYearConfidentialRemarks?.map((item: any) => ({
                year: item?.year?.toString() || "",
                Remarks: item?.Remarks || "",
              }))
            : [{ year: "", Remarks: "" }],
        );
      }

      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (formData: any) => {
    console.log("onSubmit", formData);
    
    try {
      setHcmtLodding(true);
      if (isEditMode && slug && slug.length > 1) {
        const payload = {
          id: slug[1],
          ...formData,
        };
        const { data, error } = (await CallUpdateHtcpPromotion(payload)) as any;
        if (data?.status_code === 200) {
          setHcmtLodding(false);
          toast.success(data?.message);
          router.push("/admin/promotion-management/promotion/board-dpc");
        }
        if (error) {
          handleCommonErrors(error);
          setHcmtLodding(false);
        }
      } else {
        const { data, error } = (await CallSubmitHCMT(formData)) as any;
        if (data?.status_code === 200) {
          setHcmtLodding(false);
          toast.success(data?.message);
          router.push("/admin/promotion-management/promotion/board-dpc");
        }
        if (error) {
          handleCommonErrors(error);
          setHcmtLodding(false);
        }
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setHcmtLodding(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <h1 className="px-3 text-2xl font-semibold">
            {isEditMode ? "Edit HCMT Form" : "HCMT Form"}
          </h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <HCMTBasicForm watch={watch} />
            </div>
            <div className="mb-4">
              <Divider />
            </div>
            <div className="mb-4 grid grid-cols-3 gap-4 rounded-lg border-1 p-5">
              <Input
                {...register(`designation`, {
                  required: "Cash is required",
                })}
                isRequired
                type="test"
                value={watch("designation")}
                label="पदनाम Designation."
                labelPlacement="outside"
                fullWidth
                placeholder="Enter Designation"
                variant="bordered"
                errorMessage={"Cash is required"}
                classNames={{
                  inputWrapper: "border-small",
                }}
              />
              <Input
                {...register(`homeDistrict`, {
                  required: "Cash is required",
                })}
                isRequired
                type="text"
                value={watch("homeDistrict")}
                label="गृह जनपद Home District."
                labelPlacement="outside"
                fullWidth
                placeholder="Enter Home District"
                variant="bordered"
                errorMessage={"Cash is required"}
                classNames={{
                  inputWrapper: "border-small",
                }}
              />
              <Input
                {...register(`dateOfAppointment`, {
                  required: "Cash is required",
                })}
                isRequired
                type="date"
                value={watch("dateOfAppointment")}
                label="भर्ती तिथि Date of Appointment."
                labelPlacement="outside"
                fullWidth
                placeholder="select date"
                variant="bordered"
                errorMessage={"Cash is required"}
                classNames={{
                  inputWrapper: "border-small",
                }}
              />
            </div>
            <Accordion variant="splitted">
              <AccordionItem
                key="ageOnDate"
                aria-label="Accordion 1"
                title={
                  <SectionTitle
                    english="Age as on 01.07.2008. "
                    hindi="दिनांक 01.07.2008 को आयु"
                  />
                }
              >
                <Details
                  control={control}
                  errors={errors}
                  register={register}
                />
              </AccordionItem>
              <AccordionItem
                key="totalServiceOnDate"
                title={
                  <SectionTitle
                    english="Total Service as on 01.07.2008. "
                    hindi=" दिनांक 01.07.2008 को कुल सेवा"
                  />
                }
              >
                <HCMTTotalService control={control} errors={errors} />
              </AccordionItem>
              <AccordionItem
                key="awards"
                title={
                  <SectionTitle
                    english="Awards and Commendations (Good Entries). "
                    hindi="पुरस्कार और सुप्रविष्टि(उत्तम प्रविष्टि)"
                  />
                }
              >
                <HCMTAwards
                  control={control}
                  register={register}
                  errors={errors}
                />
              </AccordionItem>
              <AccordionItem
                key="confidential"
                title={
                  <SectionTitle
                    english="Confidential Remarks for the Last 10 Years for Selection Years 2008 to 2018. "
                    hindi="चयन वर्ष 2008 से 2018 तक के लिए विगत 10 वर्षों का गोपनीय मन्तव्य"
                  />
                }
              >
                <HCMTConfidential
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                />
              </AccordionItem>
              <AccordionItem
                key="medals"
                title={<SectionTitle english="Medals. " hindi="पदक" />}
              >
                <HCMTMedal register={register} errors={errors} />
              </AccordionItem>
              <AccordionItem
                key="detailsPenalties"
                title={
                  <SectionTitle
                    english="Details of Penalties, if any, awarded during the period from 1998 to 2017."
                    hindi=" वर्ष 1998 से 2017 तक की अवधि में यदि कोई दण्ड प्रदान किया गया हो, तो उसका विवरण"
                  />
                }
              >
                <HCMTPenalties
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                />
              </AccordionItem>
            </Accordion>
            <div className="mt-6 flex justify-end gap-5">
              <Button
                color="danger"
                variant="flat"
                as={Link}
                href={"/admin/promotion-management/promotion/board-dpc"}
              >
                Cancel
              </Button>
              <Button
                isLoading={hcmtLodding}
                type="submit"
                color="primary"
                variant="shadow"
                className="w-40"
              >
                {isEditMode ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default AddEligibilityList;
