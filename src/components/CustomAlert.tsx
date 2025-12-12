import React from "react";

const iconsMap = {
  success: "check_circle",
  danger: "cancel",
  warning: "warning",
};

type Props = {
  variant: "success" | "danger" | "warning";
  children: React.ReactNode;
};

const CustomAlert = ({ variant, children }: Props) => {
  return (
    <div className={`customAlert ${variant}`}>
      <span className="material-symbols-rounded">{iconsMap[variant]}</span>
      <div>{children}</div>
    </div>
  );
};

export default CustomAlert;
