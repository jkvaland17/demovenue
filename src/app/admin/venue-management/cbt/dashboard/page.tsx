import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import React from "react";

type Props = {};

const VenueDashboard = (props: Props) => {
  const cardData = [
    {
      title: "Total District",
      value: 0,
      link: "#",
    },
    {
      title: "Verified",
      value: 0,
      link: "#",
    },
    {
      title: "Unmatched",
      value: 0,
      link: "#",
    },
    {
      title: "Pending",
      value: 0,
      link: "#",
    },
  ];

  return (
    <FlatCard heading="Dashboard">
      <CardGrid columns={4} data={cardData} />
    </FlatCard>
  );
};

export default VenueDashboard;
