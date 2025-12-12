import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import pdf from "@/assets/img/icons/common/pdf-icon.png";

interface Message {
  name: string;
  message: string;
  time: string;
  messageType: string;
}
interface MessageBubbleLeftProps {
  message: Message;
}

const MessageBubbleRight: React.FC<MessageBubbleLeftProps> = ({
  message,
}: any) => {
  return (
    <div className="text-right ms-auto">
      <p className="text-xs text-green-600 text-right font-medium mt-5 capitalize">
        {message?.name}
      </p>
      <div className="p-3 mt-1 rounded-2xl rounded-tr-none border border-slate-300 text-sm w-fit ms-auto">
        {message?.message}
      </div>
      <div className="w-[50%] ms-auto my-2">
        {message?.attachement?.map((item: any) => (
          <Link key={item?._id} href={item?.fileUrl} target="_blank">
            <div className="bg-gray-100 border border-gray-300 rounded-2xl p-4 flex gap-2 items-center">
              <Image src={pdf} alt="pdf" className="h-[30px] w-[30px]" />

              <span className="text-xs font-medium leading-tight">
                {item?.fileName}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <p className="text-[9px] text-slate-400 text-end">
        {moment(message?.time).format("LT")}
      </p>
    </div>
  );
};

export default MessageBubbleRight;
