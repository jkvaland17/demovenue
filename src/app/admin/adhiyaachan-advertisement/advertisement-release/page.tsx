"use client";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Divider,
} from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import Link from "next/link";

type Props = {};

const AdvertisementRelease = (props: Props) => {
  return (
    <div>
      <div className="border border-slate-200 rounded-3xl px-4 md:px-8 p-6 md:py-10 mb-8 bg-white">
        <h1 className="font-semibold text-xl md:text-3xl mb-12">
          Advertisement Release
        </h1>

        <div className="flex justify-between items-center">
          <h3 className="font-medium text-xl">
            Official Advertisement Release
          </h3>
          <Link href={`/admin/advertisement/official-advertisement-release`}>
            <Button variant="bordered" className="px-24 border">
              Add
            </Button>
          </Link>
        </div>
        <Divider className="h-[0.5px] bg-slate-200 my-8" />
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-xl">
            Content/Details of Advertisement
          </h3>
          <Link href={`/admin/advertisement/advertisement-details`}>
            <Button variant="bordered" className="px-24 border">
              Add
            </Button>
          </Link>
        </div>
      </div>

      <div className="border border-slate-200 rounded-3xl px-4 md:px-8 py-6 md:py-8 mb-8 bg-white">
        <h1 className="font-semibold text-xl md:text-3xl mb-12">
          Advertisement Release
        </h1>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-xl">
              Official Advertisement Release
            </h3>
            <p>
              Upload on: <span>dd/mm/yyyy</span>
            </p>
          </div>

          <p className="mb-4">
            Direct recruitment to the posts of Computer Operator Grade-A-2023
          </p>
          <p className="mb-6">
            कम्प्यूटर ऑपरेटर ग्रेड-ए के पदों पर सीधी भर्ती-2023
          </p>

          <div className="flex justify-between">
            <Button variant="bordered" className="px-32">
              Edit{" "}
              <span className="material-symbols-rounded font-light text-slate-400">
                edit
              </span>
            </Button>
            <Button variant="bordered" className="px-32">
              View{" "}
              <Image
                src={pdf}
                style={{ height: "25px", width: "25px", objectFit: "contain" }}
                alt="pdf"
              />
            </Button>
          </div>
        </div>

        <Divider className="h-[0.5px] bg-slate-200 my-8" />

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-xl">
              Official Advertisement Release
            </h3>
            <p>
              Upload on: <span>dd/mm/yyyy</span>
            </p>
          </div>

          <p className="mb-4">
            Direct recruitment to the posts of Computer Operator Grade-A-2023
          </p>
          <p className="mb-6">
            कम्प्यूटर ऑपरेटर ग्रेड-ए के पदों पर सीधी भर्ती-2023
          </p>

          <div className="flex justify-between">
            <Button variant="bordered" className="px-32">
              Edit{" "}
              <span className="material-symbols-rounded font-light text-slate-400">
                edit
              </span>
            </Button>
            <Button variant="bordered" className="px-32">
              View{" "}
              <Image
                src={pdf}
                style={{ height: "25px", width: "25px", objectFit: "contain" }}
                alt="pdf"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementRelease;
