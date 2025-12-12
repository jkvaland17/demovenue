import {
  AdhiyaanchanFormValues,
  MasterCode,
} from "@/app/admin/adhiyaachan-advertisement/adhiyaachan-submission/types";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import UseMasterByCodeSelect from "./UseMasterByCodeSelect";

type Props = {
  formMethods: UseFormReturn<AdhiyaanchanFormValues>;
  postDataIndex: number;
  sportIndex: number;
  sportWiseSeats: {
    isHorizontalMaleFemalVacancy: boolean;
    isHorizontalVacancy: boolean;
    isMaleFemaleVacancy: boolean;
    isSportsWiseVacncy: boolean;
  };
  categoryWiseSeats: {
    isCategoryWiseVacancy: boolean;
    isMaleFemaleVacancy: boolean;
    isHorizontalMaleFemalVacancy: boolean;
    isHorizontalVacancy: boolean;
  };
};

const SportHorizontalWiseVacancy: React.FC<Props> = ({
  postDataIndex,
  sportIndex,
  formMethods,
  sportWiseSeats,
  categoryWiseSeats,
}) => {
  const { control, register, watch, setValue } = formMethods;
  const {
    fields: horizontalVacancyFields,
    append: appendHorizontalVacancy,
    remove: removeHorizontalVacancy,
  } = useFieldArray({
    control,
    name: `postData.${postDataIndex}.sports.${sportIndex}.horizontalWiseVacancy`,
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
            appendHorizontalVacancy({
              category: "",
              numberOfVacancy: 0,
              gender: "",
            })
          }
        >
          Add
        </Button>
      </div>
      <div className="flex bg-gray-50 text-sm font-medium text-gray-600">
        {sportWiseSeats?.isHorizontalVacancy ? (
          <div className="flex-1 px-4 py-3 text-center">Category</div>
        ) : null}
        {sportWiseSeats?.isMaleFemaleVacancy ? (
          <div className="flex-1 px-4 py-3 text-center">Gender</div>
        ) : null}
        <div className="flex-1 px-4 py-3 text-center">No of Vacancy</div>
        <div className="flex-1 px-4 py-3 text-center">Actions</div>
      </div>
      {horizontalVacancyFields?.map((field, index) => (
        <div key={field.id} className="flex bg-white">
          <div className="flex-1 px-4 py-3">
            <Controller
              name={`postData.${postDataIndex}.sports.${sportIndex}.horizontalWiseVacancy.${index}.category`}
              control={control}
              rules={{
                required: "Category is required",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <UseMasterByCodeSelect
                  code={MasterCode?.HorizontalCategory}
                  label="Category"
                  placeholder="Select category"
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
          {sportWiseSeats?.isMaleFemaleVacancy && (
            <div className="flex-1 px-4 py-3">
              <Controller
                name={`postData.${postDataIndex}.sports.${sportIndex}.horizontalWiseVacancy.${index}.gender`}
                control={control}
                rules={{
                  required: "Gender is required",
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <UseMasterByCodeSelect
                    code={MasterCode?.Gender}
                    label="Gender"
                    placeholder="Select gender"
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
          <div className="flex-1 px-4 py-3">
            <Controller
              name={`postData.${postDataIndex}.sports.${sportIndex}.horizontalWiseVacancy.${index}.numberOfVacancy`}
              control={control}
              rules={{
                required: "Number of vacancies is required",
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
                  min={0}
                  isInvalid={invalid}
                  errorMessage={error?.message}
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
          <div className="flex-1 px-4 py-3">
            <div className="flex w-full items-center justify-end gap-3">
              {/* {horizontalVacancyFields?.length === index + 1 && (
                <div className="flex justify-end p-3">
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    onPress={() =>
                      appendHorizontalVacancy({
                        category: "",
                        numberOfVacancy: 0,
                      })
                    }
                  >
                    Add
                  </Button>
                </div>
              )} */}
              {horizontalVacancyFields?.length > 0 && (
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  onPress={() => removeHorizontalVacancy(index)}
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

export default SportHorizontalWiseVacancy;
