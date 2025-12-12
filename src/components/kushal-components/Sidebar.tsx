"use client";
import React from "react";
import Image from "next/image";
import LOGO from "../assets/img/upprpb-logo.jpg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSessionData } from "@/Utils/hook/useSessionData";

interface SidebarProps {
  show: boolean;
  renderHome: boolean;
  onSidebarToggle: (isOpens: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  show,
  onSidebarToggle,
  renderHome,
}) => {
  const location = usePathname();
  const { sessionStatus } = useSessionData();

  const [allSlideBar, setAllSlideBar] = useState<any>([]);

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
      <nav className={`sidebar ${isOpens ? "block" : "hidden"}`}>
        <button
          className="close_nav block lg:hidden"
          onClick={handleCloseSidebar}
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="main-logo">
          <Image
            src={LOGO}
            alt="Logo"
            className="h-[50px] w-[50px] min-w-[50px] overflow-hidden rounded-full"
          />
          <h6 className="logo_text">
            Uttar Pradesh Police Recruitment & Promotion Board
          </h6>
        </div>

        <ul className="menu-links">
          {allSlideBar.map((route: any, index: number) => (
            <React.Fragment key={index}>
              <li className="nav-link">
                <Link
                  className={`${
                    location?.split("/")[2] === route.path?.split("/")[1] &&
                    "active"
                  }`}
                  href={route.layout + route.path}
                  // onClick={closeCollapse}
                >
                  <div className="icon_box">
                    <span className="material-symbols-rounded">
                      {route.icon}
                    </span>
                  </div>
                  {route.name}
                </Link>
              </li>
              {location?.split("/")[2] === route.path?.split("/")[1] &&
                route.views?.map((i: any, idx: any) => (
                  <li key={idx} className="nav-link sub-nav-link">
                    <Link
                      className={`${
                        location?.split("/")[3] === i.path?.split("/")[1] &&
                        "sub-active"
                      }`}
                      href={i.layout + i.path}
                    >
                      {i.name}
                    </Link>
                  </li>
                ))}
            </React.Fragment>
          ))}

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
