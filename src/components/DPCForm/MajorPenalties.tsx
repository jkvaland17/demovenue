import React from "react";
import { Input, Button } from "@nextui-org/react";
import { useFieldArray, UseFormRegister, Control } from "react-hook-form";

type Props = {
  control: Control<any>;
  register: UseFormRegister<any>;
  watch: any;
  errors: any;
};

const MajorPenalties: React.FC<Props> = ({
  control,
  register,
  watch,
  errors,
}) => {
  const {
    fields: majorPenaltyFields,
    append: appendMajorPenalty,
    remove: removeMajorPenalty,
  } = useFieldArray({
    control,
    name: "majorPenalties",
  });

  return (
    <div className="col-span-2">
      {majorPenaltyFields.map((field, index) => (
        <div
          key={field.id}
          className="mb-4 grid grid-cols-2 gap-4 rounded-lg border p-4"
        >
          <Input
            {...register(`majorPenalties.${index}.orderNumber`, {
              required: "Order Number is required",
            })}
            label="Order Number of Punishment. दण्डादेश की सं०"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Order Number"
            variant="bordered"
            isInvalid={!!errors.majorPenalties?.[index]?.orderNumber}
            errorMessage={
              errors.majorPenalties?.[index]?.orderNumber?.message as string
            }
            classNames={{ mainWrapper: "mt-5", inputWrapper: "border-small" }}
          />
          <Input
            {...register(`majorPenalties.${index}.dateOfPunishment`, {
              required: "Date of Punishment Order is required",
            })}
            label="Date of Punishment Order. दण्डादेश का दि0 "
            type="date"
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            isInvalid={!!errors.majorPenalties?.[index]?.dateOfPunishment}
            errorMessage={
              errors.majorPenalties?.[index]?.dateOfPunishment
                ?.message as string
            }
            classNames={{ mainWrapper: "mt-5", inputWrapper: "border-small" }}
          />
          <Input
            {...register(`majorPenalties.${index}.dateOfIntimation`, {
              required: "Date of Intimation of Punishment Order is required",
            })}
            label="Date of Intimation of Punishment Order. दण्डादेश संसूचित करने का दिनांक"
            type="date"
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            isInvalid={!!errors.majorPenalties?.[index]?.dateOfIntimation}
            errorMessage={
              errors.majorPenalties?.[index]?.dateOfIntimation
                ?.message as string
            }
            classNames={{ mainWrapper: "mt-12", inputWrapper: "border-small" }}
          />
          <Input
            {...register(`majorPenalties.${index}.natureOfPunishment`, {
              required: "Nature of Punishment is required",
            })}
            label="Nature of Punishment(Dismissal from Service, Removal from Service, Reduction in Rank and Demotion to Lower Pay Scale or Pay Level. दण्ड की प्रकृति (सेवा से पदच्युत, सेवा से हटाना तथा पंक्तिच्युत करना, जिसके अन्तर्गत निम्नतर वेतनमान या समयवेतन मान में निम्न प्रकम पर अवनति"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Nature of Punishment"
            variant="bordered"
            isInvalid={!!errors.majorPenalties?.[index]?.natureOfPunishment}
            errorMessage={
              errors.majorPenalties?.[index]?.natureOfPunishment
                ?.message as string
            }
            classNames={{ mainWrapper: "mt-12", inputWrapper: "border-small" }}
          />
          <div className="col-span-2 flex justify-end gap-3">
            {majorPenaltyFields.length === index + 1 && (
              <Button
                color="primary"
                variant="flat"
                onPress={() =>
                  appendMajorPenalty({
                    orderNumber: "",
                    dateOfPunishment: "",
                    dateOfIntimation: "",
                    natureOfPunishment: "",
                  })
                }
              >
                Add Major Penalty
              </Button>
            )}
            {majorPenaltyFields.length > 1 && (
              <Button
                color="danger"
                variant="flat"
                onPress={() => removeMajorPenalty(index)}
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

export default MajorPenalties;
