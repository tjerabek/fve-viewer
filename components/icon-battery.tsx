'use client';

export default function IconBattery({ value }) {
  return (
    <div className="flex items-center space-x-px">
      <div className="border-[1.5px] border-gray-500 w-[21px] h-[12px] rounded p-px">
        <div
          className="h-full bg-gray-800 dark:bg-gray-100 rounded-sm"
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <div className="bg-gray-500 w-[2px] h-[6px] rounded-r-sm"></div>
    </div>
  );
}
