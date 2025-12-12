import moment from "moment";
import Link from "next/link";
import React from "react";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import Image from "next/image";

interface Message {
  name: string;
  message: string;
  time: string;
  messageType: string;
}
interface MessageBubbleLeftProps {
  message: Message;
}

const MessageBubbleLeft: React.FC<MessageBubbleLeftProps> = ({
  message,
}: any) => {
  return (
    <div className="text-left me-auto">
      <p className="text-[11px] text-green-600 font-medium capitalize">
        {message?.name}
      </p>
      <div className="p-3 my-2 rounded-2xl rounded-ss-none bg-slate-100 text-sm w-fit">
        {message?.message}
      </div>
      <div className="w-[50%] me-auto my-2">
        {message?.attachement?.map((item: any) => (
          <Link key={item?._id} href={item?.fileUrl} target="_blank">
            <div className="bg-gray-100 border border-gray-300 rounded-2xl p-4 flex gap-2 items-center">
              <Image src={pdf} alt="pdf" className="h-[30px] w-[30px]" />

              <span className="text-xs font-medium leading-tight break-all">
                {item?.fileName}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <p className="text-[9px] text-slate-400">
        {moment(message?.time).format("LT")}
      </p>
    </div>
  );
};

export default MessageBubbleLeft;
