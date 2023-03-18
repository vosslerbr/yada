import { ActivityModifier, ActivityModifiersOnActivity } from "@prisma/client";
import Image from "next/image";
import { Tooltip } from "primereact/tooltip";
import { Fragment } from "react";

interface LSModifiersProps {
  modifiers: (ActivityModifiersOnActivity & { activityModifier: ActivityModifier })[];
}

export default function Champions({ modifiers }: LSModifiersProps) {
  const championsObject = modifiers.find((modifier: any) => {
    return modifier.activityModifier.name === "Champion Foes";
  });

  if (!championsObject) {
    return <></>;
  }

  const championNameMap: { [key: string]: string } = {
    Disruption: "Overload",
    Stagger: "Unstoppable",
    "Shield-Piercing": "Barrier",
  };

  const { description } = championsObject.activityModifier;

  let regex = /\[([^\]]+)\]/g;
  let match: RegExpExecArray | null;
  let championTypes: string[] = [];

  while ((match = regex.exec(description ?? "")) !== null) {
    championTypes.push(match[1]);
  }

  const champions = championTypes.map((championType: string) => {
    const champName = championNameMap[championType];

    return (
      <Fragment key={`${champName}_image`}>
        <Tooltip position="bottom" target=".champion-image" />
        <Image
          src={`/${champName.toLowerCase()}.png`}
          alt={champName}
          width="48"
          height="48"
          className="champion-image"
          data-pr-tooltip={champName}
        />
      </Fragment>
    );
  });

  return (
    <div className="champions-container section-metadata">
      <h4>Champions</h4>
      <div>{champions}</div>
    </div>
  );
}
