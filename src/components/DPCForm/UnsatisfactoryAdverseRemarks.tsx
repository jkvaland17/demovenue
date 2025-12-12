import React from "react";
import { Input, Button } from "@nextui-org/react";
import { useFieldArray, Control, UseFormRegister } from "react-hook-form";

type Props = {
  control: Control<any>;
  register: UseFormRegister<any>;
  nestIndex: number;
  errors: any;
};

const UnsatisfactoryAdverseRemarks: React.FC<Props> = ({
  control,
  register,
  nestIndex,
  errors,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `annualConfidentialResolution.${nestIndex}.unsatisfactoryAdverseRemarks`,
  });

  return (
    <div className="rounded-md border-1 bg-gray-100 p-3">
      <div className="flex items-center justify-between">
        <p className="pb-4 text-lg">
          Unsatisfactory/Adverse Remarks (with outcomes).
          <span className="font-semibold">
            {" "}
            खराब असंरतोषजनक, प्रतिकूल पार्षिक मन्तव्य परिणाम सहित
          </span>
        </p>
        {fields?.length === 0 && (
          <Button
            size="sm"
            color="secondary"
            onPress={() =>
              append({
                hasRemarks: "",
                dateOfIntimation: "",
                dateOfReceiptOfAppeal: "",
                dateOfDisposalWithResult: "",
              })
            }
          >
            Add Remark
          </Button>
        )}
      </div>

      {fields.map((field, remarkIndex) => (
        <div key={field.id} className="my-3 grid grid-cols-3 items-end gap-4">
          <Input
            {...register(
              `annualConfidentialResolution.${nestIndex}.unsatisfactoryAdverseRemarks.${remarkIndex}.dateOfIntimation`,
              {
                required: "Date of intimation is required",
                validate: (value) => {
                  if (!value) return "This field is required";
                  const date = new Date(value);
                  if (isNaN(date.getTime())) return "Invalid date";
                  return true;
                },
              },
            )}
            label="Date of Intimation"
            type="date"
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            isInvalid={
              !!errors?.annualConfidentialResolution?.[nestIndex]
                ?.unsatisfactoryAdverseRemarks?.[remarkIndex]?.dateOfIntimation
            }
            errorMessage={
              errors?.annualConfidentialResolution?.[nestIndex]
                ?.unsatisfactoryAdverseRemarks?.[remarkIndex]?.dateOfIntimation
                ?.message
            }
          />
          <Input
            {...register(
              `annualConfidentialResolution.${nestIndex}.unsatisfactoryAdverseRemarks.${remarkIndex}.dateOfReceiptOfAppeal`,
              {
                required: "Date of receipt is required",
                validate: (value) => {
                  if (!value) return "This field is required";
                  const date = new Date(value);
                  if (isNaN(date.getTime())) return "Invalid date";

                  const intimationDate = new Date(
                    (
                      document.querySelector(
                        `input[name="annualConfidentialResolution.${nestIndex}.unsatisfactoryAdverseRemarks.${remarkIndex}.dateOfIntimation"]`,
                      ) as HTMLInputElement
                    )?.value || "",
                  );
                  if (
                    !isNaN(intimationDate.getTime()) &&
                    date < intimationDate
                  ) {
                    return "Date of receipt should be after date of intimation";
                  }
                  return true;
                },
              },
            )}
            label="Date of Receipt of Appeal"
            type="date"
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            isInvalid={
              !!errors?.annualConfidentialResolution?.[nestIndex]
                ?.unsatisfactoryAdverseRemarks?.[remarkIndex]
                ?.dateOfReceiptOfAppeal
            }
            errorMessage={
              errors?.annualConfidentialResolution?.[nestIndex]
                ?.unsatisfactoryAdverseRemarks?.[remarkIndex]
                ?.dateOfReceiptOfAppeal?.message
            }
          />
          <Input
            {...register(
              `annualConfidentialResolution.${nestIndex}.unsatisfactoryAdverseRemarks.${remarkIndex}.dateOfDisposalWithResult`,
              {
                required: "Date of disposal is required",
                validate: (value) => {
                  if (!value) return "This field is required";
                  const date = new Date(value);
                  if (isNaN(date.getTime())) return "Invalid date";

                  const receiptDate = new Date(
                    (
                      document.querySelector(
                        `input[name="annualConfidentialResolution.${nestIndex}.unsatisfactoryAdverseRemarks.${remarkIndex}.dateOfReceiptOfAppeal"]`,
                      ) as HTMLInputElement
                    )?.value || "",
                  );
                  if (!isNaN(receiptDate.getTime()) && date < receiptDate) {
                    return "Date of disposal should be after date of receipt";
                  }
                  return true;
                },
              },
            )}
            label="Date of Disposal with Result"
            type="date"
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            isInvalid={
              !!errors?.annualConfidentialResolution?.[nestIndex]
                ?.unsatisfactoryAdverseRemarks?.[remarkIndex]
                ?.dateOfDisposalWithResult
            }
            errorMessage={
              errors?.annualConfidentialResolution?.[nestIndex]
                ?.unsatisfactoryAdverseRemarks?.[remarkIndex]
                ?.dateOfDisposalWithResult?.message
            }
          />

          <div className="col-span-3 flex justify-end gap-2">
            {fields?.length === remarkIndex + 1 && (
              <Button
                size="sm"
                color="secondary"
                onPress={() =>
                  append({
                    hasRemarks: "",
                    dateOfIntimation: "",
                    dateOfReceiptOfAppeal: "",
                    dateOfDisposalWithResult: "",
                  })
                }
              >
                Add Remark
              </Button>
            )}
            <Button
              size="sm"
              color="danger"
              onPress={() => remove(remarkIndex)}
              disabled={fields.length <= 1}
            >
              Remove Remark
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UnsatisfactoryAdverseRemarks;
