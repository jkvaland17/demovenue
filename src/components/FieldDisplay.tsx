import Image from "next/image";
import Link from "next/link";
import imageIcon from "@/assets/img/icons/common/image.png";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import DpcModalTable from "./DpcModalTable";
import { useState } from "react";

interface FieldProps {
  field: any;
}

const FieldDisplay: React.FC<FieldProps> = ({ field }) => {
  const [modalHeading, setModalHeading] = useState<string>("");
  const [currentColumns, setCurrentColumns] = useState<
    { title: string; key: string }[]
  >([]);
  const [currentRows, setCurrentRows] = useState<any[]>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const labColumns = [
    {
      key: "labNumber",
      title: "Lab no.",
    },
    {
      key: "numberOfSystems",
      title: "No. of Systems",
    },
    {
      key: "photos",
      title: "Photos",
    },
  ];

  const handleModalTable = (
    columns: { title: string; key: string }[],
    rows: any[],
    heading: string,
  ) => {
    setModalHeading(heading);
    setCurrentColumns(columns);
    setCurrentRows(rows);
    onOpen();
  };

  const getFieldContent = (field: any) => {
    switch (field?.type) {
      case "image":
        return field?.value !== "NA"
          ? field?.value?.map((image: string, index: number) => (
              <Link href={image} target="_blank" key={index}>
                <Image
                  src={imageIcon}
                  className="h-[30px] w-[30px] cursor-pointer object-contain"
                  alt="pdf"
                />
              </Link>
            ))
          : "NA";

      case "custom":
        // return field?.key === "lab_systems" ? (
        //   <Button
        //     color="primary"
        //     onClick={() => {
        //       handleModalTable(labColumns, field?.value, "Lab Systems");
        //     }}
        //   >
        //     View Details
        //   </Button>
        // ) : (
        //   "NA"
        // );

        return <p>NA</p>;

      case "multiple_option":
        return field?.value && Array.isArray(field?.value) ? (
          <div className="flex flex-wrap gap-2">
            {field?.value.map((val: string, index: number) => {
              const title =
                field?.options?.find((opt: any) => opt.key === val)?.title ||
                "NA";
              return (
                <Chip key={index} color="secondary" variant="flat">
                  {title}
                </Chip>
              );
            })}
          </div>
        ) : (
          "NA"
        );

      case "radio":
      case "option":
        return (
          <p className="capitalize">
            {field?.options?.find((opt: any) => opt.key === field.value)
              ?.title || "NA"}
          </p>
        );

      default:
        return <p className="capitalize">{field?.value}</p>;
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-x-6">
        <div className="font-medium">{field?.title}</div>
        <div className="flex">
          <span className="me-4">:</span>
          {getFieldContent(field)}
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalHeading}
              </ModalHeader>
              <ModalBody>
                <DpcModalTable
                  columnsArray={currentColumns}
                  rowsArray={currentRows}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
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

export default FieldDisplay;
