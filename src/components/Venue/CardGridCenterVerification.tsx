"use client";
import { Chip, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

interface CardProps {
  title: string;
  value: number | string;
  color?: string;
  link?: string;
  handleClick?: (title: string) => void;
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
  const clickable = Boolean(link || hasCallback);

  return (
    <div
      className={`flex h-full flex-col rounded-xl p-4 ${
        isActive ? "bg-cyan-100" : "bg-slate-100"
      } ${clickable ? "hover:cursor-pointer" : ""}`}
      onClick={() => {
        if (hasCallback && handleClick) handleClick(title);
        if (link) router.push(link);
      }}
    >
      <p className="mb-4 font-medium">{title}</p>
      <Chip
        size="lg"
        color={color ? "default" : "primary"}
        style={color ? { backgroundColor: color } : undefined}
        className="mt-auto text-white"
      >
        {value}
      </Chip>
    </div>
  );
};

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
  colors?: string[];
  hasCallback?: boolean;
  handleClick?: (title: string) => void;
  activeValue?: string;
  isLoading?: boolean;
}

const CardGridCenterVerification: React.FC<CardGridProps> = ({
  data,
  columns,
  colors,
  hasCallback,
  handleClick,
  activeValue,
  isLoading = false,
}) => {
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
  };

  return (
    <div className="grid gap-4 xl:gap-4 mob:grid-cols-2" style={gridStyle}>
      {isLoading
        ? Array.from({ length: columns }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        : data.map((item, index) => {
            const color = colors?.length
              ? colors[index % colors.length]
              : undefined;
            return (
              <Card
                key={index}
                title={item.title}
                value={item.value}
                link={item.link}
                color={color}
                hasCallback={hasCallback}
                handleClick={hasCallback ? handleClick : undefined}
                isActive={activeValue ? item.title === activeValue : false}
              />
            );
          })}
    </div>
  );
};

export default CardGridCenterVerification;
