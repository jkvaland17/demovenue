import PhoneIcon from "@/assets/img/svg/Phone";
import { Button, Input } from "@nextui-org/react";
import React from "react";

interface Props {
  setPhone: (value: string) => void;
  handleSendOtp: any;
  isLoading: boolean;
}

const PhoneVerification: React.FC<Props> = ({
  setPhone,
  handleSendOtp,
  isLoading,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold">Phone Verification</h2>
        </div>
        <form onSubmit={handleSendOtp}>
          <Input
            type="tel"
            maxLength={10}
            label="Enter Phone Number"
            placeholder="Enter phone number"
            isRequired
            errorMessage={"Please Enter Phone Number"}
            labelPlacement="outside"
            radius="sm"
            className="mb-5"
            classNames={{
              inputWrapper: "w-full",
            }}
            startContent={<PhoneIcon />}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button
            isLoading={isLoading}
            type="submit"
            color="primary"
            variant="shadow"
            className="w-full py-6"
          >
            Send OTP
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PhoneVerification;
