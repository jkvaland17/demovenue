"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { CallVerifyOtp } from "@/_ServerActions";
import toast from "react-hot-toast";

interface Props {
  code: string;
  setNewPassword: (value: boolean) => void;
  setNewCode: (value: string) => void;
  handleSendOtp: any;
}

const OtpVerification: React.FC<Props> = ({
  code,
  setNewPassword,
  setNewCode,
  handleSendOtp,
}) => {
  const [otp, Setotp] = useState(new Array(6).fill(""));
  const otpValue = otp?.join("");
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputref = useRef<any>([]);

  const changeHandler = (cValue: string, cIndex: number) => {
    if (isNaN(Number(cValue))) {
      return;
    }
    Setotp([
      ...otp.map((oValue, oIndex) => (cIndex === oIndex ? cValue : oValue)),
    ]);

    if (cIndex < otp.length - 1 && cValue) {
      inputref.current[cIndex + 1]?.focus();
    }
  };

  const backSpaceHandler = (e: React.KeyboardEvent, cIndex: number) => {
    if (e.key === "Backspace" && otp[cIndex] === "") {
      if (cIndex > 0) {
        inputref.current[cIndex - 1]?.focus();
      }
    }
  };

  const submitHandler = async (event: any) => {
    event.preventDefault();
    try {
      const formData = {
        otp: otpValue,
        code: code,
      };
      setIsLoading(true);
      const { data, error } = (await CallVerifyOtp(formData)) as any;
      console.log("CallVerifyOtp", { data, error });
      if (data?.message) {
        toast.success(data?.message);
        setIsLoading(false);
        setNewPassword(true);
        setNewCode(data?.code);
      }
      if (data?.error) {
        toast.error(error);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResendOtp = () => {
    handleSendOtp();
    setTimer(30);
  };

  useEffect(() => {
    setTimer(30);
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="relative flex flex-col justify-center overflow-hidden px-4">
      <div className="mx-auto w-full max-w-md pb-9 pt-10">
        <div className="flex flex-col space-y-5">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="text-3xl font-semibold">
              <p>OTP Verification</p>
            </div>
          </div>
          <form action="" method="post" onSubmit={submitHandler}>
            <div className="flex flex-col space-y-6">
              <div className="flex w-full flex-row items-center justify-center gap-2">
                {otp?.map((item, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputref.current[index] = el;
                    }}
                    radius="sm"
                    className="h-12 w-12 text-center"
                    classNames={{
                      inputWrapper:
                        "h-full w-full border border-gray-300 focus-within:border-blue-500 shadow-none",
                      input: "text-center",
                    }}
                    type="text"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => changeHandler(e.target.value, index)}
                    onKeyDown={(e) => backSpaceHandler(e, index)}
                  />
                ))}
              </div>

              <div className="flex flex-col space-y-5">
                <Button
                  isLoading={isLoading}
                  type="submit"
                  color="primary"
                  className="w-full py-6"
                  variant="shadow"
                >
                  Verify OTP
                </Button>

                <div className="flex flex-row items-center justify-center space-x-1 text-center text-sm font-medium text-gray-500">
                  <p>Didn&apos;t receive code?</p>
                  {timer > 0 ? (
                    <span className="text-red-700">Resend in {timer}s</span>
                  ) : (
                    <span
                      onClick={handleResendOtp}
                      className="cursor-pointer text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Resend
                    </span>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
