import { Input, Textarea } from "@nextui-org/input";
import React from "react";
import { Controller } from "react-hook-form";
import { ImportantDatesProps } from "@/Utils/Advertisement/types";

const ImportantDates: React.FC<ImportantDatesProps> = ({
  formMethods,
  validateHindi,
}) => {
  const { control } = formMethods;
  return (
    <div>
      <div className="mb-5 flex gap-6">
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
              label="Application Form Start Date. आवेदन पत्र प्रारंभ तिथि"
              labelPlacement="outside"
              className="col-span-2"
              radius="sm"
            />
          )}
        />
      </div>
      <div className="mb-5 flex gap-6">
        <Controller
          name="importantDates.registrationEndDate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Application Form End Date. आवेदन पत्र की अंतिम तिथि"
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
      </div>
      <div className="mb-5 flex gap-6">
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
          name="importantDates.writtenExamImportantDates"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Written Exam Important Dates. लिखित परीक्षा महत्वपूर्ण तिथियाँ"
              labelPlacement="outside"
              className="col-span-2"
              radius="sm"
            />
          )}
        />
      </div>
       <div className="mb-5 flex gap-6">
        <Controller
          name="importantDates.documentVerificationImportantDates"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Document Verification & Physical Standards Important Dates. दस्तावेज़ सत्यापन और शारीरिक मानक महत्वपूर्ण तिथियाँ"
              labelPlacement="outside"
              className="col-span-2"
              radius="sm"
            />
          )}
        />
        <Controller
          name="importantDates.physicalEfficiencyTestImportantDates"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Physical Efficiency Test Important Dates. शारीरिक दक्षता परीक्षा महत्वपूर्ण तिथियाँ"
              labelPlacement="outside"
              className="col-span-2"
              radius="sm"
            />
          )}
        />
      </div>
       <div className="mb-5 flex gap-6">
        <Controller
          name="importantDates.typingTestImportantDates"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Typing Test Important Dates. टाइपिंग टेस्ट महत्वपूर्ण तिथियाँ"
              labelPlacement="outside"
              className="col-span-2"
              radius="sm"
            />
          )}
        />
        <Controller
          name="importantDates.admitCardReleaseDate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Admit Card Release Date. प्रवेश पत्र जारी करने की तिथि"
              labelPlacement="outside"
              className="col-span-2"
              radius="sm"
            />
          )}
        />
      </div>
      <div className="mb-5 flex gap-6">
        <Controller
          name="importantDates.extraNotes"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Extra notes"
              labelPlacement="outside"
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
    </div>
  );
};

export default ImportantDates;
