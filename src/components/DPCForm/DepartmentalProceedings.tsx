import React from "react";
import { Input, Button } from "@nextui-org/react";
import { useFieldArray, Control, UseFormRegister, FormState } from "react-hook-form";

type Props = {
  control: Control<any>;
  register: UseFormRegister<any>;
  watch: any;
  errors: any;
};

const DepartmentalProceedings: React.FC<Props> = ({
  control,
  register,
  errors,
}) => {
  const {
    fields: deptProceedingFields,
    append: appendDeptProceeding,
    remove: removeDeptProceeding,
  } = useFieldArray({
    control,
    name: "departmentalProceedings",
  });

  return (
    <div className="col-span-2">
      {deptProceedingFields.map((field, index) => (
        <div
          key={field.id}
          className="mb-4 grid grid-cols-2 gap-4 rounded-lg border p-4"
        >
          <Input
            {...register(`departmentalProceedings.${index}.investigatingAgency`, {
              required: "Investigating Agency is required",
            })}
            label="Name of Investigating Agency. जॉच संगठन का नाम"
            labelPlacement="outside"
            fullWidth
            placeholder="Enter Agency"
            variant="bordered"
            isInvalid={!!errors.departmentalProceedings?.[index]?.investigatingAgency}
            errorMessage={
              errors.departmentalProceedings?.[index]?.investigatingAgency?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />

          <Input
            {...register(`departmentalProceedings.${index}.briefAllegations`, {
              required: "Brief Allegation is required",
            })}
            label="Brief Description of Allegation - Maximum 20 Words. आरोप का संक्षिप्त विवरण (अधिकतम 20 शब्दों में)"
            labelPlacement="outside"
            fullWidth
            placeholder="Enter Allegations"
            variant="bordered"
            isInvalid={!!errors.departmentalProceedings?.[index]?.briefAllegations}
            errorMessage={
              errors.departmentalProceedings?.[index]?.briefAllegations?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />

          <Input
            {...register(`departmentalProceedings.${index}.dateOfChargeSheet`, {
              required: "Date of Charge Sheet is required",
            })}
            label="Date of Issuance of Charge Sheet Against the Employee. कार्मिक के विरुद्व आरोप पत्र निर्गत करने का दि0"
            type="date"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            isInvalid={!!errors.departmentalProceedings?.[index]?.dateOfChargeSheet}
            errorMessage={
              errors.departmentalProceedings?.[index]?.dateOfChargeSheet?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />

          <div className="col-span-2 flex justify-end gap-3">
            {deptProceedingFields.length > 1 && (
              <Button
                color="danger"
                variant="flat"
                onPress={() => removeDeptProceeding(index)}
              >
                Remove
              </Button>
            )}
            {deptProceedingFields.length === index + 1 && (
              <Button
                color="primary"
                variant="flat"
                onPress={() =>
                  appendDeptProceeding({
                    investigatingAgency: "",
                    briefAllegations: "",
                    dateOfChargeSheet: "",
                  })
                }
              >
                Add Proceeding
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentalProceedings;
