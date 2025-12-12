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
} from "@nextui-org/react";
import SectionTitle from "@/components/DPCForm/SectionTitle";
import { useParams, useRouter } from "next/navigation";
import {
  CallG2otionList,
  CallSeniorityForPromotionById,
  CallSubmitG2,
  CallUpdatG2Promotion,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import toast from "react-hot-toast";
import Link from "next/link";
import G2BasicForm from "@/components/G2Form/G2BasicForm";
import G2TotalService from "@/components/G2Form/G2TotalService";
import G2Completion from "@/components/G2Form/G2Completion";
import G2Confidential from "@/components/G2Form/G2Confidential";
import G2Penalties from "@/components/G2Form/G2Penalties";
import G2Suspension from "@/components/G2Form/G2Suspension";
import G2CriminalCases from "@/components/G2Form/G2CriminalCases";
import G2DepartmentActions from "@/components/G2Form/G2DepartmentActions";
import G2Allegations from "@/components/G2Form/G2Allegations";

const AddG2Form = () => {
  const [G2Loading, setG2Loading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const { slug } = useParams();
  console.log("slug", slug);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
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
      fatherName: "",
      recruitmentDate: "",
      dateOfJoining: "",
      name: "",
      totalService: {
        years: "",
        months: "",
        days: "",
      },
      educationQualificationYear: "",
      technicalCourseDate: "",
      trainingDetailsDate: "",
      major: [
        {
          count: "",
          date: "",
          incidentDate: "",
        },
      ],
      minor: [
        {
          count: "",
          date: "",
          incidentDate: "",
        },
      ],
      petty: [
        {
          count: "",
          date: "",
          incidentDate: "",
        },
      ],
      integrityWithheld: {
        notificationDate: "",
        appealReceivedDate: "",
        appealResolutionDate: "",
      },
      adverseEntry: {
        notificationDate: "",
        appealReceivedDate: "",
        appealResolutionDate: "",
      },
      suspensionDetails: {
        orderNumber: "",
        date: "",
        reason: "",
      },
      criminalCases: {
        caseNumber: "",
        chargeSheetNumber: "",
        courtDecision: "",
      },
      departmentActions: {
        ruleName: "",
        accusation: "",
        accusationDate: "",
      },
      allegations: "",
      selectionYearConfidentialRemarks: [{ year: 2013, Remarks: "" }],
    },
  });

  useEffect(() => {
    if (slug && slug.length > 0) {
      if (slug.length === 1) {
        getEligibilityData(slug[0]);
      } else if (slug.length === 2 && slug[0] === "edit") {
        setIsEditMode(true);
        getEditAllG2(slug[1]);
      }
    }
  }, [slug]);

  const getEligibilityData = async (id: string) => {
    try {
      const { data, error } = (await CallSeniorityForPromotionById(
        `id=${id}`,
      )) as any;
      if (data?.data) {
        setValue("pnoNumber", data?.data?.pnoNumber);
        setValue("dateOfBirth", data?.data?.dateOfBirth);
        setValue("currentPosting", data?.data?.currentPosting);
        setValue("employeeName", data?.data?.employeeName);
        setValue("fatherName", data?.data?.fatherName);
        setValue("recruitmentDate", data?.data?.recruitmentDate);
        setValue("name", data?.data?.name);
        setValue("dateOfJoining", data?.data?.dateOfJoining);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      handleCommonErrors(error);
    }
  };

  const getEditAllG2 = async (id: string) => {
    try {
      const { data, error } = (await CallG2otionList(id)) as any;
      // Date formatting function
      const formatDateToYYYYMMDD = (isoDate: any) => {
        if (!isoDate) return "";
        return isoDate.split("T")[0];
      };
      // Format penalty data
      const formatPenaltyData = (penalties: any) => {
        if (!penalties || !penalties.length) {
          return [{ count: "", date: "", incidentDate: "" }];
        }
        return penalties.map((penalty: any) => ({
          count: penalty.count || "",
          date: formatDateToYYYYMMDD(penalty.date) || "",
          incidentDate: formatDateToYYYYMMDD(penalty.incidentDate) || "",
        }));
      };
      if (data?.data) {
        // General information
        setValue("pnoNumber", data?.data?.pnoNumber || "");
        setValue("dateOfBirth", formatDateToYYYYMMDD(data?.data?.dateOfBirth) || "");
        setValue("currentPosting", data?.data?.currentPosting || "");
        setValue("employeeName", data?.data?.seniorityPromotionList?.employeeName || data?.data?.employeeName || "");
        setValue("fatherName", data?.data?.fatherName || "");
        setValue("recruitmentDate", formatDateToYYYYMMDD(data?.data?.seniorityPromotionList?.recruitmentDate) || formatDateToYYYYMMDD(data?.data?.recruitmentDate) || "");
        setValue("name", data?.data?.name || "");
        setValue(
          "dateOfJoining",
          formatDateToYYYYMMDD(data?.data?.dateOfJoining) || 
          formatDateToYYYYMMDD(data?.data?.seniorityPromotionList?.recruitmentDate) || 
          ""
        );
        setValue("designation", data?.data?.designation || "");
        
        // Total service
        if (data?.data?.totalService) {
          setValue("totalService.years", data?.data?.totalService?.years?.toString() || "");
          setValue("totalService.months", data?.data?.totalService?.months?.toString() || "");
          setValue("totalService.days", data?.data?.totalService?.days?.toString() || "");
        }

        setValue(
          "educationQualificationYear",
          data?.data?.educationQualificationYear || ""
        );
        setValue("technicalCourseDate", formatDateToYYYYMMDD(data?.data?.technicalCourseDate) || "");
        setValue("trainingDetailsDate", formatDateToYYYYMMDD(data?.data?.trainingDetailsDate) || "");

        // Set array fields (major, minor, petty)
        if (data?.data?.punishments) {
          setValue(
            "major",
            data?.data?.punishments?.major?.length
              ? formatPenaltyData(data.data.punishments.major)
              : [{ count: "", date: "", incidentDate: "" }]
          );
          setValue(
            "minor",
            data?.data?.punishments?.minor?.length
              ? formatPenaltyData(data.data.punishments.minor)
              : [{ count: "", date: "", incidentDate: "" }]
          );
          setValue(
            "petty",
            data?.data?.punishments?.petty?.length
              ? formatPenaltyData(data.data.punishments.petty)
              : [{ count: "", date: "", incidentDate: "" }]
          );
        }

        // Set nested integrityWithheld object
        if (data?.data?.integrityWithheld) {
          setValue(
            "integrityWithheld.notificationDate",
            formatDateToYYYYMMDD(data?.data?.integrityWithheld?.notificationDate) || ""
          );
          setValue(
            "integrityWithheld.appealReceivedDate",
            formatDateToYYYYMMDD(data?.data?.integrityWithheld?.appealReceivedDate) || ""
          );
          setValue(
            "integrityWithheld.appealResolutionDate",
            formatDateToYYYYMMDD(data?.data?.integrityWithheld?.appealResolutionDate) || ""
          );
        }

        // Set nested adverseEntry object
        if (data?.data?.adverseEntry) {
          setValue(
            "adverseEntry.notificationDate",
            formatDateToYYYYMMDD(data?.data?.adverseEntry?.notificationDate) || ""
          );
          setValue(
            "adverseEntry.appealReceivedDate",
            formatDateToYYYYMMDD(data?.data?.adverseEntry?.appealReceivedDate) || ""
          );
          setValue(
            "adverseEntry.appealResolutionDate",
            formatDateToYYYYMMDD(data?.data?.adverseEntry?.appealResolutionDate) || ""
          );
        }

        // Set nested suspensionDetails object
        if (data?.data?.suspensionDetails) {
          setValue(
            "suspensionDetails.orderNumber",
            data?.data?.suspensionDetails?.orderNumber || ""
          );
          setValue(
            "suspensionDetails.date",
            formatDateToYYYYMMDD(data?.data?.suspensionDetails?.date) || ""
          );
          setValue(
            "suspensionDetails.reason",
            data?.data?.suspensionDetails?.reason || ""
          );
        }

        // Set nested criminalCases object
        if (data?.data?.criminalCases) {
          setValue(
            "criminalCases.caseNumber",
            data?.data?.criminalCases?.caseNumber || ""
          );
          setValue(
            "criminalCases.chargeSheetNumber",
            data?.data?.criminalCases?.chargeSheetNumber || ""
          );
          setValue(
            "criminalCases.courtDecision",
            data?.data?.criminalCases?.courtDecision || ""
          );
        }

        // Set nested departmentActions object
        if (data?.data?.departmentActions) {
          setValue(
            "departmentActions.ruleName",
            data?.data?.departmentActions?.ruleName || ""
          );
          setValue(
            "departmentActions.accusation",
            data?.data?.departmentActions?.accusation || ""
          );
          setValue(
            "departmentActions.accusationDate",
            formatDateToYYYYMMDD(data?.data?.departmentActions?.accusationDate) || ""
          );
        }
        setValue("allegations", data?.data?.allegations || "");
        // Set array field selectionYearConfidentialRemarks
        if (data?.data?.selectionYearConfidentialRemarks?.length) {
          setValue(
            "selectionYearConfidentialRemarks",
            data?.data?.selectionYearConfidentialRemarks.map((item: any) => ({
              year: item.year,
              Remarks: item.Remarks || ""
            }))
          );
        } else {
          setValue("selectionYearConfidentialRemarks", [{ year: 2013, Remarks: "" }]);
        }
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (formData: any) => {
    try {
      setG2Loading(true);
      if (isEditMode && slug && slug.length > 1) {
        const payload = {
          id: slug[1],
          ...formData
        };
        const { data, error } = (await CallUpdatG2Promotion(payload)) as any;
        if (data?.status_code === 200) {
          setG2Loading(false);
          toast.success(data?.message);
          router.push("/admin/promotion-management/promotion/board-dpc");
        }
        if (error) {
          handleCommonErrors(error);
          setG2Loading(false);
        }
      } else {
        const { data, error } = (await CallSubmitG2(formData)) as any;
        if (data?.status_code === 200) {
          setG2Loading(false);
          toast.success(data?.message);
          router.push("/admin/promotion-management/promotion/board-dpc");
        }
        if (error) {
          handleCommonErrors(error);
          setG2Loading(false);
        }
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setG2Loading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <h1 className="px-3 text-2xl font-semibold">
            {isEditMode ? "Edit G2 Form" : "G2 Form"}
          </h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <G2BasicForm watch={watch} />
            </div>
            <div className="mb-4">
              <Divider />
            </div>
            <div className="mb-4 grid grid-cols-3 gap-4 rounded-lg border-1 p-5">
              <Input
                {...register(`designation`, {
                  required: "Designation is required",
                })}
                isRequired
                type="text"
                label="पदनाम Designation."
                labelPlacement="outside"
                fullWidth
                placeholder="Enter Designation"
                variant="bordered"
                errorMessage={errors.designation?.message as string}
                classNames={{
                  inputWrapper: "border-small",
                }}
                value={watch("designation")}
              />
            </div>
            <Accordion variant="splitted">
              <AccordionItem
                key="totalService"
                title={
                  <SectionTitle
                    english="Total Service as on 01.07.2023."
                    hindi="दिनांक 01.07.2023 को कुल सेवा"
                  />
                }
              >
                <G2TotalService control={control} errors={errors} />
              </AccordionItem>
              <AccordionItem
                key="medals"
                title={
                  <SectionTitle
                    english=" Completion Date. "
                    hindi="पूर्ण करने का दिनांक"
                  />
                }
              >
                <G2Completion register={register} errors={errors} />
              </AccordionItem>
              <AccordionItem
                key="selectionYearConfidentialRemarks"
                title={
                  <SectionTitle
                    english="Annual Confidential Remarks for the Last 10 Years for Selection Year 2023."
                    hindi="चयन वर्ष 2023 के विगत 10 वर्षों का वार्षिक गोपनीय मन्तव्य"
                  />
                }
              >
                <G2Confidential
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                />
              </AccordionItem>
              <AccordionItem
                key="petty"
                title={
                  <SectionTitle
                    english="Details of Penalties Awarded in the Last 10 Years."
                    hindi="विगत 10 वर्षो में प्रदत्त दण्डों का विवरण"
                  />
                }
              >
                <G2Penalties
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                />
              </AccordionItem>
              <AccordionItem
                key="suspensionDetails"
                title={
                  <SectionTitle
                    english="Current Suspension (Current Status of Suspension, Till the Date of DPC)."
                    hindi="वर्तमान निलम्बन (निलम्बन की वर्तमान स्थिति, डीपीसी के दिनांक तक)"
                  />
                }
              >
                <G2Suspension register={register} />
              </AccordionItem>
              <AccordionItem
                key="criminalCases"
                title={
                  <SectionTitle
                    english="Pending Criminal Cases (Where Charge Sheet Has Been Filed Against the Employee)."
                    hindi="लम्बित आपराधिक प्रकरण (जिसमें कर्मी के विरुद्ध आरोप पत्र प्रेषित किया गया है)"
                  />
                }
              >
                <G2CriminalCases register={register} />
              </AccordionItem>
              <AccordionItem
                key="departmentActions"
                title={
                  <SectionTitle
                    english="Departmental Proceedings - Under Rule 14(1)."
                    hindi="विभागीय कार्यवाही -नियम (14(1) के अन्तर्गत"
                  />
                }
              >
                <G2DepartmentActions register={register} />
              </AccordionItem>
              <AccordionItem
                key="allegations"
                title={
                  <SectionTitle english="Allegations." hindi="अभियुक्ति" />
                }
              >
                <G2Allegations register={register} />
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
                isLoading={G2Loading}
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

export default AddG2Form;