import { Card } from "../../../components/ui/card";
import type { HomeStat } from "./home-data";

interface HomeStatsSectionProps {
  stats: HomeStat[];
}

export default function HomeStatsSection({ stats }: HomeStatsSectionProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-zinc-500">{stat.helper}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-zinc-200">
              <i className={`ti ${stat.icon} text-lg`} aria-hidden="true" />
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}
