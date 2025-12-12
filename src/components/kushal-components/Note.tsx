import React from "react";

type Props = {
  note: String;
};

const Note = ({ note }: Props) => {
  return (
    <div className="flex gap-3">
      <span className="material-symbols-rounded">info</span>
      <p className="text-slate-500 text-sm md:text-md">{note}</p>
    </div>
  );
};

export default Note;
