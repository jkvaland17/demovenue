import { Input } from "@nextui-org/input";
import { Button, Checkbox } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import {
  AdhiyaanchanFormValues,
  MasterCode,
} from "@/app/admin/adhiyaachan-advertisement/adhiyaachan-submission/types";
import UseMasterByCodeSelect from "./UseMasterByCodeSelect";

type SportWiseSeatsType = {
  isHorizontalMaleFemalVacancy: boolean;
  isHorizontalVacancy: boolean;
  isMaleFemaleVacancy: boolean;
  isSportsWiseVacncy: boolean;
};

type CategoryWiseSeatsType = {
  isCategoryWiseVacancy: boolean;
  isMaleFemaleVacancy: boolean;
  isHorizontalMaleFemalVacancy: boolean;
  isHorizontalVacancy: boolean;
};

type Props = {
  formMethods: UseFormReturn<AdhiyaanchanFormValues>;
  postDataIndex: number;
  sportIndex?: number;
  sportWiseSeats: SportWiseSeatsType;
  categoryWiseSeats: CategoryWiseSeatsType;
};

const HorizontalWiseVacancy: React.FC<Props> = ({
  formMethods,
  postDataIndex = 0,
  categoryWiseSeats,
  sportWiseSeats,
}) => {
  const { control, register, watch, setValue } = formMethods;
  const {
    fields: horizontalDataFields,
    append: appendHorizontalData,
    remove: removeHorizontalData,
  } = useFieldArray({
    control,
    name: `postData.${postDataIndex}.horizontalWiseVacancy`,
  });

  return (
    <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">
          Horizontal Wise Vacancy
        </h3>
        <Button
          color="primary"
          variant="flat"
          size="sm"
          onPress={() =>
            appendHorizontalData({
              category: "",
              numberOfVacancy: 0,
              gender: "",
            })
          }
        >
          Add Horizontal Vacancy
        </Button>
      </div>

      <div className="flex bg-gray-50 text-sm font-medium text-gray-600">
        {categoryWiseSeats?.isHorizontalVacancy ? (
          <div className="flex-1 px-4 py-3 text-center">Category</div>
        ) : null}
        <div className="flex-1 px-4 py-3 text-center">No of Vacancy (%)</div>
        {categoryWiseSeats?.isHorizontalMaleFemalVacancy ? (
          <div className="flex-1 px-4 py-3 text-center">Gender</div>
        ) : null}
        <div className="flex-1 px-4 py-3 text-center">Action</div>
      </div>

      {horizontalDataFields?.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No Data</p>
      )}

      {horizontalDataFields?.map((field, index) => (
        <div key={field.id} className="overflow-hidden rounded-lg">
          <div className="flex bg-white">
            {categoryWiseSeats?.isHorizontalVacancy && (
              <div className="flex-1 px-4 py-3">
                <Controller
                  name={`postData.${postDataIndex}.horizontalWiseVacancy.${index}.category`}
                  control={control}
                  rules={{
                    required: "Please select a category",
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => (
                    <UseMasterByCodeSelect
                      code={MasterCode?.HorizontalCategory}
                      // label="Horizontal Category"
                      placeholder="Select Category"
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
            )}
            <div className="flex-1 px-4 py-3">
              <Controller
                name={`postData.${postDataIndex}.horizontalWiseVacancy.${index}.numberOfVacancy`}
                control={control}
                rules={{
                  required: "Number of vacancy is required",
                  min: {
                    value: 0,
                    message: "Value must be 0 or greater",
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <Input
                    type="number"
                    placeholder="0"
                    size="sm"
                    value={value?.toString() ?? ""}
                    onValueChange={(val) => onChange(Number(val))}
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    min={0}
                    className="mx-auto w-full max-w-[100px]"
                    classNames={{
                      input: "text-center",
                      inputWrapper:
                        "bg-gray-50 border-gray-200 hover:border-gray-300",
                    }}
                  />
                )}
              />
            </div>
            {categoryWiseSeats?.isHorizontalMaleFemalVacancy && (
              <div className="flex-1 px-4 py-3">
                <Controller
                  name={`postData.${postDataIndex}.horizontalWiseVacancy.${index}.gender`}
                  control={control}
                  rules={{
                    required: "Please select a category",
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => (
                    <UseMasterByCodeSelect
                      code={MasterCode?.Gender}
                      label="Gender"
                      placeholder="Select Category"
                      labelPlacement="outside"
                      size="md"
                      variant="bordered"
                      multiple="single"
                      value={value}
                      onChange={(selected) => onChange(selected)}
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      isRequired
                    />
                  )}
                />
              </div>
            )}
            <div className="flex flex-1 items-center justify-center px-4 py-3">
              {horizontalDataFields?.length > 0 && (
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => removeHorizontalData(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HorizontalWiseVacancy;
