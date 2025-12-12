import React from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import {
  useFieldArray,
  Control,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import UnsatisfactoryAdverseRemarks from "./UnsatisfactoryAdverseRemarks";

type Props = {
  control: Control<any>;
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  errors: any;
};

const AnnualConfidentialResolution: React.FC<Props> = ({
  control,
  register,
  watch,
  errors,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "annualConfidentialResolution",
  });

  const categoryOptions = [
    "आउट स्टैंडिंग/उत्कृष्ट/सर्वोच्च या सर्वोत्तम",
    "वेरीगुड/बहुत अच्छा/अति उत्तम/एक्सीलेंट",
    "गुड/उत्तम/अच्छा",
    "संतोषजनक/औसत",
  ];

  return (
    <div className="col-span-2 rounded-md border-1 px-2 pt-3">
      {fields.map((item, index) => (
        <div key={item.id} className="mb-4 grid grid-cols-4 gap-4">
          <Input
            {...register(`annualConfidentialResolution.${index}.fromYear`, {
              required: "From Year is required",
            })}
            label="From Year"
            type="date"
            fullWidth
            labelPlacement="outside"
            radius="sm"
            variant="bordered"
            isInvalid={!!errors.annualConfidentialResolution?.[index]?.fromYear}
            errorMessage={
              errors.annualConfidentialResolution?.[index]?.fromYear?.message
            }
            classNames={{ inputWrapper: "border-small" }}
          />
          <Input
            {...register(`annualConfidentialResolution.${index}.toYear`, {
              required: "To Year is required",
            })}
            label="To Year"
            type="date"
            fullWidth
            labelPlacement="outside"
            radius="sm"
            variant="bordered"
            isInvalid={!!errors.annualConfidentialResolution?.[index]?.toYear}
            errorMessage={
              errors.annualConfidentialResolution?.[index]?.toYear?.message
            }
            classNames={{ inputWrapper: "border-small" }}
          />
          {/* <Input
            {...register(
              `annualConfidentialResolution.${index}.categoryOfConfidentialIntent`,
              { required: "Category is required" },
            )}
            label="Category"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Category"
            radius="sm"
            variant="bordered"
            isInvalid={
              !!errors.annualConfidentialResolution?.[index]
                ?.categoryOfConfidentialIntent
            }
            errorMessage={
              errors.annualConfidentialResolution?.[index]
                ?.categoryOfConfidentialIntent?.message
            }
            classNames={{ inputWrapper: "border-small" }}
          /> */}
          <Select
            {...register(
              `annualConfidentialResolution.${index}.categoryOfConfidentialIntent`,
              {
                required: "Category is required",
              },
            )}
            label="Category"
            fullWidth
            labelPlacement="outside"
            placeholder="Select Category"
            radius="sm"
            variant="bordered"
            isInvalid={
              !!errors.annualConfidentialResolution?.[index]
                ?.categoryOfConfidentialIntent
            }
            errorMessage={
              errors.annualConfidentialResolution?.[index]
                ?.categoryOfConfidentialIntent?.message
            }
            classNames={{ trigger: "border-small" }}
          >
            {categoryOptions?.map((item, idx) => (
              <SelectItem key={idx} value={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
          <Input
            {...register(`annualConfidentialResolution.${index}.remarks`, {
              required: "Remarks are required",
            })}
            label="Remarks"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Remarks"
            radius="sm"
            variant="bordered"
            isInvalid={!!errors.annualConfidentialResolution?.[index]?.remarks}
            errorMessage={
              errors.annualConfidentialResolution?.[index]?.remarks?.message
            }
            classNames={{ inputWrapper: "border-small" }}
          />

          <div className="col-span-4">
            <UnsatisfactoryAdverseRemarks
              control={control}
              register={register}
              nestIndex={index}
              errors={errors}
            />
          </div>

          <div className="col-span-4 flex justify-end gap-2">
            {fields?.length === index + 1 && (
              <Button
                size="sm"
                color="primary"
                onClick={() =>
                  append({
                    fromYear: "",
                    toYear: "",
                    categoryOfConfidentialIntent: "",
                    remarks: "",
                    unsatisfactoryAdverseRemarks: [
                      {
                        hasRemarks: "",
                        dateOfIntimation: "",
                        dateOfReceiptOfAppeal: "",
                        dateOfDisposalWithResult: "",
                      },
                    ],
                  })
                }
              >
                Add Row
              </Button>
            )}
            {fields.length > 1 && (
              <Button size="sm" color="danger" onPress={() => remove(index)}>
                Remove
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnualConfidentialResolution;
