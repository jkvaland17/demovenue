// import Notification from "@/assets/img/svg/Notification";
// import Setting from "@/assets/img/svg/Setting";
// import { Button } from "@nextui-org/react";
import { useSessionData } from "@/Utils/hook/useSessionData";
import { Button, Tooltip } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface NavbarProps {
  title?: string;
  name?: string;
  onData: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onData }) => {
  const [search, setSearch] = useState<boolean>(false);
  const { moduleName, userName, designation } = useSessionData();
  const router = useRouter();

  const sendDataToParent = () => {
    onData(); // Pass the new state to the parent
  };

  const toggleActive = () => {
    setSearch((prev) => !prev);
  };

  return (
    <nav className="navBar border-gray-200 shadow-lg">
      <div className="navbarWrap mx-auto flex w-full flex-wrap items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <button
            onClick={sendDataToParent}
            className="menu_button align-center text-md flex pe-4 text-white"
          >
            <span className="material-symbols-rounded">menu</span>
          </button>
          <div>
            <p className="hidden text-2xl text-white md:block">
              {userName}{" "}
              {designation && (
                <span className="text-sm font-bold text-gray-300">
                  ({designation})
                </span>
              )}
            </p>
            <span className="align-top text-sm text-gray-400">
              {moduleName}
            </span>
          </div>
        </div>
        <div className="flex md:order-2">
          <div className="flex items-center gap-2 md:gap-4">
            <Tooltip
              content={"Home"}
              showArrow
              color="primary"
              placement="left"
            >
              <Button
                radius="full"
                isIconOnly
                startContent={
                  <span className="material-symbols-rounded">home</span>
                }
                onPress={() => {
                  router.replace(`/admin`);
                }}
              />
            </Tooltip>

            <Button
              radius="full"
              isIconOnly
              startContent={
                <span className="material-symbols-rounded">logout</span>
              }
              onPress={() => signOut()}
            />
          </div>
        </div>
      </div>
      <div
        className={`searchBarWrapperOuter relative mx-auto mb-2 w-80 ${search ? "block" : "hidden"}`}
      >
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <svg
            className="h-4 w-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">Search icon</span>
        </div>
        <input
          autoComplete="off"
          type="text"
          id="search-navbar"
          className="block w-full rounded-full bg-[#f5f7fa] p-2 ps-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Search..."
        />
      </div>
      {/* <p className="font-medium text-white text-2xl w-80 mx-auto block md:hidden">
        {title} {name}
      </p> */}
    </nav>
  );
};

export default Navbar;
