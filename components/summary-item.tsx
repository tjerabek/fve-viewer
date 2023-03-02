"use client";

type SummaryItemType = {
  children?: React.ReactNode;
  title: string;
  chart?: JSX.Element;
};

export default function SummaryItem({
  children,
  title,
  chart,
}: SummaryItemType): JSX.Element {
  return (
    <div>
      <div className="text-xl dark:text-white">{children}</div>
      <div className="text-gray-500">{title}</div>
      {chart}
    </div>
  );
}
