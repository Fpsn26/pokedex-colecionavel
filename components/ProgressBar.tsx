// components/ProgressBar.tsx

export function ProgressBar({
  owned,
  total,
}: {
  owned: number;
  total: number;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((owned / total) * 100)) : 0;
  const complete = owned >= total && total > 0;

  return (
    <div className="w-full">
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={
            complete
              ? "h-full rounded-full bg-[linear-gradient(90deg,#8B5CF6,#22D3EE,#F5A623,#8B5CF6)] bg-[length:300%_100%] animate-[holoSweep_3s_linear_infinite]"
              : "h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
          }
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
