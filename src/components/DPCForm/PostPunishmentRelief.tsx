import React from "react";
import { Input, Button } from "@nextui-org/react";
import { useFieldArray, UseFormRegister, Control } from "react-hook-form";

type Props = {
  control: Control<any>;
  register: UseFormRegister<any>;
  watch: any;
  errors: any;
};

const PostPunishmentRelief: React.FC<Props> = ({
  control,
  register,
  watch,
  errors,
}) => {
  const {
    fields: reliefFields,
    append: appendRelief,
    remove: removeRelief,
  } = useFieldArray({
    control,
    name: "postPunishmentRelief",
  });

  return (
    <div className="col-span-2">
      {reliefFields.map((field, index) => (
        <div
          key={field.id}
          className="mb-4 grid grid-cols-2 gap-4 rounded-lg border p-4"
        >
          <Input
            {...register(`postPunishmentRelief.${index}.details`, {
              required: "Details are required",
            })}
            value={watch(`postPunishmentRelief.${index}.details`)}
            label="Details of the Selection Years During Which the Concerned Personnel Was Declared Unsuitable. पूर्व में किस-किस चयन वर्ष के सापेक्ष सम्बन्धित कार्मिक को अनुपयुक्त किया गया है।"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Details"
            variant="bordered"
            isInvalid={!!errors.postPunishmentRelief?.[index]?.details}
            errorMessage={
              errors.postPunishmentRelief?.[index]?.details?.message as string
            }
            classNames={{ mainWrapper: "mt-8", inputWrapper: "border-small" }}
          />
          <Input
            {...register(`postPunishmentRelief.${index}.yearOfRelief`, {
              required: "Year of Relief is required",
            })}
            value={watch(`postPunishmentRelief.${index}.yearOfRelief`)}
            label="Year of Relief"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Year"
            variant="bordered"
            isInvalid={!!errors.postPunishmentRelief?.[index]?.yearOfRelief}
            errorMessage={
              errors.postPunishmentRelief?.[index]?.yearOfRelief
                ?.message as string
            }
            classNames={{ mainWrapper: "mt-8", inputWrapper: "border-small" }}
          />
          <div className="col-span-2 flex justify-end gap-3">
            {reliefFields.length === index + 1 && (
              <Button
                color="primary"
                variant="flat"
                onPress={() =>
                  appendRelief({
                    details: "",
                    yearOfRelief: "",
                  })
                }
              >
                Add Relief
              </Button>
            )}
            {reliefFields.length > 1 && (
              <Button
                color="danger"
                variant="flat"
                onPress={() => removeRelief(index)}
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

export default PostPunishmentRelief;
