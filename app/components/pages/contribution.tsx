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
          "h-3 relative group w-3 rounded-[2px] [outline:1px_solid_#1b1f230f] outline-offset-[-1px]  cursor-auto  ",
          level === 0 && "bg-[#161b22]",
          level === 1 && "bg-[#0e4429]",
          level === 2 && "bg-[#006d32]",
          level === 3 && "bg-[#26a641]",
          level === 4 && "bg-[#39d353]",
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
