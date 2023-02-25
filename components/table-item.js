export default function TableItem({ title, children }) {
  return (
    <div className="grid grid-cols-2 md:block">
      <div className="md:hidden">{title}</div>
      <div className="text-right">
        {children}
      </div>
    </div>
  );
}
