import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const BackButton = (props: Props) => {
  const router = useRouter();

  return (
    <>
      <Button
        radius="full"
        className="font-medium mob:hidden mob:w-auto"
        onPress={() => {
          router.back();
        }}
        startContent={
          <span className="material-symbols-rounded">arrow_back</span>
        }
      >
        Go Back
      </Button>

      {/* ---------for-responsive------------ */}
      <Button
        isIconOnly
        radius="full"
        className="hidden font-medium mob:inline"
        onPress={() => {
          router.back();
        }}
        startContent={
          <span className="material-symbols-rounded">arrow_back</span>
        }
      ></Button>
    </>
  );
};

export default BackButton;
