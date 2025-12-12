import { Chip, Tooltip } from "@nextui-org/react";
import React from "react";
import Link from "next/link";
import moment from "moment";
import FlatCard from "./FlatCard";

const PromotionCard = ({ item }: any) => {
  return (
    <FlatCard>
      <div className="flex justify-between gap-12">
        <div>
          <h1 className="mb-2 text-2xl font-semibold">
            {item?.titleInEnglish} <br />
            {item?.advertisementNumberInHindi}
          </h1>
          <p className="font-medium">{item?.advertisementReferenceNumber}</p>
        </div>

        <div className="flex flex-col">
          <div className="ms-auto">
            {item?.status === "completed" ? (
              <Chip
                classNames={{ content: "text-green-700" }}
                color="success"
                variant="flat"
              >
                Completed
              </Chip>
            ) : (
              <div className="live_session_btn">
                <span className="material-symbols-outlined">circle</span>
                Live Advertisement
              </div>
            )}
          </div>

          <p className="mt-3 text-nowrap text-right text-sm font-medium">
            Start date:{" "}
            <span className="font-bold">
              {moment(item?.releaseDate).format("DD-MM-YYYY")}
            </span>{" "}
            <br />
            End date:{" "}
            <span className="font-bold">
              {moment(item?.endDate).format("DD-MM-YYYY")}
            </span>
          </p>
        </div>
      </div>

      <div className="my-3 space-y-3 border-b border-t py-4">
        <ul className="grid grid-cols-1 gap-4">
          <li className="group flex items-start space-x-3">
            <div className="mt-2 h-2 w-2 rounded-full bg-[#f58020] transition-transform group-hover:scale-125" />
            <div>
              <span className="font-medium text-gray-600">
                Adhiyachan Date:
              </span>{" "}
              <span className="text-gray-900">
                {moment(item?.adhiyachanDate).format("DD-MM-YYYY")}
              </span>
            </div>
          </li>
          <li className="group flex items-start space-x-3">
            <div className="mt-2 h-2 w-2 rounded-full bg-[#f58020] transition-transform group-hover:scale-125" />
            <div>
              <span className="font-medium text-gray-600">
                Number of Vacancies:
              </span>{" "}
              <span className="text-gray-900">{item?.NumberOfVacancies}</span>
            </div>
          </li>
          <li className="group flex items-start space-x-3">
            <div className="mt-2 h-2 w-2 rounded-full bg-[#f58020] transition-transform group-hover:scale-125" />
            <div>
              <span className="font-medium text-gray-600">
                Post of the Promotion:
              </span>{" "}
              <span className="text-gray-900">{item?.advertisementNumberInHindi}</span>
            </div>
          </li>
          <li className="group flex items-start space-x-3">
            <div className="mt-2 h-2 w-2 rounded-full bg-[#f58020] transition-transform group-hover:scale-125" />
            <div>
              <span className="font-medium text-gray-600">
                Mode of Promotion Processes:
              </span>{" "}
              <span className="text-gray-900">{item?.ApplicationFromMode}</span>
            </div>
          </li>
        </ul>
      </div>

      {/* card */}

      <div className="grid grid-cols-7 gap-4 mob:grid-cols-2">
        {item?.tilesDetails?.map((stats: any, index: number) => (
          <Link
            href={
              stats?.route
                ? stats?.route
                : `/admin/promotion-management/promotion/all-promotions/${stats?.key}/${item?._id}`
            }
            key={stats?.title}
          >
            <>
              {stats?.postValue ? (
                <Tooltip
                  showArrow={true}
                  key={index}
                  content={
                    <div className="px-1 py-2">
                      <ul>
                        <li className="group flex items-start space-x-3">
                          <div className="mt-2 h-2 w-2 rounded-full bg-green-600 transition-transform group-hover:scale-125" />
                          <div>
                            <span className="font-medium text-gray-600">
                              Constable:
                            </span>{" "}
                            <span className="text-gray-900">
                              {stats?.postValue?.constable}
                            </span>
                          </div>
                        </li>
                        <li className="group flex items-start space-x-3">
                          <div className="mt-2 h-2 w-2 rounded-full bg-green-600 transition-transform group-hover:scale-125" />
                          <div>
                            <span className="font-medium text-gray-600">
                              Sub-Inspector (SI):
                            </span>{" "}
                            <span className="text-gray-900">
                              {stats?.postValue?.si}
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  }
                >
                  <div
                    className={`flex h-full flex-col rounded-xl p-4 text-white ${stats?.status === "live" ? "bg-[#3b82f5]" : "bg-green-600"}`}
                  >
                    <p className="mb-3 text-sm font-medium capitalize">
                      {stats?.title}
                    </p>
                    <p className="mt-auto border-t-2 pt-2 text-sm">
                      {stats?.value}
                    </p>
                  </div>
                </Tooltip>
              ) : (
                <div
                  className={`flex h-full flex-col rounded-xl p-4 text-white ${stats?.status === "live" ? "bg-[#3b82f5]" : "bg-green-600"}`}
                >
                  <p className="mb-3 text-sm font-medium capitalize">
                    {stats?.title}
                  </p>
                  <p className="mt-auto border-t-2 pt-2 text-sm">
                    {stats?.value}
                  </p>
                </div>
              )}
            </>
          </Link>
        ))}
      </div>
    </FlatCard>
  );
};

export default PromotionCard;
