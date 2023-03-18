import { Collectible, InventoryItem } from "@prisma/client";
import Image from "next/image";
import { Tooltip } from "primereact/tooltip";
import { Fragment } from "react";

interface LSRewardsProps {
  rewards: (Collectible & {
    inventoryItem: InventoryItem;
  })[];
}

export default function Rewards({ rewards }: LSRewardsProps) {
  return (
    <div className="rewards-container section-metadata">
      <h4>Rewards</h4>
      <div>
        {rewards.map((reward) => {
          const { icon, name, hash } = reward.inventoryItem;

          return (
            <Fragment key={`${name}_image`}>
              <Tooltip position="bottom" target=".reward-image" />
              <Image
                src={`https://www.bungie.net${icon}`}
                alt={name || "Reward"}
                width="48"
                height="48"
                className="image-rounded reward-image"
                data-pr-tooltip={name || "Reward"}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
