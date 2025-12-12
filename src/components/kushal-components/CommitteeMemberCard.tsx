import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";

const CommitteeMemberCard = ({ item, openModal, modalType }: any) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="bg-gray-100 p-4 rounded-xl">
        <div className="flex justify-between gap-8">
          <h1 className="font-semibold text-lg">{item?.name}</h1>

          <Dropdown placement="bottom-end" className="transparent_trigger">
            <DropdownTrigger>
              <Button className="min-w-fit more_btn h-fit">
                <span className="material-symbols-rounded">more_horiz</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="view" onPress={onOpen}>
                View
              </DropdownItem>
              <DropdownItem
                key="edit"
                onPress={() => {
                  openModal();
                  modalType("edit");
                }}
              >
                Edit
              </DropdownItem>
              <DropdownItem key="celete" color="danger" className="text-danger">
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <p className="text-slate-500">{item?.designation}</p>
      </div>

      <Modal isOpen={isOpen} size="3xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Committee Member Details
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex">
                    <div>
                      <span
                        className="material-symbols-rounded align-bottom me-2"
                        style={{ color: "rgb(100 116 139)" }}
                      >
                        person
                      </span>
                    </div>
                    <div className="font-semibold">Fullname </div>
                  </div>
                  <p className="font-medium">
                    <span className="font-medium -ms-6 me-6">:</span>John Doe
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex">
                    <div>
                      <span
                        className="material-symbols-rounded align-bottom me-2"
                        style={{ color: "rgb(100 116 139)" }}
                      >
                        apartment
                      </span>
                    </div>
                    <div className="font-semibold">Organization Name </div>
                  </div>
                  <p className="font-medium">
                    <span className="font-medium -ms-6 me-6">:</span>XYZ
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex">
                    <div>
                      <span
                        className="material-symbols-rounded align-bottom me-2"
                        style={{ color: "rgb(100 116 139)" }}
                      >
                        business_center
                      </span>
                    </div>
                    <div className="font-semibold">Designation Name </div>
                  </div>
                  <p className="font-medium">
                    <span className="font-medium -ms-6 me-6">:</span>XYZ
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex">
                    <div>
                      <span
                        className="material-symbols-rounded align-bottom me-2"
                        style={{ color: "rgb(100 116 139)" }}
                      >
                        star
                      </span>
                    </div>
                    <div className="font-semibold">Expertise </div>
                  </div>
                  <p className="font-medium">
                    <span className="font-medium -ms-6 me-6">:</span>
                    Sub-Inspector (SI)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex">
                    <div>
                      <span
                        className="material-symbols-rounded align-bottom me-2"
                        style={{ color: "rgb(100 116 139)" }}
                      >
                        mail
                      </span>
                    </div>
                    <div className="font-semibold">Email </div>
                  </div>
                  <p className="font-medium">
                    <span className="font-medium -ms-6 me-6">:</span>
                    example@example.com
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex">
                    <div>
                      <span
                        className="material-symbols-rounded align-bottom me-2"
                        style={{ color: "rgb(100 116 139)" }}
                      >
                        call
                      </span>
                    </div>
                    <div className="font-semibold">Phone </div>
                  </div>
                  <p className="font-medium">
                    <span className="font-medium -ms-6 me-6">:</span>9876543210
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={onClose}
                  className="w-full bg-black text-white"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommitteeMemberCard;
