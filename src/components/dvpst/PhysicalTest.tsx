import { CallUpdateDVPSTPhysicalStanderdTest } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Button, Chip, Input } from "@nextui-org/react";
import moment from "moment";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Image from "next/image";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

type PST = {
  isOpen: boolean;
  onOpenChange: () => void;
  selectedUserDetails: any;
  statusColorMap: Record<string, ChipColor>;
  onClose: () => void;
  GetApplicationData: any;
};

function PhysicalTest({
  isOpen,
  onOpenChange,
  selectedUserDetails,
  statusColorMap,
  GetApplicationData,
  onClose,
}: PST) {
  const { control, handleSubmit, setValue } = useForm();
  const [loader, setLoader] = useState<any>({
    pst: false,
  });

  const gender = selectedUserDetails?.admitCardDetails?.gender?.toLowerCase();

  const physicalRequirements = [
    {
      icon: "accessibility_new",
      label: "Minimum Height required",
      value: gender === "female" ? "152 CMS" : "168 CMS",
    },
    ...(gender === "female"
      ? [
          {
            icon: "accessibility_new",
            label: "Minimum Weight required",
            value: "40 KG",
          },
        ]
      : []),
    ...(gender !== "female"
      ? [
          {
            icon: "accessibility_new",
            label: "Minimum chest Un-Expanded required",
            value: "79 CMS",
          },
          {
            icon: "accessibility_new",
            label: "Minimum chest Expansion required",
            value: "5 CMS",
          },
        ]
      : []),
  ];

  const PSTUserDetails = [
    {
      icon: "person",
      label: "Registration ID",
      value: "applicationDetails.register",
    },
    { icon: "person", label: "Roll No.", value: "admitCardDetails.rollNo" },
    {
      icon: "person",
      label: "Candidate Name",
      value: "applicationDetails.personalDetails.fullName",
    },
    {
      icon: "person",
      label: "Gender",
      value: "applicationDetails.personalDetails.gender",
    },
    {
      icon: "calendar_today",
      label: "Date of Birth",
      value: "personalDetails.dateOfBirth",
      isDate: true,
    },
  ];

  const UpdatePhysicalStandardTest = async (dto: any) => {
    const PSTUpdatedData = {
      ...dto,
      gender,
      _id: selectedUserDetails?._id,
    };
    // console.log("PSTUpdatedData", PSTUpdatedData);
    setLoader((prev: any) => ({
      ...prev,
      pst: true,
    }));
    try {
      const { data, error } = (await CallUpdateDVPSTPhysicalStanderdTest(
        PSTUpdatedData,
      )) as any;
      console.log("CallUpdateDVPSTPhysicalStanderdTest", data, error);
      if (data?.message) {
        toast.success(data?.message);
        GetApplicationData(false);
        onClose();
        handleCloseModel();
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        pst: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        pst: false,
      }));
    }
  };

  const handleCloseModel = () => {
    const newArray = [
      "pstHeight",
      "pstChestUnExpanded",
      "pstChestExpansion",
      "pstWeight",
    ];
    newArray.forEach((item: string) => {
      setValue(item, "");
    });
  };
  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Physical Standard Test
              </ModalHeader>
              <ModalBody className="mob:px-4">
                <Image
                  height={80}
                  width={80}
                  src={selectedUserDetails?.applicationDetails?.photograph}
                  alt="userImage"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <div className="flex gap-2">
                  <p className="font-medium">Document Verification Status: </p>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={
                      statusColorMap[
                        selectedUserDetails?.applicationStatus || "Pending"
                      ]
                    }
                    classNames={{ content: "capitalize" }}
                  >
                    {selectedUserDetails?.applicationStatus || "Pending"}
                  </Chip>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-6 mob:grid-cols-1">
                  <div className="grid grid-cols-1 gap-2">
                    <h5 className="font-bold">Candidate details</h5>
                    <div className="grid grid-cols-2 gap-6">
                      <p className="font-medium">
                        <span className="material-symbols-rounded me-2 align-bottom">
                          person
                        </span>
                        Registration ID
                      </p>
                      <p className="uppercase">
                        {" "}
                        {selectedUserDetails?.applicationDetails?.register}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <p className="font-medium">
                        <span className="material-symbols-rounded me-2 align-bottom">
                          person
                        </span>
                        Roll No.
                      </p>
                      <p className="uppercase">
                        {selectedUserDetails?.admitCardDetails?.rollNo}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <p className="font-medium">
                        <span className="material-symbols-rounded me-2 align-bottom">
                          person
                        </span>
                        Candidate Name
                      </p>
                      <p className="uppercase">
                        {
                          selectedUserDetails?.applicationDetails
                            ?.personalDetails?.fullName
                        }
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <p className="font-medium">
                        <span className="material-symbols-rounded me-2 align-bottom">
                          person
                        </span>
                        Gender
                      </p>
                      <p className="uppercase">
                        {
                          selectedUserDetails?.applicationDetails
                            ?.personalDetails?.gender
                        }
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <p className="font-medium">
                        <span className="material-symbols-rounded me-2 align-bottom">
                          calendar_today
                        </span>
                        Date of Birth
                      </p>
                      <p>
                        {moment(
                          selectedUserDetails?.personalDetails?.dateOfBirth,
                        ).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <h5 className="font-bold">PST Requirement Details</h5>
                    {physicalRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-5">
                        <p className="w-[300px] font-medium">
                          <span className="material-symbols-rounded me-2 align-bottom">
                            {requirement.icon}
                          </span>
                          {requirement.label}
                        </p>
                        <span className="font-bold">:</span>
                        <p>{requirement.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(UpdatePhysicalStandardTest)}
                  className="mt-6 grid grid-cols-3 gap-6 mob:mt-10"
                >
                  <Controller
                    name="pstHeight"
                    control={control}
                    // rules={{
                    //   required: "Height is Required",
                    //   min: {
                    //     value: 168,
                    //     message: "Height should be at least 168 CMS",
                    //   },
                    // }}
                    render={({ fieldState: { invalid, error }, field }) => (
                      <Input
                        {...field}
                        isRequired
                        label="Height (CMS)"
                        labelPlacement="outside"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        placeholder="Enter height (CMS)"
                      />
                    )}
                  />

                  {selectedUserDetails?.applicationDetails?.personalDetails
                    ?.gender === "male" ? (
                    <>
                      <Controller
                        name="pstChestUnExpanded"
                        control={control}
                        // rules={{
                        //   required: "Un-Expanded Chest size is Required",
                        //   min: {
                        //     value: 79,
                        //     message:
                        //       "Un-Expanded Chest size should be at least 79 CMS",
                        //   },
                        // }}
                        render={({ fieldState: { invalid, error }, field }) => (
                          <Input
                            {...field}
                            isRequired
                            label="Chest Un-Expanded (CMS)"
                            labelPlacement="outside"
                            isInvalid={invalid}
                            errorMessage={error?.message}
                            placeholder="Enter Un-Expanded Chest (CMS)"
                          />
                        )}
                      />

                      <Controller
                        name="pstChestExpansion"
                        control={control}
                        // rules={{
                        //   required: "Expanded Chest size is Required",
                        //   min: {
                        //     value: 5,
                        //     message: "Expanded Chest size should be at least 5 CMS",
                        //   },
                        // }}
                        render={({ fieldState: { invalid, error }, field }) => (
                          <Input
                            {...field}
                            isRequired
                            label="Chest Expansion (CMS)"
                            labelPlacement="outside"
                            isInvalid={invalid}
                            errorMessage={error?.message}
                            placeholder="Enter Chest Expansion (CMS)"
                          />
                        )}
                      />
                    </>
                  ) : selectedUserDetails?.applicationDetails?.personalDetails
                      ?.gender === "female" ? (
                    <Controller
                      name="pstWeight"
                      control={control}
                      // rules={{
                      //   required: "Expanded Chest size is Required",
                      //   min: {
                      //     value: 5,
                      //     message: "Expanded Chest size should be at least 5 CMS",
                      //   },
                      // }}
                      render={({ fieldState: { invalid, error }, field }) => (
                        <Input
                          {...field}
                          isRequired
                          label="Weight (KG)"
                          labelPlacement="outside"
                          isInvalid={invalid}
                          errorMessage={error?.message}
                          placeholder="Enter Chest Expansion (CMS)"
                        />
                      )}
                    />
                  ) : (
                    ""
                  )}

                  <Button
                    color="primary"
                    type="submit"
                    className="col-span-3 mb-3"
                    isLoading={loader?.pst}
                  >
                    submit
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default PhysicalTest;
