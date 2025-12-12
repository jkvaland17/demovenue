import React from "react";
import { Input, Button } from "@nextui-org/react";
import { useFieldArray, UseFormRegister, Control } from "react-hook-form";

type Props = {
  control: Control<any>;
  register: UseFormRegister<any>;
  watch: any;
  errors: any;
};

const SuspensionStatus: React.FC<Props> = ({ control, register, errors }) => {
  const {
    fields: suspensionFields,
    append: appendSuspension,
    remove: removeSuspension,
  } = useFieldArray({
    control,
    name: "suspensionStatus",
  });

  return (
    <div className="col-span-2">
      {suspensionFields.map((field, index) => (
        <div
          key={field.id}
          className="mb-4 grid grid-cols-3 gap-4 rounded-lg border p-4"
        >
          <Input
            {...register(`suspensionStatus.${index}.orderNumber`, {
              required: "Order Number is required",
            })}
            label="Suspension Order Number, Date. निलम्बन आदेश संख्या, दिनांक"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Order Number"
            variant="bordered"
            isInvalid={!!errors.suspensionStatus?.[index]?.orderNumber}
            errorMessage={
              errors.suspensionStatus?.[index]?.orderNumber?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />

          <Input
            {...register(`suspensionStatus.${index}.reasonOfSuspense`, {
              required: "Reason is required",
            })}
            label="Reason for Suspension - Maximum 20 Words. निलम्बन का कारण (अधिकतम 20 शब्दों में)"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Reason"
            variant="bordered"
            isInvalid={!!errors.suspensionStatus?.[index]?.reasonOfSuspense}
            errorMessage={
              errors.suspensionStatus?.[index]?.reasonOfSuspense
                ?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />

          <Input
            {...register(`suspensionStatus.${index}.orderNumberDate`, {
              required: "Reinstatement Date is required",
            })}
            label="Reinstatement Order Number, Date. बहाली आदेश संख्या, दिनांक"
            type="date"
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            isInvalid={!!errors.suspensionStatus?.[index]?.orderNumberDate}
            errorMessage={
              errors.suspensionStatus?.[index]?.orderNumberDate
                ?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />

          <div className="col-span-3 flex justify-end gap-3">
            {suspensionFields.length > 1 && (
              <Button
                color="danger"
                variant="flat"
                onPress={() => removeSuspension(index)}
              >
                Remove
              </Button>
            )}
            {suspensionFields.length === index + 1 && (
              <Button
                color="primary"
                variant="flat"
                onPress={() =>
                  appendSuspension({
                    orderNumber: "",
                    reasonOfSuspense: "",
                    orderNumberDate: "",
                  })
                }
              >
                Add Suspension
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuspensionStatus;
