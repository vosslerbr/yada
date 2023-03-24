import Image from "next/image";
import { Tooltip } from "primereact/tooltip";
import { Fragment } from "react";

export default function XurExotics({ items }: any) {
  return (
    <div className="rewards-container section-metadata">
      <h4>Exotics</h4>
      <div>
        {items
          .filter((item: any) => {
            return (
              item.itemTier === "Exotic Gear" &&
              item.name !== "Hawkmoon" &&
              item.name !== "Dead Man's Tale"
            );
          })
          .map((item: any) => {
            const { icon, name } = item;

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
