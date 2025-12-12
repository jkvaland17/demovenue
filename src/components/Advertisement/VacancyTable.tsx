import React from "react";
import { Users, TrendingUp, Award, Venus } from "lucide-react";

interface VacancyItem {
  key: string;
  name: string;
  sports?: string;
  subsports?: string;
  position?: string;
  totalVacancy: number;
}

interface VacancyResponse {
  total: number;
  result: VacancyItem[];
}

interface Props {
  data: VacancyResponse;
  formMethods: any;
}

export const VacancyTable: React.FC<Props> = ({ data, formMethods }) => {
  const { control, register, watch, setValue } = formMethods;

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "general":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "other backward classes (obc)":
        return <Award className="h-4 w-4 text-orange-500" />;
      case "female":
        return <Venus className="h-4 w-4 text-pink-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <table className="w-full text-[12px]">
      <thead>
        <tr className="border-b border-gray-300">
          <th className="px-2 py-2 text-left font-semibold text-gray-700">
            S.No
          </th>
          <th className="px-2 py-2 text-left font-semibold text-gray-700">
            Category
          </th>
          {watch("course") !== "679cfae430000d1df590aac5" && (
            <>
              <th className="px-2 py-2 text-left font-semibold text-gray-700">
                Sport
              </th>
              <th className="px-2 py-2 text-left font-semibold text-gray-700">
                Sub Sport
              </th>
              <th className="px-2 py-2 text-left font-semibold text-gray-700">
                Position
              </th>
            </>
          )}
          <th className="px-2 py-2 text-right font-semibold text-gray-700">
            Total Vacancy
          </th>
        </tr>
      </thead>
      <tbody>
        {data?.result?.map((item: VacancyItem, index: number) => (
          <tr key={item.key} className="hover:bg-gray-50">
            <td className="px-2 py-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                <span className="text-[12px] font-medium text-gray-800">
                  {index + 1}
                </span>
              </div>
            </td>
            <td className="px-2 py-1">
              <div className="flex items-center gap-2">
                {getCategoryIcon(item.name)}
                <span className="text-[12px] font-medium text-gray-800">
                  {item.name || "-"}
                </span>
              </div>
            </td>
            {watch("course") !== "679cfae430000d1df590aac5" && (
              <>
                <td className="px-2 py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-gray-800">
                      {item.sports || "-"}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-gray-800">
                      {item.subsports || "-"}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-gray-800">
                      {item.position || "-"}
                    </span>
                  </div>
                </td>
              </>
            )}
            <td className="px-2 py-1 text-right">
              <span className="rounded bg-blue-100 px-2 py-1 font-semibold text-blue-700">
                {item.totalVacancy.toLocaleString()}
              </span>
            </td>
          </tr>
        ))}
        {/* Total Row */}
        <tr className="border-t border-gray-300">
          <td colSpan={2} className="px-2 py-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[12px] font-bold text-white">
                Σ
              </div>
              <span className="text-[12px] font-bold text-gray-800">
                Total Vacancies
              </span>
            </div>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td className="px-2 py-2 text-right">
            <span className="rounded bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 font-bold text-white">
              {data?.total?.toLocaleString()}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
