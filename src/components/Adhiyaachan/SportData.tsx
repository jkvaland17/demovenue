import { Button, Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import CategoryWiseVacancy from "@/components/Adhiyaachan/CategoryWiseVacancy";
import {
  AdhiyaanchanFormValues,
  MasterCode,
  Sport,
} from "@/app/admin/adhiyaachan-advertisement/adhiyaachan-submission/types";
import { handleCommonErrors } from "@/Utils/HandleError";
import { CallGetAllSportsData } from "@/_ServerActions";
import UseMasterByCodeSelect from "./UseMasterByCodeSelect";

type SportWiseSeatsType = {
  isHorizontalMaleFemalVacancy: boolean;
  isHorizontalVacancy: boolean;
  isMaleFemaleVacancy: boolean;
  isSportsWiseVacncy: boolean;
};

type CategoryWiseSeatsType = {
  isCategoryWiseVacancy: boolean;
  isMaleFemaleVacancy: boolean;
  isHorizontalMaleFemalVacancy: boolean;
  isHorizontalVacancy: boolean;
};

type Props = {
  formMethods: UseFormReturn<AdhiyaanchanFormValues>;
  key?: number;
  index?: number;
  postDataIndex: number;
  sportWiseSeats: SportWiseSeatsType;
  categoryWiseSeats: CategoryWiseSeatsType;
};

export const defaultSportData: Sport = {
  sportIds: "",
  position: "",
  subsport: "",
  isCategoryWise: false,
  categoryWiseVacancy: [
    {
      category: "",
      numberOfVacancy: 0,
      gender: "",
    },
  ],
  isHorizontalCategoryWise: true,
  horizontalWiseVacancy: [
    {
      category: "",
      numberOfVacancy: 2,
      gender: "",
    },
  ],
  sportsLevel: 0,
};

const SportData: React.FC<Props> = ({
  formMethods,
  postDataIndex,
  sportWiseSeats,
  categoryWiseSeats,
}) => {
  const { control, register, watch, setValue } = formMethods;
  const {
    fields: sportDataFields,
    append: appendSportData,
    remove: removeSportData,
  } = useFieldArray({
    control,
    name: `postData.${postDataIndex}.sports`,
  });

  // Store subSport and subSubSport per row
  const [subSport, setSubSport] = useState<{ [key: number]: any[] }>({});
  const [subSubSport, setSubSubSport] = useState<{ [key: number]: any[] }>({});

  const getAllSubSport = async (id: string, index: number): Promise<void> => {
    try {
      const { data, error } = (await CallGetAllSportsData(id)) as any;
      if (error) {
        handleCommonErrors(error);
      }
      if (data) {
        setSubSport((prev) => ({ ...prev, [index]: data?.data }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const getAllPosition = async (id: string, index: number): Promise<void> => {
    try {
      const { data, error } = (await CallGetAllSportsData(id)) as any;
      if (error) {
        handleCommonErrors(error);
      }
      if (data) {
        setSubSubSport((prev) => ({ ...prev, [index]: data?.data }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Category, Horizontal & Sports Quota Details
        </h3>
        <Button
          color="primary"
          size="sm"
          variant="flat"
          onPress={() => appendSportData(defaultSportData)}
        >
          Add Sports
        </Button>
      </div>
      {sportDataFields?.map((field, index) => (
        <div key={field.id}>
          <div className="mt-5 flex gap-3 rounded-lg border border-gray-200 bg-white p-4 px-4 py-3">
            <Controller
              name={`postData.${postDataIndex}.sports.${index}.sportIds`}
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <UseMasterByCodeSelect
                  code={MasterCode?.Sport}
                  label="Sport"
                  placeholder="Select Sport"
                  labelPlacement="outside"
                  size="md"
                  multiple="single"
                  value={value}
                  onChange={async (selected) => {
                    onChange(selected);
                    await getAllSubSport(selected, index);
                    setValue(
                      `postData.${postDataIndex}.sports.${index}.subsport`,
                      ""
                    );
                    setValue(
                      `postData.${postDataIndex}.sports.${index}.position`,
                      ""
                    );
                    setValue(
                      `postData.${postDataIndex}.sports.${index}.sportsLevel`,
                      1
                    );
                    setSubSubSport((prev) => ({ ...prev, [index]: [] }));
                  }}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              name={`postData.${postDataIndex}.sports.${index}.subsport`}
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <Select
                  label="Sub Sport"
                  labelPlacement="outside"
                  placeholder="Select Sub Sport"
                  selectedKeys={value ? [value] : []}
                  onChange={async (e) => {
                    const selected = e.target.value;
                    onChange(selected);
                    await getAllPosition(selected, index);
                    setValue(
                      `postData.${postDataIndex}.sports.${index}.position`,
                      ""
                    );
                    setValue(
                      `postData.${postDataIndex}.sports.${index}.sportsLevel`,
                      2
                    );
                  }}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                >
                  {(subSport[index] || []).map((item: any) => (
                    <SelectItem key={item?._id} value={item?._id}>
                      {item?.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              name={`postData.${postDataIndex}.sports.${index}.position`}
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <Select
                  label="Position"
                  labelPlacement="outside"
                  placeholder="Select Position"
                  selectedKeys={value ? [value] : []}
                  onChange={(e) => {
                    onChange(e.target.value);
                    setValue(
                      `postData.${postDataIndex}.sports.${index}.sportsLevel`,
                      3
                    );
                  }}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                >
                  {(subSubSport[index] || []).map((item: any) => (
                    <SelectItem key={item?._id} value={item?._id}>
                      {item?.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>
          <CategoryWiseVacancy
            formMethods={formMethods}
            postDataIndex={postDataIndex}
            sportIndex={index}
            sportWiseSeats={sportWiseSeats}
            categoryWiseSeats={categoryWiseSeats}
          />

          <div className="col-span-2 mt-5 flex w-full items-center justify-end gap-3">
            {sportDataFields?.length > 1 && (
              <Button
                color="danger"
                size="sm"
                variant="flat"
                onPress={() => removeSportData(index)}
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

export default SportData;
