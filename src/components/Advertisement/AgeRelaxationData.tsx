import {
  AdhiyaanchanFormValues,
  MasterCode,
} from "@/app/admin/adhiyaachan-advertisement/adhiyaachan-submission/types";
import { Button, Input } from "@nextui-org/react";
import React from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import UseMasterByCodeSelect from "../Adhiyaachan/UseMasterByCodeSelect";

type Props = {
  formMethods: any;
};

const AgeRelaxationData: React.FC<Props> = ({ formMethods }) => {
  const { control, register, watch, setValue } = formMethods;

  const {
    fields: ageRelaxationFields,
    append: appendAgeRelaxation,
    remove: removeAgeRelaxation,
  } = useFieldArray({
    control,
    name: "ageRelaxation",
  });
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800"></h3>
        <Button
          color="primary"
          variant="flat"
          size="sm"
          onPress={() =>
            appendAgeRelaxation({
              category: "",
              age: "",
            })
          }
        >
          Add Age Relaxation
        </Button>
      </div>
      <div className="flex bg-gray-50 text-sm font-medium text-gray-600">
        <div className="flex-1 px-4 py-3 text-center">Category</div>
        <div className="flex-1 px-4 py-3 text-center">
          Age Relaxation (Year)
        </div>
        <div className="flex-1 px-4 py-3 text-center">Action</div>
      </div>
      {ageRelaxationFields?.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No Data</p>
      )}

      {ageRelaxationFields?.map((field, index) => (
        <div key={field.id} className="overflow-hidden rounded-lg">
          <div className="flex bg-white">
            <div className="flex-1 px-4 py-3">
              <Controller
                name={`ageRelaxation.${index}.category`}
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
            <div className="flex-1 px-4 py-3">
              <Controller
                name={`ageRelaxation.${index}.age`}
                control={control}
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
            <div className="flex flex-1 items-center justify-center px-4 py-3">
              {ageRelaxationFields?.length > 0 && (
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => removeAgeRelaxation(index)}
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

export default AgeRelaxationData;
