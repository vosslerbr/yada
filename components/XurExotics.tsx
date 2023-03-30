import { XurItem } from "@/global";
import Image from "next/image";
import { Tooltip } from "primereact/tooltip";
import { Fragment, useEffect, useState } from "react";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

interface XurExoticsProps {
  items: XurItem[];
}

export default function XurExotics({ items }: XurExoticsProps) {
  const [exotics, setExotics] = useState<DestinyInventoryItemDefinition[]>([]);

  console.log(items);

  useEffect(() => {
    const getExotics = async () => {
      const { getInventoryItemDef } = await import("@d2api/manifest-web");

      const xurItems = items.reduce((acc: DestinyInventoryItemDefinition[], item) => {
        const inventoryItem = getInventoryItemDef(item.itemHash);

        if (inventoryItem) {
          acc.push(inventoryItem);
        }

        return acc;
      }, []);

      const exotics = xurItems.filter((item) => {
        return (
          item &&
          getInventoryItemDef(item.summaryItemHash)?.displayProperties.name === "Exotic Gear" &&
          item.displayProperties.name !== "Hawkmoon" &&
          item.displayProperties.name !== "Dead Man's Tale"
        );
      });

      setExotics(exotics);
    };

    getExotics();
  }, []);

  return (
    <div className="rewards-container section-metadata">
      <h4>Exotics</h4>
      <div>
        {exotics.map((item) => {
          const {
            displayProperties: { name, icon },
          } = item;

          return (
            <Fragment key={`${name}_image`}>
              <Tooltip position="bottom" target=".reward-image" />
              <Image
                src={`https://www.bungie.net${icon}`}
                alt={name || "Reward"}
                width="48"
                height="48"
                className="image-rounded reward-image"
                data-pr-tooltip={name}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
