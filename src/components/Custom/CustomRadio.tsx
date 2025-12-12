import { cn, useRadio } from "@nextui-org/react";
import React from "react";

type CustomRadioProps = {
  [key: string]: any;
};

export const CustomRadio: React.FC<CustomRadioProps> = (props: any) => {
  const {
    Component,
    children,
    getBaseProps,
    getLabelProps,
    getLabelWrapperProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group flex items-center justify-center hover:opacity-70 active:opacity-50 tap-highlight-transparent",
        "w-16  h-16   cursor-pointer border-2 border-default rounded-lg",
        "data-[selected=true]:border-primary",
      )}
    >
      <div {...getLabelWrapperProps()} className="m-0">
        {children && <span {...getLabelProps()}>{children}</span>}
      </div>
    </Component>
  );
};
