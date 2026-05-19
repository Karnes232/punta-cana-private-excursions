interface InfoStatProps {
  label: string;
  value: string;
}

export function InfoStat({ label, value }: InfoStatProps) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-sand-dark last:border-b-0">
      <span className="text-[11px] font-heading font-semibold uppercase tracking-[0.16em] text-gray-dark">
        {label}
      </span>
      <span className="text-slate-dark font-heading font-medium text-sm">
        {value}
      </span>
    </div>
  );
}
