import { Input } from "@nextui-org/input";
import { Button, Checkbox } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React from "react";
import { useFieldArray, Controller, UseFormReturn } from "react-hook-form";
import CustomCheckbox from "@/components/CustomCheckbox";
import SportHorizontalWiseVacancy from "@/components/Adhiyaachan/SportHorizontalWiseVacancy";
import {
  AdhiyaanchanFormValues,
  MasterCode,
} from "@/app/admin/adhiyaachan-advertisement/adhiyaachan-submission/types";
import UseMasterByCodeSelect from "./UseMasterByCodeSelect";

type Props = {
  formMethods: UseFormReturn<AdhiyaanchanFormValues>;
  postDataIndex?: number;
  sportIndex?: number;
  sportWiseSeats: {
    isHorizontalMaleFemalVacancy: boolean;
    isHorizontalVacancy: boolean;
    isMaleFemaleVacancy: boolean;
    isSportsWiseVacncy: boolean;
  };
  categoryWiseSeats: {
    isCategoryWiseVacancy: boolean;
    isMaleFemaleVacancy: boolean;
    isHorizontalMaleFemalVacancy: boolean;
    isHorizontalVacancy: boolean;
  };
};

const CategoryWiseVacancy: React.FC<Props> = ({
  postDataIndex = 0,
  sportIndex = 0,
  formMethods,
  sportWiseSeats,
  categoryWiseSeats,
}) => {
  const { control, register, watch, setValue } = formMethods;
  const {
    fields: categoryDataFields,
    append: appendCategoryData,
    remove: removeCategoryData,
  } = useFieldArray<AdhiyaanchanFormValues>({
    control,
    name: `postData.${postDataIndex}.sports.${sportIndex}.categoryWiseVacancy`,
  });

  const formData = watch();
  const isHorizontalCategoryWise =
    formData?.postData?.[postDataIndex]?.sports?.[sportIndex]
      ?.isHorizontalCategoryWise;

  return (
    <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">
          Category Wise Vacancy
        </h3>
        <Button
          color="primary"
          variant="flat"
          size="sm"
          onPress={() =>
            appendCategoryData({
              category: "",
              numberOfVacancy: 0,
              gender: "",
            })
          }
        >
          Add Category
        </Button>
      </div>
      <div className="flex bg-gray-50 text-sm font-medium text-gray-600">
        {/* {categoryWiseSeats?.isCategoryWiseVacancy ? (
          <div className="flex-1 px-4 py-3 text-center">Category</div>
        ) : null} */}
        {sportWiseSeats?.isMaleFemaleVacancy ? (
          <div className="flex-1 px-4 py-3 text-center">Gender</div>
        ) : null}
        <div className="flex-1 px-4 py-3 text-center">No of Vacancy</div>
        <div className="flex-1 px-4 py-3 text-center">Actions</div>
      </div>
      {categoryDataFields?.map((field, index) => (
        <div key={field.id} className="flex bg-white">
          {/* {sportWiseSeats?.isCategoryWiseVacancy && (
            <div className="flex-1 px-4 py-3">
              <Controller
                name={`postData.${postDataIndex}.sports.${sportIndex}.categoryWiseVacancy.${index}.category`}
                control={control}
                rules={{
                  required: "Category is required",
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <Select
                    placeholder="Select category"
                    selectedKeys={value ? [value] : []}
                    onChange={(e) => onChange(e.target.value)}
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  >
                    {allCategory?.map((item: any) => (
                      <SelectItem key={item?._id} value={item?._id}>
                        {item?.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </div>
          )} */}
          {sportWiseSeats?.isMaleFemaleVacancy && (
            <div className="flex-1 px-4 py-3">
              <Controller
                name={`postData.${postDataIndex}.sports.${sportIndex}.categoryWiseVacancy.${index}.gender`}
                control={control}
                rules={{
                  required: "Gender is required",
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <UseMasterByCodeSelect
                    code={MasterCode?.Gender}
                    // label="Gender"
                    placeholder="Select gender"
                    labelPlacement="outside"
                    size="md"
                    multiple="single"
                    value={value}
                    onChange={(selected) => onChange(selected)}
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    isRequired
                  />
                )}
              />
            </div>
          )}
          <div className="flex-1 px-4 py-3">
            <Controller
              name={`postData.${postDataIndex}.sports.${sportIndex}.categoryWiseVacancy.${index}.numberOfVacancy`}
              control={control}
              rules={{
                required: "Number of vacancies is required",
                min: {
                  value: 0,
                  message: "Value must be 0 or greater",
                },
              }}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <Input
                  type="number"
                  placeholder="0"
                  size="sm"
                  value={value?.toString()}
                  onValueChange={(val) => onChange(Number(val))}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  min={0}
                  className="mx-auto w-full max-w-[100px]"
                  classNames={{
                    input: "text-center",
                    inputWrapper:
                      "bg-gray-50 border-gray-200 hover:border-gray-300",
                  }}
                />
              )}
            />
          </div>
          <div className="flex-1 px-4 py-3">
            <div className="flex w-full items-center justify-center gap-3">
              {/* {categoryDataFields?.length === index + 1 && (
                <Button
                  color="primary"
                  variant="flat"
                  size="sm"
                  onPress={() =>
                    appendCategoryData({
                      category: "",
                      numberOfVacancy: 0,
                      gender: "",
                    })
                  }
                >
                  Add
                </Button>
              )} */}
              {categoryDataFields?.length > 0 && (
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => removeCategoryData(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="my-4 border-t border-gray-300" />
      {sportWiseSeats?.isHorizontalVacancy && (
        <div className="flex-1">
          <Controller
            control={control}
            name={`postData.${postDataIndex}.sports.${sportIndex}.isHorizontalCategoryWise`}
            render={({ field: { onChange, value } }) => (
              <CustomCheckbox
                icon="gavel"
                value={value}
                onChange={(val) => {
                  onChange(val);
                  if (val) {
                    setValue(
                      `postData.${postDataIndex}.sports.${sportIndex}.horizontalWiseVacancy`,
                      [{ category: "", numberOfVacancy: 0, gender: "" }],
                    );
                  } else {
                    setValue(
                      `postData.${postDataIndex}.sports.${sportIndex}.horizontalWiseVacancy`,
                      [],
                    );
                  }
                }}
                title="Enable Horizontal Category Wise?"
                desc="If checked, horizontal category-wise vacancy will be applied"
                name={`postData.${postDataIndex}.sports.${sportIndex}.isHorizontalCategoryWise`}
                isEditAllow={true}
              />
            )}
          />
        </div>
      )}
      {isHorizontalCategoryWise && sportWiseSeats?.isHorizontalVacancy && (
        <SportHorizontalWiseVacancy
          formMethods={formMethods}
          postDataIndex={postDataIndex}
          sportIndex={sportIndex}
          sportWiseSeats={sportWiseSeats}
          categoryWiseSeats={categoryWiseSeats}
        />
      )}
    </div>
  );
};

export default CategoryWiseVacancy;
