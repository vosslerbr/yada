import { NightfallData, NightfallWeekData } from "@/global";
import useSWR from "swr";
import fetcher from "@/helpers/fetcher";
import Shields from "./Shields";
import Champions from "./Champions";
import Modifiers from "./Modifiers";
import CardLoading from "./CardLoading";
import Link from "next/link";
import { Tooltip } from "primereact/tooltip";
import { Panel } from "primereact/panel";
import { useEffect, useState } from "react";
import axios from "axios";

export default function NightfallSummary() {
  const [nightfalls, setNightfalls] = useState<NightfallWeekData[]>([]);

  useEffect(() => {
    const fetchNightfallWeek = async () => {
      const { getActivityDef, getActivityModifierDef } = await import("@d2api/manifest-web");

      const { data }: { data: NightfallData } = await axios.get("/api/nightfall");

      // get data about the activity and modifiers
      const nightfalls: NightfallWeekData[] = data.difficulties.map((difficulty) => {
        const activity = getActivityDef(difficulty.activityHash);
        const modifiers =
          activity?.modifiers?.map((modifier) => {
            return getActivityModifierDef(modifier.activityModifierHash);
          }) || [];

        return {
          ...difficulty,
          activity,
          modifiers,
        };
      });

      console.log(nightfalls);

      setNightfalls(nightfalls);
    };

    fetchNightfallWeek();
  }, []);

  return (
    <>
      {nightfalls.length ? (
        <div
          className="section-card"
          style={{
            backgroundImage: `url(https://www.bungie.net${nightfalls[0]?.activity?.pgcrImage})`,
          }}>
          <div className="section-card-inner">
            <Tooltip position="bottom" target=".detail-link" />
            <Link href="/nightfall" className="detail-link" data-pr-tooltip="View details">
              <div>
                <h3>This week&apos;s Nightfall is</h3>
                <h2>{nightfalls[0]?.activity?.displayProperties?.description}</h2>
              </div>
            </Link>

            {/* we only need these once, so just grab from master */}
            {/* <Shields modifiers={nightfalls[0]?.modifiers} /> */}
            <Champions modifiers={nightfalls[0]?.modifiers} />
            {/* TODO improve styling */}

            {nightfalls.map((nightfall, index) => {
              return (
                <Panel
                  header={`${nightfall?.activity?.displayProperties?.name?.replace(
                    "Nightfall: ",
                    ""
                  )} Modifiers`}
                  key={`nightfall${index}`}>
                  <Modifiers modifiers={nightfall.modifiers} showTitle={false} />
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
