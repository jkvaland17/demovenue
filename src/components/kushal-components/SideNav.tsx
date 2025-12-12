"use client";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {};

const SideNav = ({ data }: any) => {
  const router = useRouter();
  const [show, setShow] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [links, setLinks] = useState([
    { title: "Dashboard", url: "/admin/admin-dashboard/adhiyaachan-dashboard" },
    {
      title: "Adhiyaachan Submission",
      url: "/admin/admin-dashboard/adhiyaachan-submission",
    },
    {
      title: "Adhiyaachan Table",
      url: "/admin/admin-dashboard/adhiyaachan-table",
    },
    {
      title: "Adhiyaachan Approval Workflow",
      url: "/admin/admin-dashboard/adhiyaachan-approval-workflow",
    },
    {
      title: "Official Advertisement Release",
      url: "/admin/advertisement/official-advertisement-release",
    },
    {
      title: "Content/Details of Advertisement",
      url: "/admin/advertisement/advertisement-details",
    },
    {
      title: "Advertisement Table",
      url: "/admin/admin-dashboard/advertisement-table",
    },
  ]);

  const handleNavigation = (url: string, index: number) => {
    setActiveIndex(index);
    router.push(url);
  };

  return (
    <div
      className={`bg-white p-4 min-h-screen h-full shadow-md w-fit ${show && "min-w-[300px] w-[300px] max-w-[300px]"} sticky`}
      style={{ top: 0 }}
    >
      <div className="flex mb-4">
        <Button
          onPress={() => setShow(!show)}
          variant="light"
          className="p-0 min-w-fit aspect-square ms-auto"
        >
          <span className="material-symbols-rounded font-bold">
            {show
              ? "keyboard_double_arrow_left"
              : "keyboard_double_arrow_right"}
          </span>
        </Button>
      </div>

      {show && (
        <div className="flex flex-col">
          {data?.map((item: any, index: any) => (
            <Button
              key={index}
              onPress={() => handleNavigation(item?.url, index)}
              variant="light"
              className={`min-w-full w-fit h-fit py-3 font-semibold justify-start text-left !text-wrap ${activeIndex === index && "bg-black text-white h-fit py-3"}`}
            >
              {activeIndex === index && (
                <span className="material-symbols-rounded">chevron_right</span>
              )}
              {item?.title}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SideNav;
