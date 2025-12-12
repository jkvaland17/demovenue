"use client";

import { useSession } from "next-auth/react";

export const useSessionData = () => {
  const session = useSession() as any;

  if (typeof window === "undefined") return {};

  const sessionStatus = session.status;
  const role = session?.data?.user?.data?.roles ?? [];
  const courseId = session?.data?.user?.data?.courseId;
  const userName = session?.data?.user?.data?.name;
  const designation = session?.data?.user?.data?.designation;
  const token = session?.data?.user?.token;
  const sessionTeamId = session?.data?.user?.data?.teamId || "";
  const advertisementId = session?.data?.user?.data?.advertisementId ?? "";
  const selectedTile = session?.data?.user?.data?.selectedTile ?? "";
  const moduleName = session?.data?.user?.data?.moduleName;
  const isPasswordUpdated = session?.data?.user?.data?.isPasswordUpdated;
  const _id = session?.data?.user?.data?._id;
  const selectedModule = session?.data?.user?.data?.module;

  return {
    sessionStatus,
    role,
    courseId,
    userName,
    sessionTeamId,
    advertisementId,
    token,
    moduleName,
    isPasswordUpdated,
    _id,
    selectedModule,
    designation,
    session,
    selectedTile,
  };
};
