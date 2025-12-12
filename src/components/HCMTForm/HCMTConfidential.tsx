"use client";

import { Input, Button } from "@nextui-org/react";
import { Controller, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";

interface ConfidentialField {
  year: number;
  Remarks: string;
  id?: string;
}

type Props = {
  errors: any;
  control: any;
  register: any;
  watch: any;
};

const HCMTConfidential: React.FC<Props> = ({ control, errors, watch }) => {
  const maxYear = 2017;
  const { fields, append } = useFieldArray({
    control,
    name: "confidential",
  });

  const handleAddYear = () => {
    const lastIndex = fields?.length - 1;
    const lastFieldValue = watch(`confidential.${lastIndex}.Remarks`);
    if (!lastFieldValue || lastFieldValue?.trim() === "") {
      const lastYear = (fields[lastIndex] as unknown as ConfidentialField)
        ?.year;
      // alert(`Please fill the ${lastYear} input field first`);
      toast.error(`Please fill the ${lastYear} input field first`);
      return;
    }
    const lastItem = fields[lastIndex] as unknown as ConfidentialField;
    if (lastItem && lastItem?.year < maxYear) {
      append({ year: lastItem?.year + 1, Remarks: "" });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {fields?.map((field, index) => {
          const typedField = field as unknown as ConfidentialField;
          return (
            <div key={field.id} className="flex flex-col items-start">
              <label className="mb-1 text-sm font-medium">
                {typedField?.year}
              </label>
              <Controller
                name={`confidential.${index}.Remarks`}
                control={control}
                rules={{ required: "Remark is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="sm"
                    variant="bordered"
                    classNames={{ inputWrapper: "border-small" }}
                    placeholder="Enter Remark"
                    isInvalid={!!errors?.confidential?.[index]?.Remarks}
                    errorMessage={
                      errors?.confidential?.[index]?.Remarks?.message
                    }
                    className="w-full"
                  />
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-start">
        <Button
          color="primary"
          size="sm"
          onPress={handleAddYear}
          disabled={
            fields?.length > 1 &&
            (fields[fields?.length - 1] as unknown as ConfidentialField)
              ?.year === maxYear
          }
        >
          Add Next Year
        </Button>
      </div>
    </div>
  );
};

export default HCMTConfidential;
