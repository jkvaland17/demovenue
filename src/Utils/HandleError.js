"use client";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export const handleCommonErrors = (error) => {
  const errorMessage = error;
  if (errorMessage && errorMessage === "Not Authorised") {
    setTimeout(() => {
      toast.error("Token Expired");
      signOut();
    }, 2000);
  } else {
    console.error("An error occurred:", errorMessage);
    toast.error(errorMessage);
  }
};
