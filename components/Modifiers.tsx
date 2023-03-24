import Image from "next/image";
import { Tooltip } from "primereact/tooltip";
import { Fragment } from "react";
import { DestinyActivityModifierDefinition } from "bungie-api-ts/destiny2";

interface ModifiersProps {
  modifiers: (DestinyActivityModifierDefinition | undefined)[];
  showTitle?: boolean;
}

export default function Modifiers({ modifiers, showTitle = true }: ModifiersProps) {
  return (
    <div className="modifiers-container section-metadata">
      {showTitle && <h4>Modifiers</h4>}

      <div>
        {modifiers.reduce((acc: JSX.Element[], modifier) => {
          const { name, icon } = modifier?.displayProperties || {};

          const notShieldedFoes = name !== "Shielded Foes";
          const notChampionFoes = name !== "Champion Foes";
          const notVanguardRank = name !== "Increased Vanguard Rank";
          const notDoubleDrops = name !== "Double Nightfall Drops";

          if (icon && notShieldedFoes && notChampionFoes && notVanguardRank && notDoubleDrops) {
            const { icon, name, description } = modifier?.displayProperties || {};

            acc.push(
              <Fragment key={`${name}_image`}>
                <Tooltip position="bottom" target=".modifier" />
                <Image
                  src={`https://www.bungie.net${icon}`}
                  alt={name || "modifier"}
                  width="40"
                  height="40"
                  className="modifier"
                  data-pr-tooltip={`${name}: ${description}`}
                />
              </Fragment>
            );
          }

          return acc;
        }, [])}
      </div>
    </div>
  );
}
