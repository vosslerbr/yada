import { LostSectorData } from "@/global";
import CardLoading from "./CardLoading";
import Champions from "./Champions";
import Modifiers from "./Modifiers";
import Rewards from "./Rewards";
import Shields from "./Shields";
import Link from "next/link";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip } from "primereact/tooltip";
import { LostSectorDay } from "@prisma/client";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

export default function LostSectorSummary() {
  const [lostSectors, setLostSectors] = useState<LostSectorData[]>([]);
  const [selectedDay, setSelectedDay] = useState<LostSectorData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePageOverClick = (direction: string) => {
    if (direction === "next") {
      setSelectedIndex((prevState) => {
        if (prevState === lostSectors.length - 1) {
          return 0;
        }

        return prevState + 1;
      });
    } else {
      setSelectedIndex((prevState) => {
        if (prevState === 0) {
          return lostSectors.length - 1;
        }

        return prevState - 1;
      });
    }
  };

  // when the selected index changes, update the selected day
  useEffect(() => {
    setSelectedDay(lostSectors[selectedIndex]);
  }, [selectedIndex]);

  // when the component mounts, fetch the lost sectors, and set the selected day
  useEffect(() => {
    const fetchLostSectors = async () => {
      const { getActivityDef, getActivityModifierDef, getAllCollectibleDefs, getInventoryItemDef } =
        await import("@d2api/manifest-web");

      const { data }: { data: LostSectorDay[] } = await axios.get("/api/lost-sector");

      // get data about the activity and modifiers
      const lostSectors: LostSectorData[] = data.map((lostSector) => {
        const activity = getActivityDef(lostSector.activityHash);
        const modifiers =
          activity?.modifiers?.map((modifier) => {
            return getActivityModifierDef(modifier.activityModifierHash);
          }) || [];

        const allCollectibles = getAllCollectibleDefs();

        // get the rewards for the lost sector (find lost sector collectibles, and then find the inventory item for that collectible)
        const rewards = allCollectibles.reduce(
          (acc: DestinyInventoryItemDefinition[], collectible) => {
            if (collectible?.sourceHash !== 2203185162) return acc;

            const inventoryItem = getInventoryItemDef(collectible.itemHash);

            if (
              !inventoryItem ||
              inventoryItem.itemTypeAndTierDisplayName !== lostSector.rewardType
            )
              return acc;

            return [...acc, inventoryItem];
          },
          []
        );

        console.log(rewards);

        return {
          ...lostSector,
          activity,
          modifiers,
          rewards,
        };
      });

      setLostSectors(lostSectors);

      // find the index of the current day
      const todaysLostSector = lostSectors.find((lostSectorDay) => {
        const now = dayjs();

        return (
          dayjs(lostSectorDay.startsAt).isBefore(now) && dayjs(lostSectorDay.endsAt).isAfter(now)
        );
      });

      if (todaysLostSector) {
        setSelectedDay(todaysLostSector);

        // find the index of the current day
        const todaysLostSectorIndex = lostSectors.findIndex((lostSectorDay) => {
          const now = dayjs();

          return (
            dayjs(lostSectorDay.startsAt).isBefore(now) && dayjs(lostSectorDay.endsAt).isAfter(now)
          );
        });

        setSelectedIndex(todaysLostSectorIndex);
      }
    };

    fetchLostSectors();
  }, []);

  if (!lostSectors.length || !selectedDay) {
    return <CardLoading dataName="lost sector" />;
  }

  return (
    <>
      <div
        className="section-card"
        style={{
          backgroundImage: `url(https://www.bungie.net${selectedDay.activity?.pgcrImage})`,
        }}>
        <div className="section-card-inner">
          <Tooltip position="bottom" target=".detail-link" />
          <Link
            href={`/lost-sector/${selectedDay.id}`}
            className="detail-link"
            data-pr-tooltip="View details">
            <div>
              <h3>Today&apos;s Lost Sector is</h3>
              <h2>{selectedDay.name}</h2>
            </div>
          </Link>
          <Rewards rewards={selectedDay.rewards} />
          {/* <Shields modifiers={selectedDay.activity?.modifiers ?? []} /> */}
          <Champions modifiers={selectedDay.modifiers} />
          <Modifiers modifiers={selectedDay.modifiers} />
          <p className="footnote">Lost sectors change every day at reset.</p>
          <div className="summary-pagination">
            <button
              className="summary-page-over"
              onClick={() => {
                handlePageOverClick("prev");
              }}>
              <i className="pi pi-arrow-left" />
            </button>

            <p>{dayjs(selectedDay.startsAt).format("MM/DD/YYYY")}</p>

            <button
              className="summary-page-over"
              onClick={() => {
                handlePageOverClick("next");
              }}>
              <i className="pi pi-arrow-right" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
