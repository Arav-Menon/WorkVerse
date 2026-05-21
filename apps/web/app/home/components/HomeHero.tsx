import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import type { HomePageData } from "./home-data";

interface HomeHeroProps {
  hero: HomePageData["hero"];
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}

export default function HomeHero({
  hero,
  onPrimaryAction,
  onSecondaryAction,
}: HomeHeroProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <CardHeader className="relative z-10 gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            {hero.eyebrow}
          </p>
          <CardTitle className="mt-3 max-w-3xl text-3xl tracking-[-0.04em] sm:text-4xl md:text-5xl">
            {hero.title}
          </CardTitle>
          <CardDescription className="mt-4 max-w-2xl text-base leading-7">
            {hero.description}
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-3 md:justify-end">
          <Button onClick={onPrimaryAction}>{hero.primaryAction}</Button>
          <Button variant="secondary" onClick={onSecondaryAction}>
            {hero.secondaryAction}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 pt-0">
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-2 rounded-full border border-emerald-900/70 bg-emerald-950/40 px-3 py-1 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Teams active now
          </span>
          <span className="rounded-full border border-zinc-800 bg-zinc-950/60 px-3 py-1 text-zinc-400">
            Search and enter any org workspace from one page
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
