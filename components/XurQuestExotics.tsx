import { XurItem } from "@/global";
import Image from "next/image";
import { Tooltip } from "primereact/tooltip";
import { Fragment, useEffect, useState } from "react";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

interface XurExoticsProps {
  items: XurItem[];
}

export default function XurQuestExotics({ items }: XurExoticsProps) {
  const [questExotics, setQuestExotics] = useState<DestinyInventoryItemDefinition[]>([]);

  console.log(items);

  useEffect(() => {
    const getQuestExotics = async () => {
      const { getInventoryItemDef } = await import("@d2api/manifest-web");

      const xurItems = items.reduce((acc: DestinyInventoryItemDefinition[], item) => {
        const inventoryItem = getInventoryItemDef(item.itemHash);

        if (inventoryItem) {
          acc.push(inventoryItem);
        }

        return acc;
      }, []);

      const questExotics = xurItems.filter((item) => {
        return (
          (item && item.displayProperties.name === "Hawkmoon") ||
          item.displayProperties.name === "Dead Man's Tale"
        );
      });

      setQuestExotics(questExotics);
    };

    getQuestExotics();
  }, []);

  return (
    <div className="rewards-container section-metadata">
      <h4>Quest Exotics</h4>
      <div>
        {questExotics.map((item) => {
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
