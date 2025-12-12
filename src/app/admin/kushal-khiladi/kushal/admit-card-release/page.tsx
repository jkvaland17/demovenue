"use client";
import React from "react";
import EventVenue from "@/components/kushal-components/EventVenue";
import VenueAllocation from "@/components/kushal-components/VenueAllocation";
import ReleaseAdmitCard from "@/components/kushal-components/ReleseAdmitCard";

const AdminCardRelease = () => {
  return (
    <>
      <EventVenue />

      <VenueAllocation />

      <ReleaseAdmitCard />
    </>
  );
};

export default AdminCardRelease;
