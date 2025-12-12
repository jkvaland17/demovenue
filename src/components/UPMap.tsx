import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import up_map from "@/assets/data/up.json";
import { useState, useRef, useEffect } from "react";
import { CallGetCenterMapData } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";

type DistrictStat = {
  districtCode: string;
  district: string;
  submitted: number;
  pending: number;
  matched?: number;
};

type CurrentAdvertisementIdProps = {
  currentAdvertisementID: string | null;
  user?: string;
};

const UPMap = ({
  currentAdvertisementID,
  user,
}: CurrentAdvertisementIdProps) => {
  const [allStats, setAllStats] = useState<DistrictStat[]>([]);
  const [tooltipContent, setTooltipContent] = useState<DistrictStat | null>(
    null,
  );
  const [tooltipDistrictName, setTooltipDistrictName] = useState<string | null>(
    null,
  );
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const getUPstats = async () => {
    if (!currentAdvertisementID) return;
    try {
      const query = `advertisementId=${currentAdvertisementID}&user=${user ?? ""}`;
      const { data, error } = (await CallGetCenterMapData(query)) as any;
      console.log("CallGetCenterMapData", data);
      if (data) setAllStats(data);
      if (error) handleCommonErrors(error);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUPstats();
  }, [currentAdvertisementID, user]);

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
            geographies.map((geo) => {
              const { unique_id } = geo.properties;
              const districtId = unique_id.toString();
              const stats = allStats.find(
                (stat) => stat.districtCode === districtId,
              );
              const baseFill = stats ? "#0b6623" : "#95aac9";
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
                      // console.log("Hovering over:", stats.district, stats);
                      setTooltipContent(stats);
                      setTooltipDistrictName(null);
                    } else {
                      // console.warn("No stats for district ID:", districtId);
                      const districtName =
                        (geo.properties as any).district || "Unknown District";
                      setTooltipDistrictName(districtName);
                      setTooltipContent(null);
                    }
                  }}
                  onMouseLeave={() => {
                    setTooltipContent(null);
                    setTooltipDistrictName(null);
                  }}
                  style={{
                    default: {
                      fill: baseFill,
                      stroke: "#fff",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "#ff6347",
                      stroke: "#fff",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#ff4500",
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
      {(tooltipContent || tooltipDistrictName) && (
        <div
          style={{
            position: "absolute",
            top: Math.max(0, tooltipPosition.y - 100),
            left: tooltipPosition.x + 10,
            backgroundColor: "#222",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            pointerEvents: "none",
            fontSize: "14px",
            zIndex: 10,
            boxShadow: "0px 0px 6px rgba(0,0,0,0.3)",
            width: "180px",
          }}
        >
          {tooltipContent ? (
            <>
              <div>
                <strong>{tooltipContent.district}</strong>
              </div>
              <div style={{ color: "green" }}>
                Submitted Centres:{" "}
                {(tooltipContent.submitted ?? 0) ||
                  (tooltipContent.matched ?? 0)}
              </div>
              <div style={{ color: "yellow" }}>
                Pending Centres: {tooltipContent.pending ?? 0}
              </div>
              <div
                style={{ marginTop: "6px", fontSize: "12px", color: "#aaa" }}
              >
                Total:{" "}
                {(tooltipContent.submitted ?? 0) +
                  (tooltipContent.pending ?? 0)}
              </div>
            </>
          ) : (
            <>
              <div>
                <strong>{tooltipDistrictName}</strong>
              </div>
              <div
                style={{ marginTop: "6px", fontSize: "12px", color: "#aaa" }}
              >
                District not included in this exam.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UPMap;
