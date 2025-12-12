"use client";
import { Chip, Skeleton } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface CardProps {
  title: string;
  value: number | string;
  color: string;
  link?: any;
  handleClick?: any;
  hasCallback?: boolean;
  isActive?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  value,
  color,
  link,
  hasCallback,
  handleClick,
  isActive,
}) => {
  const router = useRouter();
  return (
    // <Link href={link}>
    <div
      className={`flex flex-col rounded-xl ${isActive ? "bg-cyan-100" : `bg-slate-100`} p-4 hover:${(link || hasCallback) && `cursor-pointer`} h-full`}
      onClick={() => {
        if (hasCallback) {
          handleClick(title);
        }
        if (link) {
          router.push(link);
        }
      }}
    >
      <p className="mb-4 font-medium">{title}</p>
      <Chip
        size="lg"
        // classNames={{ content: `!bg-[${color}]` }}
        style={{ backgroundColor: color }}
        className={`mt-auto text-white`}
      >
        {value}
      </Chip>
    </div>
    // </Link>
  );
};

// 🔹 Skeleton version of the card
const SkeletonCard: React.FC = () => (
  <div className="flex h-full flex-col rounded-xl bg-slate-100 p-4">
    <Skeleton className="mb-4 h-5 w-3/4 rounded-lg" />
    <Skeleton className="mt-auto h-10 w-20 rounded-lg" />
  </div>
);

interface CardGridProps {
  data: {
    title: string;
    value: number | string;
    link?: string;
  }[];
  columns: number;
  color?: "primary" | "colorful";
  hasCallback?: any;
  handleClick?: any;
  activeValue?: any;
  isLoading?: boolean;
}

const colors: string[] = ["#4caf50", "#facc15", "#f44336"];

const CardGrid: React.FC<CardGridProps> = ({
  data,
  columns,
  color = "",
  hasCallback,
  handleClick,
  activeValue,
  isLoading = false,
}) => {
  const cardCount = columns * 2; // or any sensible number for skeletons

  return (
    <div className={`grid grid-cols-${columns} gap-4 mob:grid-cols-2 xl:gap-4`}>
      {isLoading
        ? Array.from({ length: columns }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        : data.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              value={item.value}
              link={item.link}
              color={
                color === "colorful" ? colors[index % colors.length] : "#006fee"
              }
              hasCallback={hasCallback}
              handleClick={
                hasCallback ? (value: any) => handleClick(value) : () => {}
              }
              isActive={activeValue ? item.title === activeValue : false}
            />
          ))}
    </div>
  );
};

export default CardGrid;
