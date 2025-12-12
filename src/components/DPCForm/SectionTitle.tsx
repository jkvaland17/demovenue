import React from "react";

type SectionTitleProps = {
  english: string;
  hindi: string;
};

const SectionTitle: React.FC<SectionTitleProps> = ({ english, hindi }) => {
  return (
    <p className="text-lg">
      {english}
      <span className="font-semibold">{hindi}</span>
    </p>
  );
};

export default SectionTitle;
