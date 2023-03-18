import { ActivityModifier, ActivityModifiersOnActivity } from "@prisma/client";
import Image from "next/image";
import { Tooltip } from "primereact/tooltip";

interface LSModifiersProps {
  modifiers: (ActivityModifiersOnActivity & { activityModifier: ActivityModifier })[];
  showTitle?: boolean;
}

export default function Modifiers({ modifiers, showTitle = true }: LSModifiersProps) {
  return (
    <div className="modifiers-container section-metadata">
      {showTitle && <h4>Modifiers</h4>}

      <div>
        {modifiers
          .filter((modifier) => {
            // Filter out the "Shielded Foes" and "Champion Foes" modifiers as well as any modifiers without an icon
            const { name, icon } = modifier.activityModifier;

            const notShieldedFoes = name !== "Shielded Foes";
            const notChampionFoes = name !== "Champion Foes";
            const notVanguardRank = name !== "Increased Vanguard Rank";
            const notDoubleDrops = name !== "Double Nightfall Drops";

            return icon && notShieldedFoes && notChampionFoes && notVanguardRank && notDoubleDrops;
          })
          .map((modifier) => {
            const { icon, name, description, hash } = modifier.activityModifier;

            return (
              <>
                <Tooltip position="bottom" target=".modifier" />
                <Image
                  src={`https://www.bungie.net${icon}`}
                  alt={name || "modifier"}
                  width="40"
                  height="40"
                  key={`${name}_image`}
                  className="modifier"
                  data-pr-tooltip={`${name}: ${description}`}
                />
              </>
            );
          })}
      </div>
    </div>
  );
}
