"use client";
import {
  CallGetAllAdvertisement,
  CallSubmitDetailsOfAdvertisement,
} from "@/_ServerActions";
import FormSkeleton from "@/components/kushal-components/loader/FormSkeleton";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AdvertisementDetails = () => {
  const { setValue, control, handleSubmit } = useForm();
  const [allList, setAllList] = useState<any>([]);
  const [loader, setLoader] = useState<any>({
    update: false,
    form: false,
  });

  const sendAdvertisementDetails = async (dto: any) => {
    setLoader((prev: any) => ({
      ...prev,
      update: true,
    }));
    try {
      const { data, error } = (await CallSubmitDetailsOfAdvertisement(
        dto,
      )) as any;
      // console.log("CallSubmitDetailsOfAdvertisement", data, error);
      if (data?.data) {
        toast.success(data?.message);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        update: false,
      }));
    } catch (error) {
      console.log(error);
      setLoader((prev: any) => ({
        ...prev,
        update: false,
      }));
    }
  };

  const getAdvertisementTableList = async () => {
    setLoader((prev: any) => ({
      ...prev,
      form: true,
    }));
    const query = `page=&limit=&advertisementReferenceNumber=`;
    try {
      const { data, error } = (await CallGetAllAdvertisement(query)) as any;
      if (data?.data) {
        setAllList(data?.data?.result);
      }
      if (error) {
        handleCommonErrors(Error);
      }
      setLoader((prev: any) => ({
        ...prev,
        form: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        form: false,
      }));
    }
  };

  const validateHindi = (value: string | undefined) => {
    if (!value) return true;
    const hindiRegex = /^[\u0900-\u097F\s]+$/;
    return hindiRegex.test(value) || "Please Enter Hindi Text Only";
  };

  useEffect(() => {
    getAdvertisementTableList();
  }, []);

  return (
    <>
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white px-4 py-6 md:px-8 md:py-10">
        <h1 className="text-xl font-semibold md:text-3xl">
          Content/Details of Advertisement
        </h1>
        <p className="md:text-md my-3 text-sm text-slate-500 md:my-5">
          Clearly fill the form below. Fields marked with * are mandatory to
          fill:
        </p>
        <p className="md:text-md text-sm text-slate-500">
          नीचे दिए गए फॉर्म को स्पष्ट रूप से भरें, * से चिह्नित फ़ील्ड भरना
          अनिवार्य है:
        </p>

        {loader.form ? (
          <FormSkeleton inputCount={10} />
        ) : (
          <form onSubmit={handleSubmit(sendAdvertisementDetails)}>
            <div className="grid grid-cols-1 gap-5 pt-8 md:grid-cols-3 md:gap-8">
              <Controller
                name="id"
                control={control}
                rules={{ required: "Select Advertisement" }}
                render={({
                  fieldState: { invalid, error },
                  field: { onChange, value },
                }) => (
                  <Select
                    className="col-span-3"
                    placeholder="Select Advertisement"
                    label="Advertisement"
                    labelPlacement="outside"
                    isInvalid={invalid}
                    selectedKeys={[value]}
                    errorMessage={error?.message}
                    onChange={(e: any) => {
                      onChange(e.target.value);
                    }}
                    items={allList}
                    radius="sm"
                  >
                    {(option: any) => (
                      <SelectItem key={option?._id}>
                        {option?.titleInEnglish}
                      </SelectItem>
                    )}
                  </Select>
                )}
              />

              {/* <Controller
                name="predefinedTemplate"
                control={control}
                rules={{ required: "Select predefined template" }}
                render={({
                  fieldState: { invalid, error },
                  field: { onChange, value },
                }) => (
                  <Select
                    className="col-span-3"
                    placeholder="Select predefined template"
                    label="Select predefined template. पूर्वनिर्धारित टेम्पलेट का चयन करें"
                    labelPlacement="outside"
                    isInvalid={invalid}
                    selectedKeys={[value]}
                    errorMessage={error?.message}
                    onChange={(e: any) => {
                      onChange(e.target.value);
                    }}
                    items={allList}
                    radius="sm"
                  >
                    {(option: any) => (
                      <SelectItem key={option?._id}>
                        {option?.titleInEnglish}
                      </SelectItem>
                    )}
                  </Select>
                )}
              /> */}

              <Accordion
                selectionMode="multiple"
                defaultExpandedKeys={["1", "2", "3", "4", "5", "6"]}
                className="col-span-3 px-0"
              >
                <AccordionItem
                  key="1"
                  aria-label="Main Information प्रमुख जानकारी"
                  title={
                    <p className="font-semibold md:text-xl">
                      Main Information प्रमुख जानकारी
                    </p>
                  }
                >
                  <div className="grid w-full grid-cols-2 gap-6 py-8">
                    <Controller
                      name="mainInformation.title"
                      control={control}
                      rules={{
                        required: "Enter Title",
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Input
                          {...field}
                          label="Title"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    <Controller
                      name="mainInformation.titleInHindi"
                      control={control}
                      rules={{
                        required: "शीर्षक दर्ज करें",
                        validate: validateHindi,
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Input
                          {...field}
                          label="शीर्षक"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    <Controller
                      name="mainInformation.shortSummary"
                      control={control}
                      rules={{
                        required: "Enter a short summary",
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="Short summary"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    <Controller
                      name="mainInformation.shortSummaryInHindi"
                      control={control}
                      rules={{
                        required: "संक्षिप्त सारांश दर्ज करें",
                        validate: validateHindi,
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="संक्षिप्त सारांश"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    <Controller
                      name="mainInformation.extraNotes"
                      control={control}
                      rules={{
                        required: "Enter extra notes",
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="Extra notes"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    <Controller
                      name="mainInformation.extraNotesInHindi"
                      control={control}
                      rules={{
                        required: "अतिरिक्त टिप्पणियाँ दर्ज करें",
                        validate: validateHindi,
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="अतिरिक्त टिप्पणियाँ"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                  </div>
                </AccordionItem>
                <AccordionItem
                  key="2"
                  aria-label="Exam Basic Details परीक्षा का मूल विवरण"
                  title={
                    <p className="font-semibold md:text-xl">
                      Exam Basic Details परीक्षा का मूल विवरण
                    </p>
                  }
                >
                  <div className="grid w-full grid-cols-2 gap-6 py-8">
                    {/* Post Name (English) */}
                    <Controller
                      name="examBasicDetails.postName"
                      control={control}
                      rules={{ required: "Enter the post name" }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Input
                          {...field}
                          label="Post name"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    {/* Post Name (Hindi) */}
                    <Controller
                      name="examBasicDetails.postNameInHindi"
                      control={control}
                      rules={{
                        required: "पोस्ट नाम दर्ज करें",
                        validate: validateHindi,
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Input
                          {...field}
                          label="पोस्ट नाम"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    {/* Educational Qualification (English) */}
                    <Controller
                      name="examBasicDetails.educationalQualification"
                      control={control}
                      rules={{ required: "Enter educational qualification" }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="Educational qualification"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    {/* Educational Qualification (Hindi) */}
                    <Controller
                      name="examBasicDetails.educationalQualificationInHindi"
                      control={control}
                      rules={{
                        required: "शैक्षणिक योग्यता दर्ज करें",
                        validate: validateHindi,
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="शैक्षणिक योग्यता"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    {/* Total Vacancy */}
                    <Controller
                      name="examBasicDetails.totalVacancy"
                      control={control}
                      rules={{ required: "Enter total vacancy" }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Total vacancy. कुल रिक्ति"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    {/* Application Mode */}
                    <Controller
                      name="examBasicDetails.applicationMode"
                      control={control}
                      rules={{ required: "Select application mode" }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Select
                          {...field}
                          items={[
                            { value: "1", name: "1" },
                            { value: "2", name: "2" },
                            { value: "3", name: "3" },
                          ]}
                          label="Application mode. आवेदन मोड"
                          labelPlacement="outside"
                          placeholder="Select"
                          variant="bordered"
                          radius="sm"
                          className="col-span-2"
                        >
                          {(option: any) => (
                            <SelectItem key={option?.value}>
                              {option?.name}
                            </SelectItem>
                          )}
                        </Select>
                      )}
                    />

                    {/* Age Limit */}
                    <Controller
                      name="examBasicDetails.ageLmit"
                      control={control}
                      rules={{ required: "Enter age limit" }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Age limit. आयु सीमा"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    {/* Salary */}
                    <Controller
                      name="examBasicDetails.salary"
                      control={control}
                      rules={{ required: "Enter salary" }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Salary. वेतन"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    {/* Extra Notes (English) */}
                    <Controller
                      name="examBasicDetails.extraNotes"
                      control={control}
                      rules={{ required: "Enter extra notes" }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="Extra notes"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    {/* Extra Notes (Hindi) */}
                    <Controller
                      name="examBasicDetails.extraNotesInHindi"
                      control={control}
                      rules={{
                        required: "अतिरिक्त टिप्पणियाँ दर्ज करें",
                        validate: validateHindi,
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="अतिरिक्त टिप्पणियाँ"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                  </div>
                </AccordionItem>
                <AccordionItem
                  key="3"
                  aria-label="Reservation Category-wise"
                  title={
                    <p className="font-semibold md:text-xl">
                      Reservation Category-wise
                    </p>
                  }
                >
                  <div className="grid w-full grid-cols-2 gap-6 py-8">
                    <Controller
                      name="reservationCategoryWise.genralCategory"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="General Category. सामान्य वर्ग"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="reservationCategoryWise.otherBackWardClasses"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Other Backward Classes. अन्य पिछड़ा वर्ग"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="reservationCategoryWise.economicallyWeakerSections"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Economically Weaker Sections. आर्थिक रूप से कमजोर वर्ग"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="reservationCategoryWise.scheduledCastes"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Scheduled Castes. अनुसूचित जाति"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="reservationCategoryWise.scheduledTribes"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Scheduled Tribes. अनुसूचित जनजाति"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="reservationCategoryWise.extraNotes"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          label="Extra notes"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="reservationCategoryWise.extraNotesInHindi"
                      control={control}
                      rules={{ validate: validateHindi }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="अतिरिक्त टिप्पणियाँ"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                  </div>
                </AccordionItem>

                <AccordionItem
                  key="4"
                  aria-label="Important Dates"
                  title={
                    <p className="font-semibold md:text-xl">Important Dates</p>
                  }
                >
                  <div className="grid w-full grid-cols-2 gap-6 py-8">
                    <Controller
                      name="importantDates.examDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          label="Exam date. परीक्षा तिथि"
                          labelPlacement="outside"
                          className="col-span-2"
                          radius="sm"
                        />
                      )}
                    />
                    <Controller
                      name="importantDates.registrationStartDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          label="Registration start date. पंजीकरण की प्रारंभ तिथि"
                          labelPlacement="outside"
                          className="col-span-2"
                          radius="sm"
                        />
                      )}
                    />
                    <Controller
                      name="importantDates.registrationEndDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          label="Registration end date. पंजीकरण की अंतिम तिथि"
                          labelPlacement="outside"
                          className="col-span-2"
                          radius="sm"
                        />
                      )}
                    />
                    <Controller
                      name="importantDates.lastDateForSubmissionOfApplicationFee"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          label="Last date for submission of application fee. आवेदन शुल्क जमा करने की अंतिम तिथि"
                          labelPlacement="outside"
                          className="col-span-2"
                          radius="sm"
                        />
                      )}
                    />
                    <Controller
                      name="importantDates.lastDateForSubmissionOfApplicationForm"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          label="Last date for submission of application form. आवेदन पत्र सबमिट करने की अंतिम तिथि"
                          labelPlacement="outside"
                          className="col-span-2"
                          radius="sm"
                        />
                      )}
                    />
                    <Controller
                      name="importantDates.extraNotes"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          label="Extra notes"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="importantDates.extraNotesInHindi"
                      control={control}
                      rules={{ validate: validateHindi }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="अतिरिक्त टिप्पणियाँ"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                  </div>
                </AccordionItem>
                <AccordionItem
                  key="5"
                  aria-label="Exam Fees Category-wise"
                  title={
                    <p className="font-semibold md:text-xl">
                      Exam Fees Category-wise
                    </p>
                  }
                >
                  <div className="grid w-full grid-cols-2 gap-6 py-8">
                    <Controller
                      name="examFeesCategoryWise.genralCategory"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="General Category. सामान्य वर्ग"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="examFeesCategoryWise.otherBackWardClasses"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Other Backward Classes. अन्य पिछड़ा वर्ग"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="examFeesCategoryWise.economicallyWeakerSections"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Economically Weaker Sections. आर्थिक रूप से कमजोर वर्ग"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="examFeesCategoryWise.scheduledCastes"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Scheduled Castes. अनुसूचित जाति"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="examFeesCategoryWise.scheduledTribes"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Scheduled Tribes. अनुसूचित जनजाति"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="examFeesCategoryWise.extraNotes"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          label="Extra notes"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="examFeesCategoryWise.extraNotesInHindi"
                      rules={{ validate: validateHindi }}
                      control={control}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="अतिरिक्त टिप्पणियाँ"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                  </div>
                </AccordionItem>
                <AccordionItem
                  key="6"
                  aria-label="Age Relaxation Category-wise"
                  title={
                    <p className="font-semibold md:text-xl">
                      Age Relaxation Category-wise
                    </p>
                  }
                >
                  <div className="grid w-full grid-cols-2 gap-6 py-8">
                    <Controller
                      name="ageRelaxationCategoryWise.genralCategory"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="General Category. सामान्य वर्ग"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="ageRelaxationCategoryWise.otherBackWardClasses"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Other Backward Classes. अन्य पिछड़ा वर्ग"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="ageRelaxationCategoryWise.economicallyWeakerSections"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Economically Weaker Sections. आर्थिक रूप से कमजोर वर्ग"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="ageRelaxationCategoryWise.scheduledCastes"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Scheduled Castes. अनुसूचित जाति"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="ageRelaxationCategoryWise.scheduledTribes"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Scheduled Tribes. अनुसूचित जनजाति"
                          labelPlacement="outside"
                          placeholder=" "
                          variant="bordered"
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              tag
                            </span>
                          }
                          className="col-span-2"
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="ageRelaxationCategoryWise.extraNotes"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          label="Extra notes"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="ageRelaxationCategoryWise.extraNotesInHindi"
                      control={control}
                      rules={{
                        required: true,
                        validate: validateHindi,
                      }}
                      defaultValue={""}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="अतिरिक्त टिप्पणियाँ"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                  </div>
                </AccordionItem>
              </Accordion>
            </div>

            <Button
              type="submit"
              className="mt-8 w-full bg-black text-white"
              isLoading={loader?.update}
            >
              Submit
            </Button>
          </form>
        )}
      </div>
    </>
  );
};

export default AdvertisementDetails;
