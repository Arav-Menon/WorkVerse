import HomeDashboardShell from "./components/HomeDashboardShell";
import { getHomePageData } from "./components/home-data";

export default async function HomePage() {
  const data = await getHomePageData();

  return <HomeDashboardShell data={data} />;
}
