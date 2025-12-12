// "use client";

// import { useParams, useRouter } from "next/navigation";
// import {
//   Button,
//   Input,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalHeader,
//   useDisclosure,
// } from "@nextui-org/react";
// import React, { useEffect, useState } from "react";
// import FlatCard from "@/components/FlatCard";
// import {
//   CallGetCenterVerificationOfficers2,
//   CallUpdateCenterVerificationOfficers,
// } from "@/_ServerActions";
// import { handleCommonErrors } from "@/Utils/HandleError";
// import { useAdvertisement } from "@/components/AdvertisementContext";
// import Image from "next/image";
// import verified from "@/assets/img/icons/verified.png";
// import notVerified from "@/assets/img/icons/remove.png";
// import imageIcon from "@/assets/img/icons/image.png";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import locationIcon from "@/assets/img/icons/location.png";
// import { set } from "react-hook-form";

// type FieldBoxProps = {
//   field: any;
//   officerId: string;
//   centerId: string;
//   refresh: () => void;
// };

// type Props = {};

// const Verification = (props: Props) => {
//   const { id } = useParams();
//   const router = useRouter();
//   const { currentAdvertisementID } = useAdvertisement();
//   const [centerVerificationOfficers, setCenterVerificationOfficers] = useState<
//     any[]
//   >([]);
//   const [locationName, setLocationName] = useState<string>("");
//   const [latitude, setLatitude] = useState<string>("");
//   const [longitude, setLongitude] = useState<string>("");

//   const {
//     isOpen: isMap,
//     onOpen: onMap,
//     onOpenChange: onOpenMap,
//   } = useDisclosure();

//   const getCenterOfficers = async () => {
//     try {
//       const query = `advertisementId=${currentAdvertisementID}&centerId=${id}`;
//       const { data, error } = (await CallGetCenterVerificationOfficers2(
//         query,
//       )) as any;
//       console.log("getCenterOfficers", { data, error });

//       if (data) {
//         setCenterVerificationOfficers(data?.data);
//       }
//       if (error) {
//         handleCommonErrors(error);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     if (currentAdvertisementID) {
//       getCenterOfficers();
//     }
//   }, []);
//   useEffect(() => {
//     if (currentAdvertisementID) {
//       getCenterOfficers();
//     }
//   }, [currentAdvertisementID]);

//   return (
//     <>
//       <div className="mb-4 flex justify-between gap-12">
//         <h2 className="mb-4 text-xl font-semibold">Center Verification</h2>
//         <Button
//           radius="full"
//           className="font-medium"
//           onPress={() => {
//             router.back();
//           }}
//           startContent={
//             <span className="material-symbols-rounded">arrow_back</span>
//           }
//         >
//           Go Back
//         </Button>
//       </div>

//       {centerVerificationOfficers?.map((officer) => (
//         <FlatCard key={officer?._id}>
//           <div className="mb-6 flex justify-between">
//             <div>
//               <h1 className="text-xl font-semibold">
//                 {officer?.user?.name} ({officer?.user?.userId})
//               </h1>
//               <p className="text-slate-500">{officer?.user?.role?.title}</p>
//             </div>
//             <Image
//               src={locationIcon}
//               alt="Location"
//               className="h-[35px] w-[35px] cursor-pointer object-contain"
//               onClick={() => {
//                 setLocationName(officer?.location[0]?.address);
//                 setLatitude(officer?.location[0]?.latitude);
//                 setLongitude(officer?.location[0]?.longitude);
//                 onMap();
//               }}
//             />
//           </div>
//           <div className="grid grid-cols-4 mob:grid-cols-1 tab:grid-cols-3">
//             {officer?.fields?.map((field: any) => (
//               <FieldBox
//                 centerId={id.toString()}
//                 officerId={officer?._id}
//                 field={field}
//                 key={field?.key}
//                 refresh={getCenterOfficers}
//               />
//             ))}
//           </div>
//         </FlatCard>
//       ))}

//       <Modal isOpen={isMap} onOpenChange={onOpenMap} size="3xl">
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="flex flex-col gap-1">
//                 {locationName}
//               </ModalHeader>
//               <ModalBody>
//                 <iframe
//                   src={`https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`}
//                   width="100%"
//                   height="450"
//                   style={{ border: 0 }}
//                   allowFullScreen
//                   loading="lazy"
//                   referrerPolicy="no-referrer-when-downgrade"
//                   className="mb-4"
//                 ></iframe>
//               </ModalBody>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// const FieldBox = ({ field, officerId, centerId, refresh }: FieldBoxProps) => {
//   const [isAccepting, setIsAccepting] = useState<boolean>(false);
//   const [isRejecting, setIsRejecting] = useState<boolean>(false);

//   const updateCenterVerificationOfficers = async (
//     keyName: string,
//     actionType: string,
//   ) => {
//     if (actionType === "accept") {
//       setIsAccepting(true);
//     }
//     if (actionType === "reject") {
//       setIsRejecting(true);
//     }

//     try {
//       const submitData = {
//         keyName,
//         id: officerId,
//         center: centerId,
//       };
//       console.log("submitData", submitData);
//       const { data, error } = (await CallUpdateCenterVerificationOfficers(
//         submitData,
//       )) as any;
//       console.log("updateCenterVerificationOfficers", { data, error });

//       if (data) {
//         toast?.success(data?.message);
//         refresh();
//       }
//       if (error) {
//         handleCommonErrors(error);
//       }
//     } catch (error) {
//       console.log(error);
//     }

//     if (actionType === "accept") {
//       setIsAccepting(false);
//     }
//     if (actionType === "reject") {
//       setIsRejecting(false);
//     }
//   };

