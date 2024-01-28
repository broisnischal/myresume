import { cn } from "@/lib/utils";
import { twMerge } from "tailwind-merge";
import moment from "moment";

interface IndividualContributionProps {
  className?: string;
  item: {
    date: string;
    count: number;
    level: number;
  };
}

export const ContributionBox = ({
  className,
  item: { date, count, level },
}: IndividualContributionProps) => {
  const isStartOfMonth = date.endsWith("-22");
  const monthNameShort = isStartOfMonth
    ? new Date(date).toLocaleString("en", { month: "short" })
    : "";

  return (
    <div className="">
      <div
        className={cn(
          " relative group w-[10px] aspect-square rounded-[2px] [outline:1px_solid_#1b1f230f] outline-offset-[-1px]  cursor-auto  ",
          level === 0 && "dark:bg-[#161b22] bg-[#ebedf0]",
          level === 1 && "dark:bg-[#0e4429] bg-[#9be9a8]",
          level === 2 && "dark:bg-[#006d32] bg-[#40c463]",
          level === 3 && "dark:bg-[#26a641] bg-[#30a14e]",
          level === 4 && "dark:bg-[#39d353] bg-[#216e39]",
          className
        )}
      >
        <div
          className={twMerge(
            `absolute hidden group-hover:flex group-hover:items-center group-hover:justify-center text-center z-10 left-[50%] translate-x-[-50%] px-1 py-1 top-[-35px] bg-[#33383f] rounded-[3px] ${
              count === 0 ? "min-w-[250px]" : "min-w-[250px]"
            }`
          )}
        >
          {count === 0
            ? `No contributions on ${moment(date).format("MMM Do")}`
            : `${count} contributions on ${moment(date).format("MMM Do")}`}
        </div>
      </div>
      <div className="absolute top-[-20px]">{monthNameShort}</div>
    </div>
  );
};

// olor-calendar-graph-day-L1-bg: ;
//     --color-calendar-graph-day-L2-bg: ;
//     --color-calendar-graph-day-L3-bg: #26a641;
//     --color-calendar-graph-day-L4-bg: #39d353;
