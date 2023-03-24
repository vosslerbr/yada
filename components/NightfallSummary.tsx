import { NightfallData } from "@/global";
import useSWR from "swr";
import fetcher from "@/helpers/fetcher";
import Shields from "./Shields";
import Champions from "./Champions";
import Modifiers from "./Modifiers";
import CardLoading from "./CardLoading";
import Link from "next/link";
import { Tooltip } from "primereact/tooltip";
import { Panel } from "primereact/panel";

export default function NightfallSummary() {
  const { data: nightfallData }: { data: NightfallData } = useSWR("/api/nightfall", fetcher);

  return (
    <>
      {nightfallData ? (
        <div
          className="section-card"
          style={{
            backgroundImage: `url(https://www.bungie.net${nightfallData.keyart})`,
          }}>
          <div className="section-card-inner">
            <Tooltip position="bottom" target=".detail-link" />
            <Link href="/nightfall" className="detail-link" data-pr-tooltip="View details">
              <div>
                <h3>This week&apos;s Nightfall is</h3>
                <h2>{nightfallData.name}</h2>
              </div>
            </Link>

            {/* we only need these once, so just grab from master */}
            <Shields modifiers={nightfallData.difficulties[2]?.activity.modifiers || []} />
            <Champions modifiers={nightfallData.difficulties[2]?.activity.modifiers || []} />
            {/* TODO improve styling */}

            {nightfallData.difficulties.map((difficulty) => {
              return (
                <Panel
                  header={`${difficulty?.activity.detailedName?.replace(
                    "Nightfall: ",
                    ""
                  )} Modifiers`}
                  key={difficulty?.activity.detailedName}>
                  <Modifiers modifiers={difficulty?.activity.modifiers || []} showTitle={false} />
                </Panel>
              );
            })}

            <p className="footnote">Nightfalls change every Tuesday at reset.</p>
          </div>
        </div>
      ) : (
        <CardLoading dataName="nightfalls" />
      )}
    </>
  );
}
