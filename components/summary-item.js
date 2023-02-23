export default function SummaryItem({ children, title }) {
  return (
    <div>
      <div className="text-xl dark:text-white">
        {children}
      </div>
      <div className="text-gray-500">{title}</div>
    </div>
  );
}
