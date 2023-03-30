import { XurItem } from "@/global";
import Image from "next/image";
import { Tooltip } from "primereact/tooltip";
import { Fragment, useEffect, useState } from "react";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import itemTypeMap from "@/helpers/itemTypeMap";

interface XurLegendaryProps {
  items: XurItem[];
}

export default function XurLegendaryWeapons({ items }: XurLegendaryProps) {
  const [legendaryWeapons, setLegendaryWeapons] = useState<DestinyInventoryItemDefinition[]>([]);

  console.log(items);

  useEffect(() => {
    const getLegendaryWeapons = async () => {
      const { getInventoryItemDef } = await import("@d2api/manifest-web");

      const xurItems = items.reduce((acc: DestinyInventoryItemDefinition[], item) => {
        const inventoryItem = getInventoryItemDef(item.itemHash);

        if (inventoryItem) {
          acc.push(inventoryItem);
        }

        return acc;
      }, []);

      const legendaryWeapons = xurItems.filter((item) => {
        const itemTier = getInventoryItemDef(item.summaryItemHash)?.displayProperties.name;
        const itemType = itemTypeMap[item.itemType].singular;

        return item && itemTier === "Legendary Gear" && itemType === "Weapon";
      });

      setLegendaryWeapons(legendaryWeapons);
    };

    getLegendaryWeapons();
  }, []);

  return (
    <div className="rewards-container section-metadata">
      <h4>Legendary Weapons</h4>
      <div>
        {legendaryWeapons.map((item) => {
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
