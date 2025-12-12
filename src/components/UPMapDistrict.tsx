import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import up_map from "@/assets/data/up.json";
import { useState, useRef, useEffect } from "react";
import { CallGetTreasuryMapData } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";

type DistrictStat = {
  districtCode: string;
  district: string;
  treasuryStatus: string;
};

const UPMapDistrict = () => {
  const [allData, setAllData] = useState<DistrictStat[]>([]);
  const [tooltipContent, setTooltipContent] = useState<DistrictStat | null>(
    null,
  );
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const getDistrictStatus = async () => {
    try {
      const { data, error } = (await CallGetTreasuryMapData()) as any;
      // console.log("getDistrictStatus", { data, error });

      if (data) {
        setAllData(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDistrictStatus();
  }, []);

  return (
    <div ref={mapRef} style={{ position: "relative" }}>
      <ComposableMap
        projection="geoMercator"
        width={800}
        height={600}
        projectionConfig={{ scale: 4000, center: [81.0, 27.0] }}
      >
        <Geographies geography={up_map}>
          {({ geographies }) =>
            geographies.map((geo: any) => {
              const { unique_id } = geo.properties;
              const districtId = unique_id.toString();
              const stats = allData.find(
                (stat) => stat.districtCode === districtId,
              );

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={(event) => {
                    const bounds = mapRef.current?.getBoundingClientRect();
                    if (!bounds) return;

                    const x = event.clientX - bounds.left;
                    const y = event.clientY - bounds.top;

                    setTooltipPosition({ x, y });

                    if (stats) {
                      setTooltipContent(stats);
                    }
                  }}
                  onMouseLeave={() => {
                    setTooltipContent(null);
                  }}
                  style={{
                    default: {
                      fill:
                        stats?.treasuryStatus === "Matched"
                          ? "green"
                          : stats?.treasuryStatus === "Unmatched"
                            ? "#C5172E"
                            : stats?.treasuryStatus === "Pending"
                              ? "#FFB22C"
                              : "#ccc",
                      stroke: "#fff",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          style={{
            position: "absolute",
            top: Math.max(0, tooltipPosition.y - 100), // Clamp to top
            left: tooltipPosition.x + 10,
            backgroundColor: "#222",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            pointerEvents: "none",
            fontSize: "14px",
            zIndex: 10,
            boxShadow: "0px 0px 6px rgba(0,0,0,0.3)",
            width: "160px",
          }}
        >
          <div>
            <strong>{tooltipContent.district}</strong>
          </div>
          <p
            className={`${tooltipContent.treasuryStatus === "Matched" ? "text-emerald-500" : tooltipContent.treasuryStatus === "Unmatched" ? "text-red-500" : "text-yellow-500"}`}
          >
            {tooltipContent.treasuryStatus}
          </p>
        </div>
      )}
    </div>
  );
};

export default UPMapDistrict;
