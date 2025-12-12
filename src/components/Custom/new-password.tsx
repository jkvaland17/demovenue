import { CallResetPassword } from "@/_ServerActions";
import { EyeFilledIcon } from "@/assets/img/svg/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/assets/img/svg/EyeSlashFilledIcon";
import PasswordIcon from "@/assets/img/svg/Password";
import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  newCode: string;
  resetToLoginForm?: () => void;
}

const ResetPassword: React.FC<Props> = ({ newCode, resetToLoginForm }) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    code: newCode,
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const handleUpdateAdminPassword = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data, error } = (await CallResetPassword(formData)) as any;
      console.log("resetpassword", { data, error });
      if (data?.message) {
        toast.success(data?.message);
        setIsLoading(false);
        if (resetToLoginForm) {
          resetToLoginForm();
        }
      }
      if (data?.error) {
        toast.error(data?.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold">Reset Password</h2>
        </div>
        <form onSubmit={handleUpdateAdminPassword}>
          <Input
            type={isVisible ? "text" : "password"}
            label="Enter Password"
            placeholder="Enter Password"
            isRequired
            errorMessage={"Please Enter Password"}
            labelPlacement="outside"
            radius="sm"
            className="mb-5"
            classNames={{
              inputWrapper: "w-full",
            }}
            startContent={<PasswordIcon />}
            value={formData?.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
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
          />
          <Input
            type={isConfirmPasswordVisible ? "text" : "password"}
            label="Enter New Password"
            placeholder="Enter New Password"
            isRequired
            errorMessage={"Please Enter New Password"}
            labelPlacement="outside"
            radius="sm"
            className="mb-5"
            startContent={<PasswordIcon />}
            classNames={{
              inputWrapper: "w-full",
            }}
            value={formData?.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                aria-label="toggle password visibility"
              >
                {isConfirmPasswordVisible ? (
                  <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
          />
          <Button
            isLoading={isLoading}
            type="submit"
            color="primary"
            variant="shadow"
            className="w-full py-6"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
