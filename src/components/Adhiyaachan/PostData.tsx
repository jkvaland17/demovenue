import {
  CallGetAllGenderPost,
  CallGetAllMasterCader,
  CallGetAllMasterCourses,
  CallGetAllMasterPost,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React, { useEffect, useState } from "react";
import { useFieldArray, Controller, UseFormReturn } from "react-hook-form";
import CustomCheckbox from "@/components/CustomCheckbox";
import SportData from "@/components/Adhiyaachan/SportData";
import HorizontalWiseVacancy from "@/components/Adhiyaachan/HorizontalWiseVacancy";
import {
  type PostData,
  type AdhiyaanchanFormValues,
  type CategoryWiseSeatsType,
  type SportWiseSeatsType,
  MasterCode,
} from "@/app/admin/adhiyaachan-advertisement/adhiyaachan-submission/types";
import SeatDetailsCategory from "@/components/Adhiyaachan/SeatDetailsCategory";
import UseMasterByCodeSelect from "./UseMasterByCodeSelect";
import AgeRelaxationData from "./AgeRelaxationData";

const defaultSportWiseSeats: SportWiseSeatsType = {
  isHorizontalMaleFemalVacancy: false,
  isHorizontalVacancy: false,
  isMaleFemaleVacancy: false,
  isSportsWiseVacncy: false,
};

const defaultCategoryWiseSeats: CategoryWiseSeatsType = {
  isCategoryWiseVacancy: false,
  isMaleFemaleVacancy: false,
  isHorizontalMaleFemalVacancy: false,
  isHorizontalVacancy: false,
};

type Props = {
  formMethods: UseFormReturn<AdhiyaanchanFormValues>;
};

const defaultPostData: PostData = {
  post: "",
  cadre: "",
  payScale: "",
  groupClassification: "",
  recruitmentYear: "",
  pensionable: false,
  typingTest: false,
  pst: false,
  writtenExamAndInterview: false,
  onlyWrittenExam: false,
  onlyInterview: false,
  qualification: "",
  gender: "",
  course: "",
  isSportsWiseCategory: false,
  isHorizontalCategoryWise: false,
  horizontalWiseVacancy: [],
  ageRelaxation: [
    {
      category: "",
      age: "",
      gender: "",
    },
  ],
  seatDetailsCategoryWise: [
    {
      category: "",
      numberOfVacancy: 0,
      gender: "",
    },
  ],
  professionalEducation: {
    isPGDCARequired: false,
    isOLevelRequired: false,
    isBCertificateRequired: false,
    isNationArmyRequired: false,
  },
  minimumMaleAge: "",
  maximumMaleAge: "",
  minimumFeMaleAge: "",
  maximumFeMaleAge: "",
  sports: [],
  categoryWiseSeats: {
    isMaleFemaleVacancy: false,
    isHorizontalVacancy: false,
    isCategoryWiseVacancy: false,
    isHorizontalMaleFemalVacancy: false,
  },
  sportWiseSeats: {
    isHorizontalMaleFemalVacancy: false,
    isHorizontalVacancy: false,
    isMaleFemaleVacancy: false,
    isSportsWiseVacncy: false,
  },
};

const PostData: React.FC<Props> = ({ formMethods }) => {
  const { control, register, watch, setValue } = formMethods;
  const {
    fields: postDataFields,
    append: appendPostData,
    remove: removePostData,
  } = useFieldArray({
    control,
    name: "postData",
  });
  const [course, setCourse] = useState<any[]>([]);

  const getAllCourse = async (): Promise<void> => {
    try {
      const { data, error } = (await CallGetAllMasterCourses()) as any;
      if (error) {
        handleCommonErrors(error);
      }
      if (data) {
        setCourse(data);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
    }
  };

  const formdata = watch();
  useEffect(() => {
    getAllCourse();
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">Post Data</h3>
        <Button
          color="primary"
          variant="flat"
          size="sm"
          onPress={() => appendPostData(defaultPostData)}
        >
          Add Post Data
        </Button>
      </div>

      {postDataFields?.map((field, index) => (
        <div
          key={field.id}
          className="mb-6 rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name={`postData.${index}.course`}
              control={control}
              rules={{ required: "Please select a course" }}
              render={({
                field: { value, onChange },
                fieldState: { error, invalid },
              }) => (
                <UseMasterByCodeSelect
                  code={MasterCode?.Course}
                  label="Course"
                  placeholder="Select Course"
                  labelPlacement="outside"
                  size="md"
                  multiple="single"
                  value={value}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  onChange={(e) => {
                    const selectedCourse = course?.find(
                      (item) => item?._id === e,
                    );
                    setValue(
                      `postData.${index}.categoryWiseSeats`,
                      selectedCourse?.categoryWiseSeats,
                    );
                    setValue(
                      `postData.${index}.sportWiseSeats`,
                      selectedCourse?.sportWiseSeats,
                    );
                    setValue(`postData.${index}.isSportsWiseCategory`, false);
                    setValue(
                      `postData.${index}.isHorizontalCategoryWise`,
                      false,
                    );
                    setValue(`postData.${index}.sports`, []);
                    onChange(e);
                  }}
                />
              )}
            />

            <Controller
              name={`postData.${index}.cadre`}
              control={control}
              rules={{
                required: "Please select a Cadre",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <UseMasterByCodeSelect
                  code={MasterCode?.Cader}
                  label="Cadre"
                  placeholder="Select Cadre"
                  labelPlacement="outside"
                  size="md"
                  multiple="single"
                  value={value}
                  onChange={(selected) => onChange(selected)}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              name={`postData.${index}.post`}
              control={control}
              rules={{
                required: "Please select a Post",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <UseMasterByCodeSelect
                  code={MasterCode?.Post}
                  label="Post"
                  placeholder="Select Post"
                  labelPlacement="outside"
                  size="md"
                  multiple="single"
                  value={value}
                  onChange={(selected) => onChange(selected)}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
          </div>

          <div className="mt-4 flex gap-4">
            <Controller
              name={`postData.${index}.qualification`}
              control={control}
              rules={{
                required: "Please select a qualification",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <UseMasterByCodeSelect
                  code={MasterCode?.Education}
                  label="Minimum Qualification"
                  placeholder="Select qualification"
                  labelPlacement="outside"
                  size="md"
                  multiple="single"
                  value={value}
                  onChange={(selected) => onChange(selected)}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              name={`postData.${index}.payScale`}
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <Input
                  type="text"
                  label="Pay Scale. वेतनमान"
                  labelPlacement="outside"
                  placeholder="Enter pay scale"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                  value={value}
                  onValueChange={onChange}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              name={`postData.${index}.groupClassification`}
              control={control}
              rules={{
                required: "Please select a Group Classification of Posts",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <UseMasterByCodeSelect
                  code={MasterCode?.GroupClassification}
                  label="Group Classification of Posts (Grade Pay)"
                  placeholder="Select Group Classification"
                  labelPlacement="outside"
                  size="md"
                  multiple="single"
                  value={value}
                  onChange={(selected) => onChange(selected)}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
          </div>

          <div className="mt-4 flex gap-4">
            <Controller
              name={`postData.${index}.recruitmentYear`}
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <Input
                  type="date"
                  label="Recruitment Year. भर्ती वर्ष"
                  labelPlacement="outside"
                  placeholder="Enter pay scale"
                  value={value}
                  onValueChange={onChange}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
          </div>

          {/* Professional Education Details Section */}
          <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-4 text-lg font-medium text-gray-800">
              Professional Education Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <label className="flex-1 cursor-pointer text-sm text-black">
                  Is PGDCA Required?
                </label>
                <input
                  {...register(
                    `postData.${index}.professionalEducation.isPGDCARequired`,
                  )}
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded border-2 border-gray-200 bg-transparent"
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <label className="flex-1 cursor-pointer text-sm text-black">
                  Is O-Level From DOEACC or NIELIT Required?
                </label>
                <input
                  {...register(
                    `postData.${index}.professionalEducation.isOLevelRequired`,
                  )}
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded border-2 border-gray-200 bg-transparent"
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <label className="flex-1 cursor-pointer text-sm text-black">
                  Is &quot;B&quot; Certificate of national cadet corps Required?
                </label>
                <input
                  {...register(
                    `postData.${index}.professionalEducation.isBCertificateRequired`,
                  )}
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded border-2 border-gray-500 bg-transparent"
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <label className="flex-1 cursor-pointer text-sm text-black">
                  Is Nation Army Required?
                </label>
                <input
                  {...register(
                    `postData.${index}.professionalEducation.isNationArmyRequired`,
                  )}
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded border-2 border-gray-500 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Basis of Selection (As per Service Rules) */}
          <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-4 text-lg font-medium text-gray-800">
              Basis of Selection (As per Service Rules)
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <label className="flex-1 cursor-pointer text-sm text-black">
                  Only Interview?
                </label>
                <input
                  {...register(`postData.${index}.onlyInterview`)}
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded border-2 border-gray-200 bg-transparent"
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <label className="flex-1 cursor-pointer text-sm text-black">
                  Only Written Exam?
                </label>
                <input
                  {...register(`postData.${index}.onlyWrittenExam`)}
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded border-2 border-gray-200 bg-transparent"
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <label className="flex-1 cursor-pointer text-sm text-black">
                  Written Exam and Interview?
                </label>
                <input
                  {...register(`postData.${index}.writtenExamAndInterview`)}
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded border-2 border-gray-500 bg-transparent"
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <label className="flex-1 cursor-pointer text-sm text-black">
                  Physical Standards Test?
                </label>
                <input
                  {...register(`postData.${index}.pst`)}
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded border-2 border-gray-500 bg-transparent"
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <label className="flex-1 cursor-pointer text-sm text-black">
                  Only Typing Test?
                </label>
                <input
                  {...register(`postData.${index}.typingTest`)}
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded border-2 border-gray-200 bg-transparent"
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <label className="flex-1 cursor-pointer text-sm text-black">
                  Will the government provide pension?
                </label>
                <input
                  {...register(`postData.${index}.pensionable`)}
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded border-2 border-gray-200 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Age Details Section */}
          <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-4 text-lg font-medium text-gray-800">
              Age Details
            </h3>
            <div className="flex gap-4">
              <Input
                {...register(`postData.${index}.minimumMaleAge`)}
                type="number"
                label="Male Minimum Age. न्यूनतम आयु"
                labelPlacement="outside"
                placeholder="Enter minimum age"
                endContent={
                  <span className="material-symbols-outlined">tag</span>
                }
              />
              <Input
                {...register(`postData.${index}.maximumMaleAge`)}
                type="number"
                label="Male Maximum Age. अधिकतम आयु"
                labelPlacement="outside"
                placeholder="Enter maximum age"
                endContent={
                  <span className="material-symbols-outlined">tag</span>
                }
              />
            </div>
            <div className="mt-5 flex gap-4">
              <Input
                {...register(`postData.${index}.minimumFeMaleAge`)}
                type="number"
                label="Female Minimum Age. न्यूनतम आयु"
                labelPlacement="outside"
                placeholder="Enter minimum age"
                endContent={
                  <span className="material-symbols-outlined">tag</span>
                }
              />
              <Input
                {...register(`postData.${index}.maximumFeMaleAge`)}
                type="number"
                label="Female Maximum Age. अधिकतम आयु"
                labelPlacement="outside"
                placeholder="Enter maximum age"
                endContent={
                  <span className="material-symbols-outlined">tag</span>
                }
              />
            </div>
          </div>

          <AgeRelaxationData formMethods={formMethods} postDataIndex={index} />

          {/* Sports Details */}
          <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-4 text-lg font-medium text-gray-800">
              {watch(`postData.${index}.sportWiseSeats.isSportsWiseVacncy`)
                ? "Sports Details"
                : "Horizontal Details"}
            </h3>
            <div className="flex w-full gap-4">
              {watch(`postData.${index}.sportWiseSeats.isSportsWiseVacncy`) && (
                <div className="flex-1">
                  <Controller
                    control={control}
                    name={`postData.${index}.isSportsWiseCategory`}
                    render={({ field: { onChange, value } }) => (
                      <CustomCheckbox
                        icon="gavel"
                        value={value}
                        onChange={(val) => {
                          onChange(val);
                          if (val) {
                            setValue(`postData.${index}.sports`, []);
                          }
                        }}
                        title="Is Sports Wise Category Enabled?"
                        desc="If checked, sports-wise category will be applied"
                        name="isSportsWiseCategory"
                        isEditAllow={true}
                      />
                    )}
                  />
                </div>
              )}
              {!watch(
                `postData.${index}.sportWiseSeats.isSportsWiseVacncy`,
              ) && (
                <div className="flex-1">
                  <Controller
                    control={control}
                    name={`postData.${index}.isHorizontalCategoryWise`}
                    render={({ field: { onChange, value } }) => (
                      <CustomCheckbox
                        icon="gavel"
                        value={value}
                        onChange={(val) => {
                          onChange(val);
                          if (val) {
                            setValue(`postData.${index}.sports`, []);
                          }
                        }}
                        title="Enable Horizontal Category Wise?"
                        desc="If checked, horizontal category-wise vacancy will be applied"
                        name="isHorizontalCategoryWise"
                        isEditAllow={true}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {formdata?.postData?.[index]?.isSportsWiseCategory ? (
            <SportData
              formMethods={formMethods}
              postDataIndex={index}
              sportWiseSeats={
                watch(`postData.${index}.sportWiseSeats`) ??
                defaultSportWiseSeats
              }
              categoryWiseSeats={
                watch(`postData.${index}.categoryWiseSeats`) ??
                defaultCategoryWiseSeats
              }
            />
          ) : formdata?.postData?.[index]?.course &&
            !formdata?.postData?.[index]?.sportWiseSeats?.isSportsWiseVacncy ? (
            <SeatDetailsCategory
              formMethods={formMethods}
              postDataIndex={index}
              sportWiseSeats={
                watch(`postData.${index}.sportWiseSeats`) ??
                defaultSportWiseSeats
              }
              categoryWiseSeats={
                watch(`postData.${index}.categoryWiseSeats`) ??
                defaultCategoryWiseSeats
              }
            />
          ) : null}

          {formdata?.postData?.[index]?.isHorizontalCategoryWise &&
            watch(
              `postData.${index}.categoryWiseSeats.isHorizontalVacancy`,
            ) && (
              <HorizontalWiseVacancy
                formMethods={formMethods}
                postDataIndex={index}
                sportWiseSeats={
                  watch(`postData.${index}.sportWiseSeats`) ??
                  defaultSportWiseSeats
                }
                categoryWiseSeats={
                  watch(`postData.${index}.categoryWiseSeats`) ??
                  defaultCategoryWiseSeats
                }
              />
            )}

          <div className="mt-5 flex w-full items-center justify-end">
            {postDataFields?.length > 1 && (
              <Button
                color="danger"
                variant="flat"
                size="sm"
                onPress={() => removePostData(index)}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostData;
