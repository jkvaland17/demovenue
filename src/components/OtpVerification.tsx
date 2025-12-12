import { Button, InputOtp } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function OtpVerification() {
  const { control, handleSubmit } = useForm();
  const [timerCount, setTimerCount] = useState<number>(0);
  const [resendOtp, setResendOtp] = useState<boolean>(false);

  useEffect(() => {
    if (resendOtp) {
      const interval = setInterval(() => {
        if (timerCount > 0) {
          setTimerCount(timerCount - 1);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [timerCount]);

  const handleTwoFactorAuth = async (authData: any) => {
    console.log("authData", authData);
    setResendOtp(true);
    setTimerCount(30);
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(handleTwoFactorAuth)}
        className="mt-5 w-full p-4 md:p-8 md:pt-4"
        autoComplete="new-login"
      >
        <p className="font-semibold">Enter OTP</p>
        <Controller
          control={control}
          name="otp"
          rules={{
            required: "OTP is required",
            minLength: {
              value: 4,
              message: "Please enter a valid OTP",
            },
          }}
          render={({ field, fieldState: { invalid, error } }) => (
            <InputOtp
              {...field}
              errorMessage={error?.message}
              isInvalid={invalid}
              length={6}
              size="lg"
              radius="md"
              className="mb-1"
              autoComplete="new-otp"
              classNames={{
                base: "w-full",
                segmentWrapper: "w-full",
                segment: "w-20 h-16 text-xl",
              }}
            />
          )}
        />
        <div className="text-end">
          <Button
            className="bg-transparent text-sm text-primary"
            disableRipple
            isDisabled={timerCount !== 0}
          >
            Resend OTP {timerCount !== 0 && timerCount}
          </Button>
        </div>

        <Button
          type="submit"
          color="primary"
          variant="solid"
          className="mt-4 text-white"
        >
          Verify
        </Button>
      </form>
    </div>
  );
}
