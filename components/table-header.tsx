'use client';

export default function TableHeader({ title }) {
  return (
    <div className="hidden md:grid md:grid-cols-4">
      <div className="">{title}</div>
      <div className="text-right">Výroba</div>
      <div className="text-right">Nákup</div>
      <div></div>
    </div>
  );
}
