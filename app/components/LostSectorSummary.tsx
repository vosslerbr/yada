import { LostSectorData } from "@/global";
import CardLoading from "./CardLoading";
import Champions from "./Champions";
import Modifiers from "./Modifiers";
import Rewards from "./Rewards";
import Shields from "./Shields";
import useSWR from "swr";
import fetcher from "@/helpers/fetcher";
import Link from "next/link";
import { Tooltip } from "@mui/material";

export default function LostSectorSummary() {
  const { data, isLoading }: { data: LostSectorData; isLoading: boolean } = useSWR(
    "/api/lost-sector",
    fetcher
  );

  console.log(data);
  console.log(isLoading);

  if (isLoading || !data) {
    return <CardLoading dataName="lost sector" />;
  }

  return (
    <div
      className="section-card"
      style={{
        backgroundImage: `url(https://www.bungie.net${data.activity.pgcrImage})`,
      }}>
      <div className="section-card-inner">
        {" "}
        <Tooltip title="View details" placement="left" arrow>
          <Link href="/lost-sector">
            <div>
              <h3>Today&apos;s Lost Sector is</h3>
              <h2>{data.name}</h2>
            </div>
          </Link>
        </Tooltip>
        <Rewards rewards={data.rewards} />
        <Shields modifiers={data.activity.modifiers} />
        <Champions modifiers={data.activity.modifiers} />
        <Modifiers modifiers={data.activity.modifiers} />
      </div>
    </div>
  );
}
