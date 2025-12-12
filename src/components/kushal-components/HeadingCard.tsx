import { Button } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/skeleton";
import { signOut } from "next-auth/react";
import React from "react";

type Props = {
  welcome?: boolean;
  heading: string;
  sports?: any;
  designation?: string;
};

const HeadingCard = ({ welcome, heading, sports, designation }: Props) => {
  return (
    <div className="flex justify-between gap-2 rounded-2xl bg-white p-6 text-center shadow-md mob:flex-col">
      <div className="w-full">
        {welcome && <p className="font-medium">Welcome!</p>}
        {heading ? (
          <h1 className="text-2xl font-semibold mob:text-xl">
            {heading}{" "}
            {designation && (
              <span className="text-xs text-gray-500">({designation})</span>
            )}
          </h1>
        ) : (
          <Skeleton className="mt-2 h-8 w-1/2 rounded-3xl" />
        )}
        {sports &&
          sports.map((item: any, index: number) => (
            <span key={index} className="text-sm text-gray-500">
              {item?.name}{" "}
            </span>
          ))}
      </div>

      <Button
        startContent={<span className="material-symbols-rounded">logout</span>}
        variant="shadow"
        color="primary"
        className="px-10"
        href={""}
        onPress={() => {
          signOut();
          sessionStorage.clear();
        }}
      >
        Log Out
      </Button>
    </div>
  );
};

export default HeadingCard;
