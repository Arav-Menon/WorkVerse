import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import type { ActivityItem } from "./home-data";

interface RecentActivityPanelProps {
  activity: ActivityItem[];
}

export default function RecentActivityPanel({ activity }: RecentActivityPanelProps) {
  return (
    <Card>
      <CardHeader className="border-b border-zinc-900/80">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Recent activity
        </p>
        <CardTitle className="text-2xl">Live team movement</CardTitle>
        <CardDescription>
          Recent organization events, launches, and collaboration signals from your network.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {activity.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-zinc-900 bg-black/15 p-4"
            >
              <Avatar className="h-11 w-11 rounded-2xl border-zinc-800 bg-zinc-900">
                <AvatarFallback>{item.avatar}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{item.detail}</p>
                  </div>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {item.time}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-900 pt-3">
                  <span className="text-xs text-zinc-500">{item.actor}</span>
                  <span className="flex items-center gap-2 text-xs text-zinc-400">
                    <i className={`ti ${item.icon} text-sm`} aria-hidden="true" />
                    Signal captured
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
