import { cn, Radio } from "@nextui-org/react";

export const InterviewCustomRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between shadow-lg border border-3 w-full min-w-full",
          "flex-row-reverse  cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
      }}
    >
      <div>{children}</div>
    </Radio>
  );
};
