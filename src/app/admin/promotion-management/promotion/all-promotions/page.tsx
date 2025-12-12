"use client";
import { Select, SelectItem } from "@nextui-org/select";
import React, { useEffect, useState } from "react";
import { PromotionCards } from "@/assets/data/mockData";
import PromotionCard from "@/components/PromotionCard";
import { CallGetAllPromotionData } from "@/_ServerActions";
import CardSkeleton from "@/components/kushal-components/loader/CardSkeleton";
type Props = {};

const Promotion = (props: Props) => {
  const [allPromotions, setAllPromotions] = useState([]);
  const [loader, setLoader] = useState(false);

  const workScopeDataList = async () => {
    try {
      setLoader(true);
      const { data, error } = (await CallGetAllPromotionData()) as any;
      console.log("data", data);
      if (data.status_code === 200) {
        setAllPromotions(data?.data);
        setLoader(false);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    workScopeDataList();
  }, []);

  return (
    <div>
      {loader ? (
        <CardSkeleton cardsCount={2} columns={1} />
      ) : (
        <>
          <div className="mb-3 grid grid-cols-6 gap-6 mob:grid-cols-1">
            <h2 className="col-span-5 text-2xl font-semibold">
              All Promotions Events
            </h2>
            <Select
              items={[{ key: "noData", name: "--" }]}
              placeholder="Sort by"
              variant="bordered"
              classNames={{ trigger: "bg-white" }}
            >
              {(item) => <SelectItem key={item.key}>{item.name}</SelectItem>}
            </Select>
          </div>

          {allPromotions?.map((item, index) => (
            <PromotionCard item={item} key={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default Promotion;