//   return (
//     <div
//       className={`border p-4 ${field?.isVerified !== null && field?.isVerified === false && "bg-red-100"}`}
//     >
//       <div className="mb-3 flex justify-between gap-4 border-b pb-3">
//         <p className="mt-auto text-sm">{field?.title}</p>
//         {field?.isVerified !== null && (
//           <Image
//             src={field?.isVerified ? verified : notVerified}
//             alt="verified"
//             className="h-[25px] w-[25px]"
//           />
//         )}
//       </div>

//       {field?.value && (
//         <Input value={field?.value} className="mb-4" radius="sm" isReadOnly />
//       )}

//       {field?.key == "room_wise_seating_capacity" ? (
//         <>
//           {field?.room_wise_seating_capacity?.map(
//             (room: any, index: number) => {
//               const shortage =
//                 parseInt(room?.requiredCctvCount) -
//                 (room?.functionalCctvCount
//                   ? parseInt(room?.requiredCctvCount)
//                   : 0);

//               return (
//                 <div
//                   key={room.id}
//                   className="mb-6 rounded-lg border bg-white p-4 shadow-sm"
//                 >
//                   <div className="mb-4 grid grid-cols-2 gap-4">
//                     <Input
//                       type="text"
//                       label="Room number"
//                       value={room?.roomNumber}
//                       isReadOnly
//                       labelPlacement="outside"
//                       radius="sm"
//                       variant="flat"
//                     />
//                     <Input
//                       type="number"
//                       label="Raw Capacity"
//                       value={room?.rawCapacity}
//                       isReadOnly
//                       labelPlacement="outside"
//                       radius="sm"
//                       variant="flat"
//                     />
//                   </div>

//                   <div className="mb-4 flex flex-col gap-4">
//                     <Input
//                       type="number"
//                       label="Allocated Capacity"
//                       value={room?.allocatedCapacity}
//                       isReadOnly
//                       labelPlacement="outside"
//                       radius="sm"
//                       variant="flat"
//                     />
//                     <Input
//                       type="number"
//                       label="Functional CCTV"
//                       value={room?.functionalCctvCount}
//                       isReadOnly
//                       labelPlacement="outside"
//                       radius="sm"
//                       variant="flat"
//                     />
//                   </div>

//                   <div className="mt-2 text-sm">
//                     <p className="text-green-600">
//                       Required CCTV: {room?.requiredCctvCount}
//                     </p>
//                     <p className="text-red-500">
//                       Shortage: {shortage > 0 ? shortage : 0}
//                     </p>
//                   </div>

//                   {/* Optional: Show photos if available */}
//                   <div className="mt-4 flex gap-2 overflow-auto">
//                     {room.photos?.map((photoUrl: string, i: number) => (
//                       <Link href={photoUrl} key={i} target="_blank">
//                         <Image
//                           src={imageIcon}
//                           alt={`Photo ${i + 1}`}
//                           className="h-[45px] w-[45px] object-contain"
//                         />
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               );
//             },
//           )}
//         </>
//       ) : (
//         <div>
//           {field?.subFields?.length > 0 && (
//             <div className="grid grid-cols-1 gap-4">
//               {field.subFields.map((subField: any, index: number) => {
//                 if (subField?.type === "image") {
//                   return (
//                     <Link href={subField?.value} key={index}>
//                       <Image
//                         src={imageIcon}
//                         alt={subField?.label}
//                         className="h-[45px] w-[45px] object-contain"
//                       />
//                     </Link>
//                   );
//                 } else if (subField?.type === "performance_report") {
//                   {
//                     const shortage =
//                       parseInt(subField?.required) -
//                       (subField?.value ? parseInt(subField?.required) : 0);

//                     return (
//                       <div
//                         key={index}
//                         className="mb-3 rounded-lg border bg-white p-4 shadow-sm"
//                       >
//                         <Input
//                           type="number"
//                           label={subField?.label}
//                           value={subField?.value}
//                           isReadOnly
//                           labelPlacement="outside"
//                           placeholder=" "
//                           radius="sm"
//                           variant="flat"
//                         />

//                         <div className="mt-2 text-sm">
//                           <p className="text-green-600">
//                             Required CCTV: {subField?.required || 0}
//                           </p>
//                           <p className="text-red-500">
//                             Shortage: {shortage > 0 ? shortage : 0}
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   }
//                 }

//                 return (
//                   <Input
//                     label={subField?.label}
//                     labelPlacement="outside"
//                     value={subField?.value}
//                     placeholder=" "
//                     radius="sm"
//                     key={index}
//                     isReadOnly
//                   />
//                 );
//               })}
//             </div>
//           )}

//           {field?.isVerified !== null && field?.isVerified === false && (
//             <div className="grid grid-cols-2 gap-3 pt-4">
//               <Button
//                 onPress={() =>
//                   updateCenterVerificationOfficers(field?.key, "reject")
//                 }
//                 radius="sm"
//                 color="danger"
//                 isLoading={isRejecting}
//                 startContent={
//                   !isRejecting && (
//                     <span className="material-symbols-rounded">close</span>
//                   )
//                 }
//               >
//                 Reject
//               </Button>
//               <Button
//                 onPress={() =>
//                   updateCenterVerificationOfficers(field?.key, "accept")
//                 }
//                 radius="sm"
//                 color="success"
//                 className="text-white"
//                 isLoading={isAccepting}
//                 startContent={
//                   !isAccepting && (
//                     <span className="material-symbols-rounded">check</span>
//                   )
//                 }
//               >
//                 Approve
//               </Button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Verification;
