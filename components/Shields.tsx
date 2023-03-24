import { ActivityModifier, ActivityModifiersOnActivity } from "@prisma/client";
import Image from "next/image";
import { Tooltip } from "primereact/tooltip";
import { Fragment } from "react";

interface LSModifiersProps {
  modifiers: (ActivityModifiersOnActivity & { activityModifier: ActivityModifier })[];
}

export default function Shields({ modifiers }: LSModifiersProps) {
  const shieldsObject = modifiers.find((modifier: any) => {
    return modifier.activityModifier.name === "Shielded Foes";
  });

  if (!shieldsObject) {
    return <></>;
  }

  const { description } = shieldsObject.activityModifier;

  let regex = /\[([^\]]+)\]/g;
  let match: RegExpExecArray | null;
  let shieldTypes: string[] = [];

  while ((match = regex.exec(description ?? "")) !== null) {
    shieldTypes.push(match[1]);
  }

  const shields = shieldTypes.map((shieldType: string) => {
    return (
      <Fragment key={`${shieldType}_image`}>
        <Tooltip position="bottom" target=".shield-image" />
        <Image
          src={`/${shieldType.toLowerCase()}.png`}
          alt={shieldType}
          width="40"
          height="40"
          className="shield-image"
          data-pr-tooltip={shieldType}
        />
      </Fragment>
    );
  });

  return (
    <div className="shields-container section-metadata">
      <h4>Shields</h4>
      <div>{shields}</div>
    </div>
  );
}
