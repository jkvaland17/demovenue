import { Spinner } from "@nextui-org/react";
import React from "react";

const ScreenLoader = () => {
  return (
    <div className="absolute mt-44 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#ffffff71] w-full z-50">
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    </div>
  );
};

export default ScreenLoader;
