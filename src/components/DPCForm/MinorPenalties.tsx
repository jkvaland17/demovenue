import React from "react";
import { Input, Button } from "@nextui-org/react";
import { useFieldArray, UseFormRegister, Control } from "react-hook-form";

type Props = {
  control: Control<any>;
  register: UseFormRegister<any>;
  watch: any;
  errors: any;
};

const MinorPenalties: React.FC<Props> = ({
  control,
  register,
  watch,
  errors,
}) => {
  const {
    fields: minorPenaltyFields,
    append: appendMinorPenalty,
    remove: removeMinorPenalty,
  } = useFieldArray({
    control,
    name: "minorPenalties",
  });

  return (
    <div className="col-span-2">
      {minorPenaltyFields.map((field, index) => (
        <div
          key={field.id}
          className="mb-4 grid grid-cols-2 gap-4 rounded-lg border p-4"
        >
          <Input
            {...register(`minorPenalties.${index}.orderNumber`, {
              required: "Order Number is required",
            })}
            label="Order Number of Punishment. दण्डादेश की सं0"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Order Number"
            variant="bordered"
            isInvalid={!!errors.minorPenalties?.[index]?.orderNumber}
            errorMessage={
              errors.minorPenalties?.[index]?.orderNumber?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />
          <Input
            {...register(`minorPenalties.${index}.dateOfPunishment`, {
              required: "Date of Punishment Order is required",
            })}
            label="Date of Punishment Order. दण्डादेश का दि0"
            type="date"
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            isInvalid={!!errors.minorPenalties?.[index]?.dateOfPunishment}
            errorMessage={
              errors.minorPenalties?.[index]?.dateOfPunishment
                ?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />
          <Input
            {...register(`minorPenalties.${index}.dateOfIntimation`, {
              required: "Date of Intimation of Punishment Order is required",
            })}
            label="Date of Intimation of Punishment Order. दण्डादेश संसूचित करने का दिनांक"
            type="date"
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            isInvalid={!!errors.minorPenalties?.[index]?.dateOfIntimation}
            errorMessage={
              errors.minorPenalties?.[index]?.dateOfIntimation
                ?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />
          <Input
            {...register(`minorPenalties.${index}.natureOfPunishment`, {
              required: "Nature of Punishment is required",
            })}
            label="Nature of Punishment(Censure Entry, Financial Penalty, Withholding of Increment for a Specified Period). दण्ड की प्रकृति (परिनिन्दा प्रविष्टि/ अर्थदण्ड/अस्थाई रूप से कितनी अवधि के लिए वेतन वृद्धि रोकी गयी है।"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Nature of Punishment"
            variant="bordered"
            isInvalid={!!errors.minorPenalties?.[index]?.natureOfPunishment}
            errorMessage={
              errors.minorPenalties?.[index]?.natureOfPunishment
                ?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />
          <div className="col-span-2 flex justify-end gap-3">
            {minorPenaltyFields.length === index + 1 && (
              <Button
                color="primary"
                variant="flat"
                onPress={() =>
                  appendMinorPenalty({
                    orderNumber: "",
                    dateOfPunishment: "",
                    dateOfIntimation: "",
                    natureOfPunishment: "",
                  })
                }
              >
                Add Minor Penalty
              </Button>
            )}
            {minorPenaltyFields.length > 1 && (
              <Button
                color="danger"
                variant="flat"
                onPress={() => removeMinorPenalty(index)}
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

export default MinorPenalties;
