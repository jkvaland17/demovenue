import { Chip } from "@nextui-org/react";
import React from "react";
import FlatCard from "../FlatCard";
import moment from "moment";
import AdvertisementList from "./advertisement/AdvertisementList";
import AdvertisementTiles from "./advertisement/AdvertisementTiles";

const AdminEventCard = ({ item }: any) => {

  const details = [
    {
      label: "Adhiyachan Date",
      value: moment(item?.adhiyachanDate).format("DD-MM-YYYY"),
    },
    { label: "Number of Sports", value: item?.NumberOfSports },
    { label: "Number of Vacancies", value: item?.NumberOfVacancies },
    {
      label: "Notification Published",
      value: item?.NotificationPublishedOnWebsite,
    },
    { label: "Forms Invited From", value: item?.ApplicationFormsInvitedFrom },
    { label: "Application Mode", value: item?.ApplicationFromMode },
    { label: "Examination Mode", value: "Trial of Sports Event" },
    {
      label: "Adhiyachan Document",
      value: item?.attachments,
      type: "document",
    },
    {
      label: "Advertisement",
      value: item?.advertisement,
      type: "document",
    },
  ];

  const TeamDetails = [
    // {
    //   label: "No of Vacancy",
    //   value: "250",
    // },
    { label: "Number of Sports", value: item?.teamData?.expertiseData.length },
    {
      label: "Sports Name",
      value: item?.teamData?.expertiseData,
      type: "array",
    },
    {
      label: "Team Members",
      value: item?.teamData?.memberData,
      type: "array",
    },
  ];

  return (
    <FlatCard>
      <div className="flex justify-between gap-12 mob:flex-col items-start mob:gap-2">
        <div>
          <h1 className="mb-2 text-2xl font-semibold mob:text-lg">{item?.titleInHindi}</h1>
          <p className="font-medium">{item?.advertisementReferenceNumber}</p>
        </div>

        <div className="flex flex-col">
          <div className="ms-auto mob:m-0">
            {item?.status === "completed" ? (
              <Chip
                classNames={{ content: "text-green-700" }}
                color="success"
                variant="flat"
              >
                Completed
              </Chip>
            ) : (
              <div className="live_session_btn">
                <span className="material-symbols-outlined">circle</span>
                Live Advertisement
              </div>
            )}
          </div>

          <p className="mt-3 text-nowrap text-right text-sm font-medium mob:text-left mob:mb-2">
            Start date:{" "}
            <span className="font-bold">
              {moment(item?.releaseDate).format("DD-MM-YYYY")}
            </span>{" "}
            <br />
            End date: <span className="font-bold">{item?.endDate}</span>
          </p>
        </div>
      </div>

      {/* Advertisement Details */}
      <AdvertisementList item={details} listStyleColor="bg-[#f58020]" />

      {/* Team Details */}
      {item?.teamData && (
        <AdvertisementList
          item={TeamDetails}
          listStyleColor="bg-blue-500"
          title={`${item?.teamData?.groupData?.groupName} Details`}
        />
      )}

      {/* Advertisement Tiles */}
      <AdvertisementTiles item={item} />
    </FlatCard>
  );
};

export default AdminEventCard;
