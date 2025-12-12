"use client";
import React from "react";
import Image from "next/image";
import LOGO from "@/assets/img/svg/UPPRB_log.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import toast from "react-hot-toast";
import {
  CallGetPermissionByUserId,
  CallPlatformToken,
  CallSendOtp,
  CallVerifyOtp,
} from "@/_ServerActions";
import { Input } from "@nextui-org/input";
import PhoneIcon from "@/assets/img/svg/Phone";
import EmailIcon from "@/assets/img/svg/Email";
import { Button, Skeleton } from "@nextui-org/react";
import OtpIcon from "@/assets/img/svg/Otp";
import PasswordIcon from "@/assets/img/svg/Password";
import { EyeSlashFilledIcon } from "@/assets/img/svg/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/assets/img/svg/EyeFilledIcon";
import { handleCommonErrors } from "@/Utils/HandleError";
import { useSessionData } from "@/Utils/hook/useSessionData";

interface SidebarProps {
  show: boolean;
  onSidebarToggle: (isOpens: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ show, onSidebarToggle }) => {
  const location = usePathname();
  const { sessionStatus, isPasswordUpdated, role, _id, selectedModule } =
    useSessionData();
  const [loading, setLoading] = useState(false);

  const [allSlideBar, setAllSlideBar] = useState<any>([]);
  const [forgotPassword1, setForgotPassword1] = useState(true);
  const [disableResendOtp, setDisableResendOtp] = useState(false);
  const [otpVerifyForm, setOTPVerifyForm] = useState(false);
  const [token, setToken] = useState("");
  const [timerCount, setTimerCount] = useState(30);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isVisible1, setIsVisible1] = React.useState(false);
  const [errors, setErrors] = useState<any>({});

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibility1 = () => setIsVisible1(!isVisible1);
  const [verifyOtp, setVerifyOtp] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
    captcha: "",
    platformName: "admin",
    platformToken: "",
    deviceDetail: "",
  });

  const [sendOtp, setSendOtp] = useState({
    phone: "",
    email: "",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const getPlatformToken = async (): Promise<void> => {
    try {
      setLoading(true);

      const data: any = await CallPlatformToken("admin");

      if (data?.data) {
        setLoginData((prevLoginData) => ({
          ...prevLoginData,
          platformToken: data?.data?.data[0]?.token,
          deviceDetail: window.navigator.userAgent,
        }));
        setLoading(false);
      }
    } catch (err) {
      // console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlatformToken();
  }, []);

  useEffect(() => {
    if (role && isPasswordUpdated === false) {
      onOpen();
    }
  }, [role]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerCount > 0) {
        setTimerCount(timerCount - 1);
        setDisableResendOtp(true);
      } else {
        setDisableResendOtp(false);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timerCount]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const Data = {
        phone: sendOtp.phone,
        email: sendOtp.email,
        platformName: "web",
        platformToken: loginData.platformToken,
      };
      const data = (await CallSendOtp(Data)) as any;
      if (data.data) {
        setToken(data?.data?.token);
        setForgotPassword1(false);
        setOTPVerifyForm(true);

        setTimerCount(30);
        toast.success("OTP sent successfully to mobile & email");
        setLoading(false);
      }
      // console.log(data.error);
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newErrors = {} as any;

      if (!verifyOtp.password || verifyOtp.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
      }

      if (verifyOtp.password !== verifyOtp.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setLoading(true);

      const Data = {
        otp: verifyOtp.otp,
        token,
        password: verifyOtp.password,
      };

      const data = (await CallVerifyOtp(Data)) as any;
      if (data.data?.message === "Password reset successfully") {
        setOTPVerifyForm(false);
        toast.success("Password reset successfully you have to login now", {
          duration: 5000,
        });
        setTimeout(() => {
          signOut();
        }, 4000);

        setLoading(false);
      }

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      }
    } catch (e) {
      // console.log(e);
      setLoading(false);
    }
  };

  const handleChangeVerifyOtp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newErrors = {} as any;
    if (name === "otp" && value.length > 6) {
      newErrors.otp = "OTP cannot exceed 6 digits";
      setErrors(newErrors);
    } else {
      newErrors.otp = "";
      setErrors(newErrors);
      setVerifyOtp({ ...verifyOtp, [name]: value });
    }
  };
  const handleChangeSendOtp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSendOtp({ ...sendOtp, [name]: value });
  };

  useEffect(() => {
    if (_id) {
      getData();
    }
  }, [_id]);

  // Example Usage

  const getData = async () => {
    const query = `id=${_id}&moduleKey=${selectedModule}`;
    try {
      setLoading(true);
      const { data, error } = (await CallGetPermissionByUserId(query)) as any;
      if (data?.data) {
        const filterData = data?.data?.routes
          .filter((item: any) => item.show)
          .map((item: any) => ({
            ...item,
            views: item.views
              ? item.views.filter((view: any) => view.show)
              : [],
          }));
        setAllSlideBar(filterData || []);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoading(false);
    } catch (error) {
      console.log("error::: ", error);
      setLoading(false);
    }
  };

  const [isOpens, setIsOpen] = useState<boolean>(show);
  const handleResize = () => {
    if (window.innerWidth <= 991) {
      setIsOpen(false);
      onSidebarToggle(false);
    }
  };
  useEffect(() => {
    handleResize(); // Set the initial state based on the initial screen size
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    setIsOpen(show);
  }, [show, sessionStatus]);
  const handleCloseSidebar = () => {
    setIsOpen(false);
    onSidebarToggle(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        size={"2xl"}
        onOpenChange={onOpenChange}
        placement="top-center"
        isDismissable={false}
        hideCloseButton
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {`It's mandatory to Change your password to proceed.`}
              </ModalHeader>
              {forgotPassword1 && (
                <>
                  <form
                    onSubmit={handleSendOtp}
                    className="mt-3 w-full"
                    autoComplete="new-login"
                  >
                    <ModalBody>
                      <Input
                        type="text"
                        name="phone"
                        isRequired
                        placeholder="Enter mobile number"
                        onChange={handleChangeSendOtp}
                        startContent={<PhoneIcon />}
                        className="mb-5 border-white text-white caret-black"
                        size="lg"
                        autoComplete="new-username"
                      />
                      <Input
                        isRequired
                        name="email"
                        placeholder="Enter email"
                        size="lg"
                        startContent={<EmailIcon />}
                        autoComplete="new-password"
                        type={"email"}
                        onChange={handleChangeSendOtp}
                        className="mb-5 rounded-md border-gray-400 text-white caret-black focus:border-white"
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        isLoading={loading}
                        type="submit"
                        fullWidth
                        color="primary"
                        size="lg"
                        className="mt-4 rounded-md"
                      >
                        Send OTP
                      </Button>
                    </ModalFooter>
                  </form>{" "}
                </>
              )}

              {otpVerifyForm && (
                <>
                  <form
                    onSubmit={handleChangePassword}
                    className="mt-3 w-full"
                    autoComplete="new-login"
                  >
                    <ModalBody>
                      <Input
                        type="number"
                        name="otp"
                        isRequired
                        placeholder="Enter otp"
                        startContent={<OtpIcon />}
                        onChange={handleChangeVerifyOtp}
                        maxLength={6}
                        className="mb-5 border-white text-white caret-black"
                        size="lg"
                        autoComplete="new-username"
                      />
                      {errors.otp && (
                        <p className="mb-2 text-sm text-red-500">
                          {errors.otp}
                        </p>
                      )}
                      <Input
                        isRequired
                        name="password"
                        placeholder="Enter password"
                        startContent={<PasswordIcon />}
                        size="lg"
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
                        onChange={handleChangeVerifyOtp}
                        className="mb-5 rounded-md border-gray-400 text-white caret-black focus:border-white"
                      />{" "}
                      {errors.password && (
                        <p className="mb-2 text-sm text-red-500">
                          {errors.password}
                        </p>
                      )}
                      <Input
                        isRequired
                        name="confirmPassword"
                        placeholder="Enter confirm password"
                        startContent={<PasswordIcon />}
                        size="lg"
                        autoComplete="new-password"
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility1}
                            aria-label="toggle password visibility"
                          >
                            {isVisible1 ? (
                              <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                            ) : (
                              <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                            )}
                          </button>
                        }
                        type={isVisible1 ? "text" : "password"}
                        onChange={handleChangeVerifyOtp}
                        className="mb-5 rounded-md border-gray-400 text-white caret-black focus:border-white"
                      />
                      {errors.confirmPassword && (
                        <p className="mb-2 text-sm text-red-500">
                          {errors.confirmPassword}
                        </p>
                      )}
                      {timerCount === 0 ? (
                        <Button
                          disabled={disableResendOtp}
                          onClick={handleSendOtp}
                          style={{ width: "120px", float: "right" }}
                        >
                          Resend OTP
                        </Button>
                      ) : (
                        <p className="text-end text-primary">
                          Resend OTP in {`${timerCount}`} secs
                        </p>
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        isLoading={loading}
                        type="submit"
                        fullWidth
                        color="primary"
                        size="lg"
                        className="mt-4 rounded-md"
                      >
                        Verify OTP
                      </Button>
                    </ModalFooter>
                  </form>{" "}
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>

      <nav className={`sidebar ${isOpens ? "block" : "hidden"}`}>
        <button
          className="close_nav block lg:hidden"
          onClick={handleCloseSidebar}
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="main-logo">
          {/* <Image src={LOGO} alt="Logo" width={50} height={50} /> */}
          <h6 className="logo_text">
            {" "}
            Demo
          </h6>
        </div>

        <ul className="menu-links my-2">
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 10 }).map((_, index: number) => (
                <Skeleton
                  key={index}
                  className="h-8 w-full rounded-lg border-none !bg-[#556883]"
                />
              ))}
            </div>
          ) : (
            allSlideBar.map((route: any, index: number) => {
              if (route?.show) {
                return (
                  <React.Fragment key={index}>
                    <li className="nav-link my-1">
                      <Link
                        className={`${
                          location?.split("/")[3] ===
                            route.path?.split("/")[1] && "active"
                        }`}
                        href={
                          route.views?.length > 0
                            ? route.views[0].layout + route.views[0].path
                            : route.layout + route.path
                        }
                        // href={route.layout + route.path}
                      >
                        <div className="icon_box">
                          <span className="material-symbols-rounded">
                            {route.icon}
                          </span>
                        </div>
                        {route.name}
                      </Link>
                    </li>
                    {location?.split("/")[3] === route.path?.split("/")[1] &&
                      route.views?.map((i: any, idx: any) => {
                        if (i?.show && i.name !== "Vender Dashboard") {
                          return (
                            <li key={idx} className="nav-link sub-nav-link">
                              <Link
                                className={`${
                                  location?.split("/")[4] ===
                                    i.path?.split("/")[1] && "sub-active"
                                }`}
                                href={i.layout + i.path}
                              >
                                {i.name}
                              </Link>
                            </li>
                          );
                        }
                      })}
                  </React.Fragment>
                );
              }
            })
          )}

          {/* <li className="nav-link lg_btn mb-2">
            <Link href={"/admin"}>
              <div className="icon_box">
                <span className="material-symbols-rounded">home</span>
              </div>
              Home
            </Link>
          </li> */}
          <li className="nav-link lg_btn">
            <Link
              href={"/"}
              onClick={() => {
                signOut();
                sessionStorage.clear();
              }}
            >
              <div className="icon_box">
                <span className="material-symbols-rounded">logout</span>
              </div>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
export default Sidebar;
