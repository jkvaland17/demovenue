"use client";
import { Chip } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import HeadingCard from "./HeadingCard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { handleCommonErrors } from "@/Utils/HandleError";
import { CallGetPermissionByUserId } from "@/_ServerActions";
import CardSkeleton from "./loader/CardSkeleton";

const AdminDashboard = ({ userName }: any) => {
  const router = useRouter();
  const { data: session, update: sessionUpdate } = useSession() as any;
  const designation = session?.user?.data?.designation;
  const [loading, setLoading] = useState<boolean>(false);
  const [quickAccessCards, setQuickAccessCards] = useState<any>([]);
  const [sportsData, setSportsData] = useState<any>([]);
  const iconBgColor = [
    "bg-gradient-to-tr from-emerald-700 to-emerald-400",
    "bg-gradient-to-tr from-gray-700 to-gray-400",
    "bg-gradient-to-tr from-blue-700 to-blue-400",
    "bg-gradient-to-tr from-rose-700 to-rose-400",
  ];
  const handleCardClick = (
    key: string,
    link: string,
    advertisementKey: string,
    moduleName: string,
  ) => {
    let newSession = session?.user;
    newSession.data.module = key;
    newSession.data.moduleName = moduleName;
    newSession.data.courseId = advertisementKey;
    sessionUpdate(newSession);
    router.push(link);
  };

  const getData = async () => {
    const query = `id=${session?.user?.data?._id}&moduleKey=`;
    try {
      setLoading(true);
      const { data, error } = (await CallGetPermissionByUserId(query)) as any;
      if (data) {
        setQuickAccessCards(data?.data?.dashboardModules);
        setSportsData(data?.data?.sportData);
      }

      if (error) {
        handleCommonErrors(error);
      }
      setLoading(false);
    } catch (error) {
      console.log("error::: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.data?._id) {
      getData();
    }
  }, [session?.user?.data?._id]);

  return (
    <div className="min-h-[100vh] p-10 mob:px-4">
      <HeadingCard
        sports={sportsData}
        heading={userName}
        welcome={true}
        designation={designation}
      />
      {loading ? (
        <CardSkeleton cardsCount={12} columns={4} />
      ) : (
        <div className="my-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quickAccessCards?.map((item: any, index: number) => (
            <Link
              href={item?.link}
              key={item?._id}
              onClick={() => {
                handleCardClick(
                  item?.key,
                  item?.link,
                  item?.advtKey,
                  item?.title,
                );
              }}
            >
              <div className="relative flex h-full">
                <div className="flex w-full max-w-full flex-col break-words rounded-lg bg-white text-gray-800 shadow-lg transition-all duration-700 hover:shadow-none">
                  <div className="px-3 py-1">
                    <div
                      className={`absolute -mt-8 h-16 w-16 rounded-xl ${iconBgColor[index % iconBgColor.length]} flex items-center justify-center text-white shadow-lg`}
                    >
                      <span
                        className="material-symbols-rounded text-4xl"
                        style={{ color: "white" }}
                      >
                        {item?.icon}
                      </span>
                    </div>
                  </div>
                  {userName === "Additional Secretary Recruitment" && (
                    <Chip
                      classNames={{
                        base: "bg-red-500",
                      }}
                      color="danger"
                      variant="shadow"
                      className="absolute -right-6 -top-2 me-4 ms-auto"
                    >
                      {item?.notificationCount}
                    </Chip>
                  )}

                  <div className="p-4 pt-12">
                    <div className="flex gap-2 font-medium">
                      <div>{index + 1}.</div>
                      <div>{item?.title}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
