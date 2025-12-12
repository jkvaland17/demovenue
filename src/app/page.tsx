"use client";
import Image from "next/image";
import toast from "react-hot-toast";
import { CallPlatformToken, CallSendOtp } from "@/_ServerActions";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Button, Input } from "@nextui-org/react";
import EmailIcon from "@/assets/img/svg/Email";
import PasswordIcon from "@/assets/img/svg/Password";
import { EyeSlashFilledIcon } from "@/assets/img/svg/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/assets/img/svg/EyeFilledIcon";
import LOGO from "@/assets/img/svg/UPPRB_log.png";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSessionData } from "@/Utils/hook/useSessionData";
import OtpVerification from "@/components/Custom/otp-verification";
import PhoneVerification from "@/components/Custom/phone-verification";
import ResetPassword from "@/components/Custom/new-password";

const Login: React.FC = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm();
  const { sessionStatus } = useSessionData();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [platformData, setPlatformData] = useState<any>();
  const [showOtpForm, setShowOtpForm] = useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<boolean>(false);
  const [code, setCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getPlatformToken = async (): Promise<void> => {
    try {
      setLoading(true);
      const data: any = await CallPlatformToken("admin");

      if (data?.data) {
        setPlatformData((prevLoginData: any) => ({
          ...prevLoginData,
          platformName: "admin",
          platformToken: data?.data?.data[0]?.token,
          deviceDetail: window.navigator.userAgent,
        }));

        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleLogin = async (userData: any) => {
    try {
      setLoading(true);
      const formData = {
        ...platformData,
        userId: userData?.userId,
        password: userData?.password,
      };
      const data = await signIn("credentials", {
        ...formData,
        redirect: false,
        callbackUrl: "/superadmin",
      });
      if (data?.status === 200) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("loginStatus", "active");
        }
      }
      if (data?.error) {
        toast.error(data?.error);
        setLoading(false);
      }
    } catch (e) {
      if ((e as any)?.response?.data.status_code === 400) {
        console.log(e);
        setLoading(false);
      }
    }
  };

  const redirection = () => {
    if (sessionStatus === "authenticated") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    getPlatformToken();
  }, []);

  useEffect(() => {
    redirection();
  }, [sessionStatus]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const formData = {
        phone: phone,
      };
      setIsLoading(true);
      const { data, error } = (await CallSendOtp(formData)) as any;
      console.log("handleSendOtp", { data, error });
      if (data?.message) {
        toast.success(data?.message);
        setCode(data?.data?.code);
        setShowOtpForm(true);
        setIsLoading(false);
      }
      if (error) {
        toast.error(error);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetToLoginForm = () => {
    setShowOtpForm(false);
    setForgotPassword(false);
    setNewPassword(false);
    setCode("");
    setNewCode("");
    setPhone("");
  };

  const renderComponent = () => {
    if (newPassword) {
      return (
        <ResetPassword newCode={newCode} resetToLoginForm={resetToLoginForm} />
      );
    } else if (showOtpForm) {
      return (
        <OtpVerification
          code={code}
          setNewPassword={setNewPassword}
          setNewCode={setNewCode}
          handleSendOtp={handleSendOtp}
        />
      );
    } else if (forgotPassword) {
      return (
        <PhoneVerification
          setPhone={setPhone}
          handleSendOtp={handleSendOtp}
          isLoading={isLoading}
        />
      );
    } else {
      return (
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="mt-5 w-full p-4 md:p-8 mob:mt-0"
          autoComplete="new-login"
        >
          <Controller
            name="userId"
            control={control}
            rules={{
              required: "Username is required",
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                type="text"
                isRequired
                placeholder="Enter username"
                className="mb-5 border-black text-white caret-black"
                startContent={<EmailIcon />}
                autoComplete="new-username"
                label="Username"
                labelPlacement="outside"
                isInvalid={invalid}
                errorMessage={error?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                isRequired
                label="Password"
                labelPlacement="outside"
                placeholder="Enter password"
                startContent={<PasswordIcon />}
                autoComplete="new-password"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                    ) : (
                      <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                className="mb-5 rounded-md border-gray-400 text-white caret-black focus:border-white"
                isInvalid={invalid}
                errorMessage={error?.message}
              />
            )}
          />
          <div className="text-end">
            <Link
              href="#!"
              className="text-sm text-primary"
              onClick={() => {
                setForgotPassword(true);
              }}
            >
              Forgot Password
            </Link>
          </div>

          <Button
            type="submit"
            color="primary"
            variant="solid"
            className="login_btn mt-4 text-white"
            isLoading={loading}
          >
            Login
          </Button>
        </form>
      );
    }
  };

  return (

       <div className="Login_Wrapper flex h-full min-h-[100vh] w-full flex-col justify-center mob:px-5">
      <div className="mx-auto my-12 w-full overflow-hidden rounded-xl bg-white shadow-sm md:w-[500px] ">
        <div className="mb-6 flex flex-col gap-5 bg-primary-600 !py-5 px-4 text-white md:px-8 md:py-3">
          <div className="mx-auto max-h-[100px] min-h-[100px] min-w-[100px] max-w-[100px]">
            <Image
              src={LOGO}
              alt="logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-center text-lg font-medium md:text-xl">
              Central Electronics Limited
            </h1>
            <h2 className="mt-3 text-center text-lg font-medium md:text-xl">
              Venue Management System
            </h2>
          </div>
        </div>
        {renderComponent()}
      </div>
    </div>
  );
};
export default Login;
