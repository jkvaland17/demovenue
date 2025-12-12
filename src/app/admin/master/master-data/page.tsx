"use client";
import { CallGetAllCategories } from "@/_ServerActions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  Building2,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutGrid,
  MessageSquare,
  ScrollText,
  Users,
  Award,
  BriefcaseMedical,
  BookMinus,
  ShieldPlus,
  Laptop,
  MicVocal,
} from "lucide-react";
import { Button } from "@nextui-org/react";

function DashboardCardComponent() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allList, setAllList] = useState([]);
  const Auth: any = useSession();

  const getAllList = async () => {
    setIsLoading(true);
    const { data, error } = await CallGetAllCategories();
    console.log("data", { data, error });
    if (data) {
      const dataResponse = data as any;
      setAllList(dataResponse?.data as any);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllList();
  }, [Auth]);

  const getIconForCategory = (code: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      superSpeciality: <BriefcaseMedical />,
      courses: <BookMinus />,
      aps_grade: <ShieldPlus />,
      result: <Laptop />,
      announcement: <MicVocal />,
      advertisement: <ScrollText />,
      introduction: <BookOpen />,
      faqs: <HelpCircle />,
      speciality: <Award />,
      course: <GraduationCap />,
      department: <Building2 />,
      caste: <Users />,
      notification: <Bell />,
      grade: <FileText />,
      queries: <MessageSquare />,
      posts: <FileText />,
      results: <Award />,
      default: <LayoutGrid />,
    };
    return iconMap[code] || iconMap?.default;
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex flex-wrap justify-start gap-4 bg-gray-100 p-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-[19rem] animate-pulse rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col items-center">
                <div className="mb-3 h-12 w-12 rounded-lg bg-gray-200 p-3" />
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">All Master Data</p>
            <Button
              as={Link}
              href="/admin/master/master-data/add"
              color="primary"
              radius="sm"
              startContent={
                <span className="material-symbols-outlined">add_box</span>
              }
            >
              Create Master Categories
            </Button>
          </div>
          <div className="flex flex-wrap justify-start gap-4 bg-gray-100 p-5">
            {allList?.map((item: any) => (
              <Link
                href={`/admin/master/master-data/${item.code}`}
                key={item._id}
              >
                <div className="group w-[19rem] rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 rounded-lg bg-blue-50 p-3 transition-colors duration-200 group-hover:bg-blue-500">
                      <div className="h-6 w-6 text-blue-500 transition-colors duration-200 group-hover:text-white">
                        {getIconForCategory(item.code)}
                      </div>
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-gray-800">
                      {item.name}
                    </h3>
                    <p className="w-full truncate text-center text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardCardComponent;
