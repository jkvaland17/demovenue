import React from "react";
import { EyeFilledIcon } from "@/assets/img/svg/EyeFilledIcon";

interface watermark_types {
  text?: string;
  bgSize?: string;
  opacity?: string;
}

const WaterMark = ({ text, bgSize, opacity }: watermark_types) => {
  return (
    <div
      style={{
        position: "absolute",
        backgroundImage: `url(
          'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="-0" y="100" font-size="24" fill="rgba(0,0,0,0.1)" transform="rotate(-30)">Yashraj</text></svg>',
        )`,
        // backgroundImage: `url(https://rrp.aiimsexams.ac.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.a81a34ab.png&w=384&q=75)`,
        backgroundSize: bgSize || "100px",
        backgroundRepeat: "repeat",
        height: "100%",
        width: "100%",
        opacity: opacity || "0.5",
      }}
    ></div>
  );
};

export default WaterMark;
