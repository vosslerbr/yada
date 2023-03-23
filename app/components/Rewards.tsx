import Image from "next/image";
import { Tooltip } from "primereact/tooltip";
import { Fragment } from "react";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

interface RewardsProps {
  rewards: (DestinyInventoryItemDefinition | undefined)[];
}

export default function Rewards({ rewards }: RewardsProps) {
  return (
    <div className="rewards-container section-metadata">
      <h4>Rewards</h4>
      <div>
        {rewards.map((reward) => {
          const { icon, name } = reward?.displayProperties || {};

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
