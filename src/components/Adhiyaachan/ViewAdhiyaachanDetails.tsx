import { Input, Textarea } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Button, Chip } from "@nextui-org/react";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MessageBubbleLeft from "../kushal-components/MessageBubbleLeft";
import MessageBubbleRight from "../kushal-components/MessageBubbleRight";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import Image from "next/image";
import {
  CallGetAdhiyaachanAllMessages,
  CallGetAdhiyaachanById,
  CallSendMessageAdhiyaachan,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import FormSkeleton from "../kushal-components/loader/FormSkeleton";

interface InfoCardProps {
  isOpen: any;
  onOpenChange: any;
  id?: string;
}

type ChipColor =
  | "bg-blue-600"
  | "bg-rose-600"
  | "bg-amber-400"
  | "bg-fuchsia-600"
  | "bg-green-500"
  | "bg-purple-500"
  | undefined;

const ViewAdhiyaachanDetails: React.FC<InfoCardProps> = ({
  isOpen,
  onOpenChange,
  id,
}) => {
  const [loader, setLoader] = useState<any>({
    card: false,
    message: false,
  });
  const [allList, setAllList] = useState<any>();
  const [message, setMessage] = useState<any>("");
  const [chatMessages, setChatMessages] = useState<any>([]);

  const statusColorMap: { [key: string]: ChipColor } = {
    Pending: "bg-blue-600",
    Cancelled: "bg-rose-600",
    Ongoing: "bg-amber-400",
    release: "bg-fuchsia-600",
    Completed: "bg-green-500",
    Legal: "bg-purple-500",
  };

  const getAdhiyaachanById = async (id: any) => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    try {
      const { data, error } = (await CallGetAdhiyaachanById(id)) as any;
      console.log("AdhiyaachanbyIDdata", data);
      console.log("error", error);
      if (data?.data) {
        setAllList(data?.data);
      }
      if (error) {
        handleCommonErrors(Error);
      }
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    }
  };

  const getAllChat = async (id: any) => {
    setLoader((prev: any) => ({
      ...prev,
      chat: true,
    }));
    try {
      const { data, error } = (await CallGetAdhiyaachanAllMessages(id)) as any;
      if (data?.data) {
        setChatMessages(data?.data?.messages);
      }
      if (error) {
        handleCommonErrors(Error);
      }
      setLoader((prev: any) => ({
        ...prev,
        chat: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        chat: false,
      }));
    }
  };

  const sendMessage = async () => {
    setLoader((prev: any) => ({
      ...prev,
      message: true,
    }));
    const dto = {
      id: id,
      message: message,
    };
    try {
      const { data, error } = (await CallSendMessageAdhiyaachan(dto)) as any;
      if (data?.data) {
        setMessage("");
        getAllChat(id);
      }
      if (error) {
        handleCommonErrors(Error);
      }
      setLoader((prev: any) => ({
        ...prev,
        message: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        message: false,
      }));
    }
  };

  useEffect(() => {
    getAdhiyaachanById(id);
    getAllChat(id);
  }, [id]);

  const groupedMessages = chatMessages.reduce((acc: any, message: any) => {
    const date = moment(message.time).format("MM/DD/YYYY");
    if (!acc[date]) acc[date] = [];
    acc[date].push(message);
    return acc;
  }, {});
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        placement="top"
        className="min-h-[50rem] max-w-[100rem]"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="border-b">{allList?.title}</ModalHeader>
              <ModalBody className="p-0">
                {loader?.card ? (
                  <div className="p-6">
                    <FormSkeleton inputCount={8} />
                  </div>
                ) : (
                  <div className="grid grid-cols-4">
                    <div className="col-span-3 border-e p-6">
                      <Textarea
                        disabled={true}
                        radius="sm"
                        label="Description"
                        labelPlacement="outside"
                        placeholder={allList?.description}
                        classNames={{ label: "font-medium" }}
                      />

                      <div className="workflow_card_desc my-10 flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                          <div className="grid grid-cols-2">
                            <p className="font-medium">
                              <span className="material-symbols-rounded align-bottom">
                                tag
                              </span>{" "}
                              Reference number
                            </p>
                            <p>{allList?.referenceNumber}</p>
                          </div>

                          <div className="grid grid-cols-2">
                            <p className="font-medium">
                              <span className="material-symbols-rounded align-bottom">
                                circle
                              </span>{" "}
                              Status
                            </p>
                            <Chip
                              classNames={{
                                content: ["text-center", "text-white"],
                                base: [
                                  "border-none",
                                  `${statusColorMap[allList?.status]}`,
                                ],
                              }}
                              color="secondary"
                              variant="bordered"
                              radius="full"
                              size="md"
                            >
                              {allList?.status}
                            </Chip>
                          </div>

                          <div className="grid grid-cols-2">
                            <p className="font-medium">
                              <span className="material-symbols-rounded align-bottom">
                                calendar_today
                              </span>{" "}
                              Date of received
                            </p>
                            <p>
                              {moment(allList?.dateOfRecived).format(
                                "DD-MM-YYYY",
                              )}
                            </p>
                          </div>

                          <div className="grid grid-cols-2">
                            <p className="font-medium">
                              <span className="material-symbols-rounded align-bottom">
                                check_box_outline_blank
                              </span>{" "}
                              Stage
                            </p>
                            <Chip
                              classNames={{
                                content: ["text-center", "text-white"],
                                base: [
                                  "border-none",
                                  `${statusColorMap[allList?.stage]}`,
                                ],
                              }}
                              color="secondary"
                              variant="bordered"
                              radius="full"
                              size="md"
                            >
                              {allList?.stage}
                            </Chip>
                          </div>

                          <div className="grid grid-cols-2">
                            <p className="font-medium">
                              <span className="material-symbols-rounded align-bottom">
                                apartment
                              </span>{" "}
                              Department
                            </p>
                            <p>{allList?.departments_To_Sent}</p>
                          </div>
                        </div>
                      </div>

                      {allList?.attachments.length > 0 && (
                        <div>
                          <h1 className="mb-3 text-lg font-medium">
                            Attachments
                          </h1>

                          <div className="grid grid-cols-4 gap-4">
                            {allList?.attachments?.map((item: any) => (
                              <Link
                                key={item?._id}
                                href={item?.attachment}
                                target="_blank"
                              >
                                <div className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-gray-100 p-4">
                                  <Image
                                    src={pdf}
                                    alt="pdf"
                                    className="h-[30px] w-[30px]"
                                  />

                                  <span className="break-all text-xs font-medium leading-tight">
                                    {item?.fileName}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col-span-1">
                      <div className="border-b p-4 font-medium">Messages</div>

                      <div className="flex h-[620px] flex-col gap-3 overflow-scroll overflow-x-hidden p-4">
                        {Object.entries(groupedMessages).map(
                          ([date, messages]: any) => (
                            <div key={date}>
                              <div className="my-3 text-center">
                                <Chip
                                  size="sm"
                                  radius="sm"
                                  classNames={{
                                    content: "text-[12px] p-2 text-gray-600",
                                    base: "bg-slate-200",
                                  }}
                                >
                                  {moment(date).format("DD-MM-YYYY")}
                                </Chip>
                              </div>
                              {messages.map((item: any, index: number) =>
                                item?.messageType === "received" ? (
                                  <MessageBubbleLeft
                                    message={item}
                                    key={index}
                                  />
                                ) : (
                                  <MessageBubbleRight
                                    message={item}
                                    key={index}
                                  />
                                ),
                              )}
                            </div>
                          ),
                        )}
                      </div>

                      <div className="p-4">
                        <Input
                          type="text"
                          placeholder="Write a message..."
                          radius="full"
                          classNames={{ inputWrapper: "pe-1" }}
                          onChange={(e) => {
                            setMessage(e.target.value);
                          }}
                          value={message}
                          endContent={
                            <Button
                              color="success"
                              size="sm"
                              radius="full"
                              className="send_btn"
                              isLoading={loader?.message}
                              onPress={() => {
                                sendMessage();
                              }}
                            >
                              <span className="material-symbols-rounded">
                                send
                              </span>
                            </Button>
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewAdhiyaachanDetails;
