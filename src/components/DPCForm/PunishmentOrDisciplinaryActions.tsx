import React from "react";
import { Input, Button } from "@nextui-org/react";
import { useFieldArray, Control, UseFormRegister, FormState } from "react-hook-form";

type Props = {
  control: Control<any>;
  register: UseFormRegister<any>;
  watch: any;
  errors: any;
};

const PunishmentOrDisciplinaryActions: React.FC<Props> = ({
  control,
  register,
  errors,
}) => {
  const {
    fields: punishmentFields,
    append: appendPunishment,
    remove: removePunishment,
  } = useFieldArray({
    control,
    name: "punishmentOrDisciplinaryActions",
  });

  return (
    <div className="col-span-2">
      {punishmentFields.map((field, index) => (
        <div
          key={field.id}
          className="mb-4 grid grid-cols-2 gap-4 rounded-lg border p-4"
        >
          <Input
            {...register(`punishmentOrDisciplinaryActions.${index}.caseNumber`, {
              required: "Order description is required",
            })}
            label="Brief Description of Order - Maximum 20 Words. आदेश का संक्षिप्त विवरण (अधिकतम 20 शब्दों में)"
            labelPlacement="outside"
            fullWidth
            placeholder="Enter Case Number"
            variant="bordered"
            isInvalid={!!errors.punishmentOrDisciplinaryActions?.[index]?.caseNumber}
            errorMessage={
              errors.punishmentOrDisciplinaryActions?.[index]?.caseNumber?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />

          <Input
            {...register(`punishmentOrDisciplinaryActions.${index}.description`, {
              required: "Description is required",
            })}
            label="Complaint Number and Year, and Date of Issuance of Summons to Accused by the Court. परिवाद संख्या एव वर्ष तथा न्यायालय द्वारा परिवाद में अभियुक्त को सम्मन जारी करने का दिनांक"
            labelPlacement="outside"
            fullWidth
            placeholder="Enter Description"
            variant="bordered"
            isInvalid={!!errors.punishmentOrDisciplinaryActions?.[index]?.description}
            errorMessage={
              errors.punishmentOrDisciplinaryActions?.[index]?.description?.message as string
            }
            classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
          />

          <div className="col-span-2 flex justify-end gap-3">
            {punishmentFields.length > 1 && (
              <Button
                color="danger"
                variant="flat"
                onPress={() => removePunishment(index)}
              >
                Remove
              </Button>
            )}
            {punishmentFields.length === index + 1 && (
              <Button
                color="primary"
                variant="flat"
                onPress={() =>
                  appendPunishment({
                    caseNumber: "",
                    description: "",
                  })
                }
              >
                Add Disciplinary Action
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PunishmentOrDisciplinaryActions;
