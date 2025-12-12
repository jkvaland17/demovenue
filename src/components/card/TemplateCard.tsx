import Image from "next/image";
import React from "react";
import doc from "@/assets/img/test.png";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Interweave } from "interweave";

type Template = {
  title: String;
  content: any;
};

type Props = {
  template: Template;
};

const TemplateCard = ({ template }: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-white p-3 rounded-xl border flex gap-4 items-center justify-start h-fit"
      >
        <Image
          src={doc}
          alt="img"
          style={{ height: "40px", width: "40px", objectFit: "contain" }}
        />
        <h5 className="text-medium text-wrap text-start">{template?.title}</h5>
      </Button>

      <Modal
        placement="top"
        size="3xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="rounded-lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {template?.title}
              </ModalHeader>

              <ModalBody>{<Interweave content={template.content} />}</ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Edit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TemplateCard;
