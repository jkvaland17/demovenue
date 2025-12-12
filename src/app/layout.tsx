import React from "react";
import "material-symbols";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "@/Utils/Provide";
import NextTopLoader from "nextjs-toploader";

import "../assets/css/style.scss";
import "../assets/css/interviewStyle.scss";
import "../assets/css/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const rubik = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: " Uttar Pradesh Police Recruitment & Promotion Board",
  description: " Uttar Pradesh Police Recruitment & Promotion Board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-16x16.png" sizes="any" />
      </head>
      <body className={rubik.className}>
        <NextTopLoader showSpinner={false} />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
