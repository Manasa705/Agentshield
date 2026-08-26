export default function StatCard({ label, value, accent }) {
  return (
    <div className="flex-1 min-w-[180px] rounded-xl border border-[#232B3A] bg-[#131822] px-5 py-4">
      <div className="text-[11px] uppercase tracking-wider text-[#7C8798] font-medium">
        {label}
      </div>
      <div
        className="mt-1.5 text-2xl font-display font-semibold tabular-nums"
        style={{ color: accent || "#E6EDF3" }}
      >
        {value}
      </div>
    </div>
  );
}
