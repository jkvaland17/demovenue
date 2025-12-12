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
  key?: number;
  postDataIndex: number;
  sportWiseSeats: SportWiseSeatsType;
  categoryWiseSeats: CategoryWiseSeatsType;
};

const SeatDetailsCategory: React.FC<Props> = ({
  formMethods,
  postDataIndex,
  categoryWiseSeats,
}) => {
  const { control, register, watch, setValue } = formMethods;
  const {
    fields: seatDetailDataFields,
    append: appendSeatDetailData,
    remove: removeSeatDetailData,
  } = useFieldArray({
    control,
    name: `postData.${postDataIndex}.seatDetailsCategoryWise`,
  });

  return (
    <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">
          Seat Details Category Wise
        </h3>
        <Button
          color="primary"
          variant="flat"
          size="sm"
          onPress={() =>
            appendSeatDetailData({
              category: "",
              numberOfVacancy: 0,
              gender: "",
            })
          }
        >
          Add Seat Details
        </Button>
      </div>

      <div className="flex bg-gray-50 text-sm font-medium text-gray-600">
        {categoryWiseSeats?.isCategoryWiseVacancy ? (
          <div className="flex-1 px-4 py-3 text-center">Category</div>
        ) : null}
        <div className="flex-1 px-4 py-3 text-center">No of Vacancy</div>
        {categoryWiseSeats?.isMaleFemaleVacancy ? (
          <div className="flex-1 px-4 py-3 text-center">Gender</div>
        ) : null}
        <div className="flex-1 px-4 py-3 text-center">Action</div>
      </div>

      {seatDetailDataFields?.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No Data</p>
      )}

      {seatDetailDataFields?.map((field, index) => (
        <div key={field.id} className="overflow-hidden rounded-lg">
          <div className="flex bg-white">
            {categoryWiseSeats?.isCategoryWiseVacancy && (
              <div className="flex-1 px-4 py-3">
                <Controller
                  name={`postData.${postDataIndex}.seatDetailsCategoryWise.${index}.category`}
                  control={control}
                  rules={{
                    required: "Please select a category",
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => (
                    <UseMasterByCodeSelect
                      code={MasterCode?.Categories}
                      // label="Category"
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
                name={`postData.${postDataIndex}.seatDetailsCategoryWise.${index}.numberOfVacancy`}
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
            {categoryWiseSeats?.isMaleFemaleVacancy && (
              <div className="flex-1 px-4 py-3">
                <Controller
                  name={`postData.${postDataIndex}.seatDetailsCategoryWise.${index}.gender`}
                  control={control}
                  rules={{
                    required: "Please select a gender",
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => (
                    <UseMasterByCodeSelect
                      code={MasterCode?.Gender}
                      label="Gender"
                      placeholder="Select Gender"
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
              {seatDetailDataFields?.length > 0 && (
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => removeSeatDetailData(index)}
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

export default SeatDetailsCategory;
