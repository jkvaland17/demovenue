"use client";
import SearchIcon from "@/assets/img/svg/Search";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

interface CommonHeaderActionsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  createButtonText: string;
  route: string;
  basePath?: string; // Optional base path for the "Go Back" button
}

const CommonHeaderActions: React.FC<CommonHeaderActionsProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  createButtonText,
  route,
  basePath = "/admin/master/master-data",
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-x-4">
      <Input
        variant="bordered"
        type="search"
        placeholder={searchPlaceholder}
        labelPlacement="outside"
        startContent={<SearchIcon />}
        className="w-full md:wUs-96 mb-3 md:mb-0"
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onSearchChange(e.target.value)
        }
      />
      <div className="flex flex-col md:flex-row md:items-center justify-center mb-5 gap-4">
        <Button
          href={`/admin/master/master-data/${route}/add`}
          as={Link}
          type="button"
          className="rounded-lg"
          color="primary"
        >
          <i className="fa-solid fa-plus" />
          {createButtonText}
        </Button>
        <Button
          as={Link}
          href={basePath}
          type="button"
          className="rounded-lg"
          variant="flat"
        >
          <i className="fa-solid fa-arrow-left mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default CommonHeaderActions;