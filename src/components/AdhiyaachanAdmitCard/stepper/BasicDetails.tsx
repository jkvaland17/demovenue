import { CallGetAllExamTypeData } from "@/_ServerActions";
import { MasterCode } from "@/app/admin/adhiyaachan-advertisement/adhiyaachan-submission/types";
import UseMasterByCodeSelect from "@/components/Adhiyaachan/UseMasterByCodeSelect";
import { Card, CardBody } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React, { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import Schedules from "@/components/AdhiyaachanAdmitCard/stepper/Schedules";

interface RecruitmentRulesProps {
  formMethods: UseFormReturn<any>;
}

const BasicDetails = ({ formMethods }: RecruitmentRulesProps) => {
  const { control, watch } = formMethods;
  const [allMaster, setAllMaster] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAllExamType = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const query = `advertisementId=${watch("advertisementId")}`;
      const { data, error } = (await CallGetAllExamTypeData(query)) as any;
      console.log("getAllExamType", data);
      if (error) {
        console.log(error);
      }
      if (data) {
        setAllMaster(data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllExamType();
  }, [watch("advertisementId")]);


  return (
    <Card className="mb-5">
      <CardBody>
        <div className="mb-5 flex gap-6">
          <Controller
            name={`advertisementId`}
            control={control}
            rules={{ required: "Please select advertisement" }}
            render={({
              field: { value, onChange },
              fieldState: { error, invalid },
            }) => (
              <UseMasterByCodeSelect
                code={MasterCode?.Advertisement}
                label="Advertisement"
                placeholder="Select Advertisement"
                labelPlacement="outside"
                size="md"
                multiple="single"
                value={value}
                isRequired
                isInvalid={invalid}
                errorMessage={error?.message}
                onChange={(e) => {
                  onChange(e);
                }}
              />
            )}
          />
        </div>
        <div className="mb-5 flex gap-6">
          <Controller
            name={`masterDataIds`}
            control={control}
            rules={{ required: "Please select Exam Type" }}
            render={({
              field: { onChange, value },
              fieldState: { error, invalid },
            }) => {
              return (
                <Select
                  items={allMaster}
                  fullWidth
                  isLoading={isLoading}
                  selectionMode="single"
                  label="Exam Type"
                  placeholder="Select Exam Type"
                  labelPlacement="outside"
                  selectedKeys={value ? [value] : []}
                  isInvalid={invalid}
                  isRequired
                  errorMessage={error?.message}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    onChange(selectedKey);
                  }}
                >
                  {(item) => (
                    <SelectItem
                      key={item?.admitCardExamId}
                      value={item?.admitCardExamId}
                    >
                      {item.examType}
                    </SelectItem>
                  )}
                </Select>
              );
            }}
          />
        </div>
        <Schedules formMethods={formMethods} />
      </CardBody>
    </Card>
  );
};

export default BasicDetails;
