import { Tooltip } from "@nextui-org/tooltip";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

type Props = {
  item: any;
};

export default function AdvertisementTiles({ item }: Props) {
  const { data: session, update: sessionUpdate } = useSession() as any;

  const cardStatus: any = {
    live: "bg-[#f58020]",
    pending: "bg-blue-500",
    completed: "bg-green-600",
  };

  const handleCardClick = (id: string, tile: string) => {
    let newSession = session?.user;
    newSession.data.advertisementId = id;
    newSession.data.selectedTile = tile;
    sessionUpdate(newSession);
  };

  return (
    <div className="my-3 grid grid-cols-2 gap-4 mob:grid-cols-1 lg:grid-cols-5">
      {item?.tilesDetails?.map((stats: any, index: number) => (
        <Link
          key={index}
          className={"cursor-pointer"}
          href={`/admin/kushal-khiladi/kushal-all-exams/${stats?.key}`}
          onClick={() => {
            handleCardClick(item?._id, stats?.key);
          }}
        >
          <div
            className={`flex h-full flex-col justify-between rounded-xl p-4 text-white ${cardStatus[stats?.status]} transition-all duration-200 ease-linear hover:scale-105`}
          >
            <p className="mb-3 font-medium capitalize">{stats?.title}</p>
            <ul className="flex justify-between gap-5 border-t-1 border-white">
              <li className="mt-1 space-x-3">
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-white">
                    Sports
                  </span>{" "}
                  <Tooltip
                    content={stats?.sportsToolTip}
                    showArrow={true}
                    isDisabled={!stats?.sportsToolTip}
                    className="w-[200px]"
                  >
                    <span className="text-[15px] text-white">
                      {stats?.sportsCount}
                    </span>
                  </Tooltip>
                </div>
              </li>
              <li className="mt-1 space-x-3">
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-white">
                    Candidate
                  </span>{" "}
                  <Tooltip
                    content={stats?.candidateToolTip}
                    showArrow={true}
                    isDisabled={!stats?.candidateToolTip}
                    className="w-[200px]"
                  >
                    <span className="text-[15px] text-white">
                      {stats?.candidateCount}
                    </span>
                  </Tooltip>
                </div>
              </li>
            </ul>
          </div>
        </Link>
      ))}
    </div>
  );
}
