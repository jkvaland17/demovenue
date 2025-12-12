"use client";
import CardGrid from "@/components/kushal-components/CardGrid";
import FlatCard from "@/components/FlatCard";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CallGetKushalExaminationStatistics } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import CardSkeleton from "@/components/kushal-components/loader/CardSkeleton";

const KushalHome = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [allStats, setAllStats] = useState<any>([]);
  const [selectedYear, setSelectedYear] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const getKushalStats = async () => {
    setLoading(true);
    try {
      const { data, error } =
        (await CallGetKushalExaminationStatistics()) as any;
      if (data) {
        setAllStats(data?.data);
      }
      if (error) {
        handleCommonErrors(Error);
      }
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getKushalStats();
  }, [selectedYear]);
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-2 mob:flex-col">
        <h1 className="text-2xl font-semibold mob:text-xl">
          Recruitment of Skilled Sports Person
        </h1>
        <Select
          className="max-w-sm"
          classNames={{
            trigger: "bg-white",
          }}
          items={[
            {
              name: "Recruitment of Skilled Sports Person 2023",
              key: "23",
            },
            // {
            //   name: "Recruitment of Skilled Sports Person 2024-25",
            //   key: "24",
            // },
            // {
            //   name: "Recruitment of Skilled Sports Person 2025-26",
            //   key: "25",
            // },
            // {
            //   name: "Recruitment of Skilled Sports Person 2026-27",
            //   key: "26",
            // },
          ]}
          selectedKeys={[selectedYear]}
          labelPlacement="outside"
          placeholder="Year"
          onChange={(e) => {
            setSelectedYear(e?.target?.value);
          }}
        >
          {(item) => <SelectItem key={item.key}>{item.name}</SelectItem>}
        </Select>
      </div>
      <FlatCard>
        <div className="flex justify-between gap-12 mob:flex-col mob:gap-0">
          <h1 className="mb-6 text-2xl font-semibold mob:text-lg">
            Overview of All Completed Recruitments for Skilled Sports Person
          </h1>

          <Link href={`/admin/kushal-khiladi/kushal-all-exams`}>
            <div className="live_session_btn_kushal">
              <span className="material-symbols-outlined">circle</span>
              Status of Live Examinations
            </div>
          </Link>
        </div>

        {loading ? (
          <CardSkeleton cardsCount={9} columns={3} />
        ) : (
          <CardGrid data={allStats} columns={3} color="primary" />
        )}
      </FlatCard>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                New Recruitment of Skilled sportsmen/sports women
              </ModalHeader>
              <ModalBody className="flex flex-col gap-6">
                <Select
                  label="Select advertisement"
                  labelPlacement="outside"
                  placeholder="Select"
                  isRequired
                >
                  <SelectItem key="data">data</SelectItem>
                </Select>
                <Input
                  type="text"
                  label="Recruitment name"
                  labelPlacement="outside"
                  placeholder="Enter recruitment name"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                  isRequired
                />
                <Input
                  type="date"
                  label="Recruitment start date"
                  labelPlacement="outside"
                  placeholder=" "
                />
                <Input
                  type="date"
                  label="Recruitment target date"
                  labelPlacement="outside"
                  placeholder=" "
                />
                <Select
                  label="Status"
                  labelPlacement="outside"
                  placeholder="Select"
                  isRequired
                >
                  <SelectItem key="data">data</SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button className="w-full bg-black text-white">Submit</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default KushalHome;
