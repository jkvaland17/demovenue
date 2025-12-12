import { Input, Textarea } from "@nextui-org/input";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import UseMasterByCodeSelect from "../Adhiyaachan/UseMasterByCodeSelect";
import { MasterCode } from "@/app/admin/adhiyaachan-advertisement/adhiyaachan-submission/types";
import CustomMultipleUpload from "../CustomMultipleUpload";
import { Select, SelectItem } from "@nextui-org/select";
import {
  CallGetAdhiyaachanByAdvertisement,
  CallGetAllMasterCourses,
  CallGetAllNewAdhiyaachanList,
  CallVacancySeatsOfAdhiyachan,
} from "@/_ServerActions";
import { VacancyTable } from "./VacancyTable";
import { useRouter, useSearchParams } from "next/navigation";
import { handleCommonErrors } from "@/Utils/HandleError";

type Props = {
  formMethods: any;
  uploadHindi: any;
  setUploadHindi: any;
  setUploadEnglish: any;
  uploadEnglish: any;
  handleChangeEnglish: (e: any) => void;
  handleChangeHindi: (e: any) => void;
};

const GeneralInfo: React.FC<Props> = ({
  formMethods,
  uploadHindi,
  setUploadHindi,
  setUploadEnglish,
  uploadEnglish,
  handleChangeEnglish,
  handleChangeHindi,
}) => {
  const { control, register, watch, setValue } = formMethods;
  const [adhiyaachanList, setAdhiyaachanList] = useState<any>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any>(null);
  const searchParams = useSearchParams();
  const advertisementId = searchParams.get("id") as string;
  const [course, setCourse] = useState<any[]>([]);

  const getAllCourse = async (): Promise<void> => {
    try {
      const { data, error } = (await CallGetAllMasterCourses()) as any;
      if (error) {
        handleCommonErrors(error);
      }
      if (data) {
        setCourse(data);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
    }
  };

  const TableData = async (Adhiyaachan: any) => {
    if (!Adhiyaachan || Adhiyaachan.length === 0) {
      setTableData(null);
      return;
    }
    const adhiyaachanArray = Array.isArray(Adhiyaachan)
      ? Adhiyaachan
      : [Adhiyaachan];
    try {
      const requestData = {
        adhiyaachanIds: adhiyaachanArray,
      };
      const { data, error } = (await CallVacancySeatsOfAdhiyachan(
        requestData,
      )) as any;
      if (data?.data) {
        setTableData(data?.data);
      } else {
        setTableData(null);
      }
      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      setTableData(null);
    } finally {
      setLoader(false);
    }
  };

  const getAdhiyaachanList = async (id: string) => {
    setLoader(true);
    const query = advertisementId
      ? `advertisementId=${advertisementId}`
      : `course=${id}`;
    try {
      const fetchFn = advertisementId
        ? CallGetAdhiyaachanByAdvertisement
        : CallGetAllNewAdhiyaachanList;
      const { data, error } = (await fetchFn(query)) as any;
      if (data?.data) {
        setLoader(false);
        setAdhiyaachanList(data?.data);
      }
      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAllCourse();
  }, []);

  useEffect(() => {
    const course = watch("course");
    if (course) {
      getAdhiyaachanList(course);
    }
  }, [watch("course")]);

  useEffect(() => {
    const MasterCode = watch("newAdhiyaachanIds");
    if (MasterCode) {
      TableData(MasterCode);
    }
  }, [watch("newAdhiyaachanIds")]);

  return (
    <div>
      <div className="mb-5 flex gap-6">
        <div className="w-1/2">
          <Controller
            name={`course`}
            control={control}
            rules={{ required: "Please select a course" }}
            render={({
              field: { value, onChange },
              fieldState: { error, invalid },
            }) => (
              <UseMasterByCodeSelect
                code={MasterCode?.Course}
                label="Course"
                placeholder="Select Course"
                labelPlacement="outside"
                size="md"
                multiple="single"
                value={value}
                isInvalid={invalid}
                errorMessage={error?.message}
                onChange={(e) => {
                  onChange(e);
                  getAdhiyaachanList(e);
                  setTableData(null);
                  setAdhiyaachanList([]);
                  setValue("newAdhiyaachanIds", []);
                  const selectedCourse = course?.find(
                    (item) => item?._id === e,
                  );
                  setValue(`sportWiseSeats`, selectedCourse?.sportWiseSeats);
                }}
              />
            )}
          />
        </div>
        <div className="w-1/2">
          <Controller
            name="newAdhiyaachanIds"
            control={control}
            render={({
              fieldState: { invalid, error },
              field: { onChange, value },
            }) => (
              <Select
                isLoading={loader}
                selectionMode="multiple"
                placeholder="Select Adhiyaachan"
                label="Select Adhiyaachan"
                labelPlacement="outside"
                isInvalid={invalid}
                selectedKeys={value}
                errorMessage={error?.message}
                onSelectionChange={(e: any) => {
                  const arr = Array.from(e);
                  onChange(arr);
                  TableData(arr);
                }}
                items={adhiyaachanList}
                radius="sm"
              >
                {(option: any) => (
                  <SelectItem key={option?._id}>{option?.title}</SelectItem>
                )}
              </Select>
            )}
          />
        </div>
      </div>
      <div className="mb-5 flex gap-6">
        {tableData &&
          Array.isArray(tableData?.result) &&
          tableData?.result?.length > 0 && (
            <VacancyTable data={tableData} formMethods={formMethods} />
          )}
      </div>
      <div className="mb-5 flex gap-6">
        <Controller
          name="advertisementNumberInEnglish"
          control={control}
          rules={{
            required: "Enter Advertisement reference numbers",
          }}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="text"
              label="Advertisement reference number English"
              labelPlacement="outside"
              placeholder="Enter Advertisement reference number"
              endContent={
                <span className="material-symbols-rounded">edit</span>
              }
              isInvalid={invalid}
              errorMessage={error?.message}
              classNames={{
                label: "font-medium",
                inputWrapper: "rounded-small",
              }}
            />
          )}
        />

        <Controller
          name="advertisementNumberInHindi"
          control={control}
          rules={{
            required: "Enter Advertisement reference numbers Hindi",
          }}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="text"
              label="Advertisement reference number Hindi"
              labelPlacement="outside"
              placeholder="Enter Advertisement reference number"
              endContent={
                <span className="material-symbols-rounded">edit</span>
              }
              isInvalid={invalid}
              errorMessage={error?.message}
              classNames={{
                label: "font-medium",
                inputWrapper: "rounded-small",
              }}
            />
          )}
        />
      </div>
      {watch("sportWiseSeats.isSportsWiseVacncy") && (
        <div className="mb-5 flex gap-6">
          <Controller
            name="documentVerificationStartDate"
            control={control}
            // rules={{
            //   required: "Enter Document Verification Start Date",
            // }}
            render={({ field, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                type="date"
                label="Sport Certificate start date"
                labelPlacement="outside"
                placeholder="Enter Sport Certificate start date"
                isInvalid={invalid}
                errorMessage={error?.message}
                classNames={{
                  label: "font-medium",
                  inputWrapper: "rounded-small",
                }}
              />
            )}
          />

          <Controller
            name="documentVerificationEndDate"
            control={control}
            // rules={{
            //   required: "Enter Document Verification End Date",
            // }}
            render={({ field, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                type="date"
                label="Sport Certificate end date"
                labelPlacement="outside"
                placeholder="Enter Sport Certificate end date"
                isInvalid={invalid}
                errorMessage={error?.message}
                classNames={{
                  label: "font-medium",
                  inputWrapper: "rounded-small",
                }}
              />
            )}
          />
        </div>
      )}
      <div className="mb-5 flex gap-6">
        <Controller
          name="titleInHindi"
          control={control}
          rules={{
            required: "Enter Title in Hindi",
            validate: (value) =>
              /^[\u0900-\u097F\s]+$/.test(value) ||
              "Please enter text in Hindi only",
          }}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="text"
              label="Title in Hindi"
              labelPlacement="outside"
              placeholder="Enter Title in Hindi"
              endContent={
                <span className="material-symbols-rounded">edit</span>
              }
              isInvalid={invalid}
              errorMessage={error?.message}
              classNames={{
                label: "font-medium",
                inputWrapper: "rounded-small",
              }}
            />
          )}
        />

        <Controller
          name="titleInEnglish"
          control={control}
          rules={{
            required: "Enter Title in English",
          }}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="text"
              label="Title in English"
              labelPlacement="outside"
              placeholder="Enter Title in English"
              endContent={
                <span className="material-symbols-rounded">edit</span>
              }
              isInvalid={invalid}
              errorMessage={error?.message}
              classNames={{
                label: "font-medium",
                inputWrapper: "rounded-small",
              }}
            />
          )}
        />
      </div>
      <div className="mb-5 flex gap-6">
        <Controller
          name="startDate"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="date"
              label="Advertisement Start Date"
              labelPlacement="outside"
              placeholder="Enter Start Date"
              isInvalid={invalid}
              errorMessage={error?.message}
              classNames={{
                label: "font-medium",
                inputWrapper: "rounded-small",
              }}
            />
          )}
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="date"
              label="Advertisement End Date"
              labelPlacement="outside"
              placeholder="Enter End Date"
              isInvalid={invalid}
              errorMessage={error?.message}
              classNames={{
                label: "font-medium",
                inputWrapper: "rounded-small",
              }}
            />
          )}
        />
      </div>
      <Controller
        name="description"
        control={control}
        rules={{
          required: "Description is required",
        }}
        render={({
          field: { onChange, value },
          fieldState: { error, invalid },
        }) => (
          <Textarea
            label="Description"
            labelPlacement="outside"
            placeholder="Enter your description"
            value={value}
            onValueChange={onChange}
            isInvalid={invalid}
            errorMessage={error?.message}
            endContent={<span className="material-symbols-rounded">edit</span>}
          />
        )}
      />
      <div className="mb-5 mt-5">
        <CustomMultipleUpload
          {...register("pdfFileInHindi")}
          title="PDF File (Hindi)"
          preview={uploadHindi}
          setPreview={setUploadHindi}
          handleChange={handleChangeHindi}
          setValue={setValue}
          accept={".pdf"}
          name="pdfFileInHindi"
          placeholder="Upload PDF"
          type="single"
        />
      </div>

      <CustomMultipleUpload
        {...register("pdfFileInEnglish")}
        title="PDF File (English)"
        preview={uploadEnglish}
        setPreview={setUploadEnglish}
        handleChange={handleChangeEnglish}
        setValue={setValue}
        accept={".pdf"}
        name="pdfFileInEnglish"
        placeholder="Upload PDF"
        type="single"
      />

      <div className="mb-5 mt-5 flex gap-6">
        <Controller
          name="helpNumber"
          control={control}
          rules={{
            required: "Enter Helpline Number",
          }}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="number"
              label="Help Line Number"
              labelPlacement="outside"
              placeholder="Enter HelpLine Number"
              endContent={
                <span className="material-symbols-rounded">edit</span>
              }
              isInvalid={invalid}
              errorMessage={error?.message}
              classNames={{
                label: "font-medium",
                inputWrapper: "rounded-small",
              }}
            />
          )}
        />
        <Controller
          name="helpEmail"
          control={control}
          // rules={{
          //   required: "Enter Helpline Number",
          // }}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="email"
              label="Help Line Email"
              labelPlacement="outside"
              placeholder="Enter helpEmail"
              endContent={
                <span className="material-symbols-rounded">edit</span>
              }
              isInvalid={invalid}
              errorMessage={error?.message}
              classNames={{
                label: "font-medium",
                inputWrapper: "rounded-small",
              }}
            />
          )}
        />
        <Controller
          name="contactHours"
          control={control}
          //   rules={{
          //     required: "Enter Helpline Number",
          //   }}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="text"
              label="Contact Hours"
              labelPlacement="outside"
              placeholder="Enter contactHours"
              endContent={
                <span className="material-symbols-rounded">edit</span>
              }
              isInvalid={invalid}
              errorMessage={error?.message}
              classNames={{
                label: "font-medium",
                inputWrapper: "rounded-small",
              }}
            />
          )}
        />
      </div>
      <div className="mb-5 mt-5 flex gap-6">
        <Controller
          name="releaseDate"
          control={control}
          rules={{
            required: "Release Date Required",
          }}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="date"
              label="Release Date"
              labelPlacement="outside"
              isInvalid={invalid}
              errorMessage={error?.message}
              classNames={{
                label: "font-medium",
                inputWrapper: "rounded-small",
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default GeneralInfo;
