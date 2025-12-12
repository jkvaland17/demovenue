import React from "react";
import { Input, Button } from "@nextui-org/react";
import { useFieldArray, Control, UseFormRegister } from "react-hook-form";

type Props = {
  control: Control<any>;
  register: UseFormRegister<any>;
  watch: any;
  errors: any;
};

const PendingCriminalCases: React.FC<Props> = ({
  control,
  register,
  errors,
}) => {
  const {
    fields: criminalCaseFields,
    append: appendCriminalCase,
    remove: removeCriminalCase,
  } = useFieldArray({
    control,
    name: "pendingCriminalCases",
  });

  return (
    <div className="col-span-2">
      {criminalCaseFields.map((field, index) => (
        <div
          key={field.id}
          className="mb-4 grid grid-cols-2 gap-4 rounded-lg border p-4"
        >
          <Input
            {...register(`pendingCriminalCases.${index}.caseNumber`, {
              required: "Case Number is required",
            })}
            label="Case Number/Section/Year/Police Station/District. अपराध सं0/धारा/वर्ष/थाना/जनपद"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Case Number"
            variant="bordered"
            isInvalid={!!errors.pendingCriminalCases?.[index]?.caseNumber}
            errorMessage={
              errors.pendingCriminalCases?.[index]?.caseNumber
                ?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />

          <Input
            {...register(`pendingCriminalCases.${index}.chargeSheetWithDate`, {
              required: "Charge Sheet info is required",
            })}
            label="Charge Sheet Number and Date of Filing in Court. आरोप पत्र संख्या व न्यायालय में आरोप पत्र प्रेषित किये जाने का दि0"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Charge Sheet Info"
            variant="bordered"
            isInvalid={
              !!errors.pendingCriminalCases?.[index]?.chargeSheetWithDate
            }
            errorMessage={
              errors.pendingCriminalCases?.[index]?.chargeSheetWithDate
                ?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />

          <Input
            {...register(`pendingCriminalCases.${index}.currentCaseStatus`, {
              required: "Current Case Status is required",
            })}
            label="Current Status of the Case, Court Decision, and Date. अभियोग की अद्वतन स्थिति एवं न्यायालय का निर्णय व दिनांक"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Current Status"
            variant="bordered"
            isInvalid={
              !!errors.pendingCriminalCases?.[index]?.currentCaseStatus
            }
            errorMessage={
              errors.pendingCriminalCases?.[index]?.currentCaseStatus
                ?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />

          <div className="col-span-2 flex justify-end gap-3">
            {criminalCaseFields.length > 1 && (
              <Button
                color="danger"
                variant="flat"
                onPress={() => removeCriminalCase(index)}
              >
                Remove
              </Button>
            )}
            {criminalCaseFields.length === index + 1 && (
              <Button
                color="primary"
                variant="flat"
                onPress={() =>
                  appendCriminalCase({
                    caseNumber: "",
                    chargeSheetWithDate: "",
                    currentCaseStatus: "",
                  })
                }
              >
                Add Criminal Case
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingCriminalCases;
