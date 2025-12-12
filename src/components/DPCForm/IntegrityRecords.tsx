import React from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { useFieldArray, UseFormRegister, Control } from "react-hook-form";

type Props = {
  control: Control<any>;
  register: UseFormRegister<any>;
  watch: any;
  errors: any;
};

const IntegrityRecords: React.FC<Props> = ({
  control,
  register,
  watch,
  errors,
}) => {
  const {
    fields: integrityFields,
    append: appendIntegrity,
    remove: removeIntegrity,
  } = useFieldArray({
    control,
    name: "integrityRecords",
  });

  const certificateOptions = ["प्रमाणित", "अप्रमाणित"];

  return (
    <div className="col-span-2">
      {integrityFields.map((field, index) => (
        <div
          key={field.id}
          className="mb-4 grid grid-cols-2 gap-3 rounded-lg border-2 p-2"
        >
          {/* <Input
            {...register(`integrityRecords.${index}.certificate`, {
              required: "Integrity Certificate is required", 
            })}
            value={watch(`integrityRecords.${index}.certificate`)}
            label="Integrity Certificate. सत्यनिष्ठा प्रमाण-पत्र"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Certificate"
            variant="bordered"
            classNames={{ mainWrapper: "mt-5", inputWrapper: "border-small" }}
            isInvalid={!!errors?.integrityRecords?.[index]?.certificate}
            errorMessage={
              errors?.integrityRecords?.[index]?.certificate?.message
            }
          /> */}
          <Select
            {...register(`integrityRecords.${index}.certificate`, {
              required: "Integrity Certificate is required",
            })}
            label="Integrity Certificate. सत्यनिष्ठा प्रमाण-पत्र"
            fullWidth
            labelPlacement="outside"
            placeholder="Select Certificate"
            variant="bordered"
            classNames={{ mainWrapper: "mt-5", trigger: "border-small" }}
            isInvalid={!!errors?.integrityRecords?.[index]?.certificate}
            errorMessage={
              errors?.integrityRecords?.[index]?.certificate?.message
            }
          >
            {certificateOptions?.map((item, idx) => (
              <SelectItem key={idx} value={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
          <Input
            {...register(`integrityRecords.${index}.dateOfIntimation`, {
              required: "Date of Intimation is required",
            })}
            label="Date of Intimation of Uncertified Integrity. अप्रमाणित सत्यानिष्ठा संसूचित करने का दि0"
            type="date"
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            classNames={{ mainWrapper: "mt-5", inputWrapper: "border-small" }}
            isInvalid={!!errors?.integrityRecords?.[index]?.dateOfIntimation}
            errorMessage={
              errors?.integrityRecords?.[index]?.dateOfIntimation?.message
            }
          />
          <Input
            {...register(
              `integrityRecords.${index}.dateOfReceiptOfRepresentation`,
              {
                required: "Date of Receipt of Representation is required",
              },
            )}
            label="Date of Receipt of Representation/Appeal against Uncertified Integrity. अप्रमाणित सत्यनिष्ठा के विरूद्ध प्रत्यावेदन/अपील प्राप्त होने की तिथि"
            type="date"
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            classNames={{ mainWrapper: "mt-5", inputWrapper: "border-small" }}
            isInvalid={
              !!errors?.integrityRecords?.[index]?.dateOfReceiptOfRepresentation
            }
            errorMessage={
              errors?.integrityRecords?.[index]?.dateOfReceiptOfRepresentation
                ?.message
            }
          />
          <Input
            {...register(
              `integrityRecords.${index}.dateOfDisposalOfRepresentation`,
              {
                required: "Date of Disposal with Result is required",
              },
            )}
            label="Date of Disposal of Representation with Result. प्रत्यावेदन के निस्तारण की तिथि परिणाम सहित"
            type="date"
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            classNames={{ mainWrapper: "mt-5", inputWrapper: "border-small" }}
            isInvalid={
              !!errors?.integrityRecords?.[index]
                ?.dateOfDisposalOfRepresentation
            }
            errorMessage={
              errors?.integrityRecords?.[index]?.dateOfDisposalOfRepresentation
                ?.message
            }
          />

          <div className="col-span-2 flex w-full items-center justify-end gap-3">
            {integrityFields?.length === index + 1 && (
              <Button
                color="primary"
                variant="flat"
                onPress={() =>
                  appendIntegrity({
                    certificate: "",
                    dateOfIntimation: "",
                    dateOfReceiptOfRepresentation: "",
                    dateOfDisposalOfRepresentation: "",
                  })
                }
              >
                Add Integrity Record
              </Button>
            )}
            {integrityFields?.length > 1 && (
              <Button
                color="danger"
                variant="flat"
                onPress={() => removeIntegrity(index)}
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

export default IntegrityRecords;
