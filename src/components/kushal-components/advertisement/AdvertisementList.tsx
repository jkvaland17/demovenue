import Image from "next/image";
import Link from "next/link";
import React from "react";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import { Tooltip } from "@nextui-org/tooltip";
import moment from "moment";

type Props = {
  item: any;
  listStyleColor?: string;
  title?: string;
};

export default function AdvertisementList({
  item,
  listStyleColor = "bg-[#f58020]",
  title,
}: Props) {
  return (
    <div className="mb-3 space-y-3 border-t py-4">
      {title && <h2 className="mb-3 text-lg font-semibold">{title}</h2>}
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {item.map((detail: any, index: number) => (
          <li key={index} className="group flex items-start space-x-3">
            <div
              className={`mt-2 h-2 min-h-2 w-2 min-w-2 rounded-full ${listStyleColor} transition-transform group-hover:scale-125`}
            />
            <div className="flex items-start gap-1">
              <span className="text-nowrap font-medium text-gray-600">
                {detail.label}:
              </span>{" "}
              {detail?.type === "document" ? ( //To render the document
                detail?.value.map((doc: any, key: number) => (
                  <Link key={key} href={doc?.file} target="_blank">
                    {doc?.file !== "" ? (
                      <Tooltip
                        content={moment(doc?.releaseDate).format("DD/MM/YYYY")}
                      >
                        <Image
                          src={pdf}
                          className="h-[30px] w-[30px] object-contain"
                          alt="pdf"
                        />
                      </Tooltip>
                    ) : (
                      "-"
                    )}
                  </Link>
                ))
              ) : detail?.type === "array" ? ( //To render array data
                <ul className="flex flex-wrap gap-2">
                  {detail?.value.map((name: any, key: number) =>
                    name?.showDetails ? ( //if array data contains link
                      <li key={key}>
                        <Link
                          href={"#"}
                          // className="text-blue-600 transition-all duration-250 hover:text-blue-500"
                        >
                          {key + 1}) {name.name}
                        </Link>
                      </li>
                    ) : (
                      <li key={key} className="text-gray-900">
                        {name.name}
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <span className="text-gray-900">{detail?.value}</span> //To render normal text data
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
