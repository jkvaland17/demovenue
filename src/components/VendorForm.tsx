import { Controller, useWatch } from "react-hook-form";
import {
  Input,
  Textarea,
  RadioGroup,
  Radio,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { CallGetVendor } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import { useEffect, useState } from "react";

export default function VendorForm({ control, modalType }: any) {
  const [vendor, setVendor] = useState<any[]>([]);
  const blacklistedStatus = useWatch({
    control,
    name: "blacklistedStatus",
  });
  const isOutSide = useWatch({
    control,
    name: "isOutSide",
  });

  const getVendor = async () => {
    try {
      const { data, error } = (await CallGetVendor()) as any;
      console.log("getVendor", { data, error });
      if (data) {
        setVendor(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVendor();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-3 mob:p-0">
      <Controller
        name="isOutSide"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <RadioGroup
            isDisabled={modalType === "view"}
            {...field}
            orientation="horizontal"
            label="Is Outside Vendor"
            classNames={{
              label: "text-black",
            }}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </RadioGroup>
        )}
      />
      <Controller
        name="stateRegion"
        control={control}
        rules={{ required: "State / Region is required" }}
        render={({ field, fieldState }) => (
          <Input
            isDisabled={modalType === "view"}
            labelPlacement="outside"
            label="State / Region of Operation"
            placeholder="Enter State / Region"
            {...field}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
      {isOutSide === "Yes" ? (
        <>
          <Controller
            name="vendorCode"
            control={control}
            rules={{ required: "Vendor Code is required" }}
            render={({ field, fieldState }) => (
              <Input
                isDisabled={modalType === "view"}
                labelPlacement="outside"
                label="Vendor Code"
                placeholder="Enter Vendor Code"
                {...field}
                isInvalid={fieldState.invalid}
                errorMessage={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="vendorName"
            control={control}
            rules={{ required: "Vendor Name is required" }}
            render={({ field, fieldState }) => (
              <Input
                isDisabled={modalType === "view"}
                labelPlacement="outside"
                label="Vendor Name"
                placeholder="Enter Vendor Name"
                {...field}
                isInvalid={fieldState.invalid}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </>
      ) : (
        <>
          <Controller
            name="vendorCode"
            control={control}
            rules={{ required: "Vendor Code is required" }}
            render={({
              field: { onChange, value },
              fieldState: { error, invalid },
            }) => (
              <Select
                isDisabled={modalType === "view"}
                isInvalid={invalid}
                errorMessage={error?.message}
                selectedKeys={value ? [value] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  onChange(selectedKey);
                }}
                items={vendor}
                label="Vendor Code"
                labelPlacement="outside"
                placeholder="Select Vendor"
              >
                {(item: any) => (
                  <SelectItem key={item?._id}>{item?.uniqueToken}</SelectItem>
                )}
              </Select>
            )}
          />

          <Controller
            name="vendorName"
            control={control}
            rules={{ required: "Vendor Name is required" }}
            render={({
              field: { onChange, value },
              fieldState: { error, invalid },
            }) => (
              <Select
                isDisabled={modalType === "view"}
                isInvalid={invalid}
                errorMessage={error?.message}
                selectedKeys={value ? [value] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  onChange(selectedKey);
                }}
                items={vendor}
                label="Vendor Name"
                placeholder="Select Vendor Name"
                labelPlacement="outside"
              >
                {(item: any) => (
                  <SelectItem key={item?._id}>{item?.vendorName}</SelectItem>
                )}
              </Select>
            )}
          />
        </>
      )}

      <div className="col-span-2">
        <Controller
          name="address"
          control={control}
          rules={{ required: "Address is required" }}
          render={({ field, fieldState }) => (
            <Textarea
              isDisabled={modalType === "view"}
              labelPlacement="outside"
              label="Address"
              placeholder="Enter Address"
              {...field}
              isInvalid={fieldState.invalid}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>

      <Controller
        name="phone"
        control={control}
        rules={{
          required: "Mobile Number is required",
          pattern: {
            value: /^[0-9]{10}$/,
            message: "Enter valid mobile number",
          },
        }}
        render={({ field, fieldState }) => (
          <Input
            isDisabled={modalType === "view"}
            labelPlacement="outside"
            type="tel"
            label="Mobile Number"
            placeholder="Enter Mobile Number"
            {...field}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="panCard"
        control={control}
        rules={{ required: "PAN Card is required" }}
        render={({ field, fieldState }) => (
          <Input
            isDisabled={modalType === "view"}
            labelPlacement="outside"
            label="PAN Card"
            placeholder="Enter PAN Card Number"
            {...field}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="gstNumber"
        control={control}
        rules={{ required: "GST Number is required" }}
        render={({ field, fieldState }) => (
          <Input
            isDisabled={modalType === "view"}
            labelPlacement="outside"
            label="GST Number"
            placeholder="Enter GST Number"
            {...field}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="workExperience"
        control={control}
        rules={{ required: "Work Experience is required" }}
        render={({ field, fieldState }) => (
          <Input
            isDisabled={modalType === "view"}
            labelPlacement="outside"
            type="number"
            label="Work Experience (Years)"
            placeholder="Enter Years"
            {...field}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      {/* <Controller
        name="workExperienceType"
        control={control}
        rules={{ required: "Work Experience Type is required" }}
        render={({ field, fieldState }) => (
          <Input
            isDisabled={modalType === "view"}
            labelPlacement="outside"
            label="Type of Work Experience"
            placeholder="e.g., Printing, Logistics"
            {...field}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
          />
        )}
      /> */}

      {/* <Controller
        name="volumeOfWork"
        control={control}
        rules={{ required: "Volume of Work is required" }}
        render={({ field, fieldState }) => (
          <Input
            isDisabled={modalType === "view"}
            labelPlacement="outside"
            label="Volume of Work"
            placeholder="Enter Volume"
            {...field}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
          />
        )}
      /> */}

      {/* <Controller
        name="legalCases"
        control={control}
        render={({ field }) => (
          <Input
            isDisabled={modalType === "view"}
            labelPlacement="outside"
            label="Number of Legal Cases Filed"
            type="number"
            placeholder="Number of Legal Cases Filed"
            {...field}
          />
        )}
      /> */}

      <Controller
        name="rating"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            isDisabled={modalType === "view"}
            labelPlacement="outside"
            label="Final Work Rating (0-10)"
            placeholder="Rating"
            {...field}
          />
        )}
      />

      <Controller
        name="govtProjectsHandled"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <RadioGroup
            isDisabled={modalType === "view"}
            {...field}
            orientation="horizontal"
            label="Govt Projects Handled"
            classNames={{
              label: "text-black",
            }}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </RadioGroup>
        )}
      />

      {/* <Controller
        name="blacklistedStatus"
        control={control}
        rules={{ required: "Blacklisted Status is required" }}
        render={({ field }) => (
          <RadioGroup
            isDisabled={modalType === "view"}
            {...field}
            orientation="horizontal"
            label="Blacklisted Status"
            classNames={{
              label: "text-black",
            }}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </RadioGroup>
        )}
      /> */}

      {/* {blacklistedStatus === "Yes" && (
        <>
          <Controller
            name="blacklistedDurationStart"
            control={control}
            render={({ field }) => (
              <Input
                isDisabled={modalType === "view"}
                labelPlacement="outside"
                type="date"
                label="Blacklisted Start Date"
                {...field}
              />
            )}
          />

          <Controller
            name="blacklistedDurationEnd"
            control={control}
            render={({ field }) => (
              <Input
                isDisabled={modalType === "view"}
                labelPlacement="outside"
                type="date"
                label="Blacklisted End Date"
                {...field}
              />
            )}
          />
        </>
      )} */}

      {/* <Controller
        name="finalDeliverables"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <RadioGroup
            isDisabled={modalType === "view"}
            {...field}
            orientation="horizontal"
            label="Final Deliverables Submitted"
            classNames={{
              label: "text-black",
            }}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </RadioGroup>
        )}
      /> */}

      {/* <Controller
        name="timelyDelivery"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <RadioGroup
            isDisabled={modalType === "view"}
            {...field}
            orientation="horizontal"
            label="Timely Delivery"
            classNames={{
              label: "text-black",
            }}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </RadioGroup>
        )}
      /> */}
    </div>
  );
}
