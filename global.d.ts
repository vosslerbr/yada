import {
  Activity,
  ActivityModifier,
  ActivityModifiersOnActivity,
  Collectible,
  InventoryItem,
  LostSectorDay,
  NightfallWeek,
} from "@prisma/client";

import {
  DestinyActivityDefinition,
  DestinyActivityModifierDefinition,
  DestinyInventoryItemDefinition,
} from "bungie-api-ts/destiny2";

export interface ClassTypeMap {
  [key: number]: string;
}

export interface LostSectorData extends LostSectorDay {
  activity: DestinyActivityDefinition | undefined;
  modifiers: (DestinyActivityModifierDefinition | undefined)[];
  rewards: (DestinyInventoryItemDefinition | undefined)[];
}

export interface NightfallData {
  name: string | null | undefined;
  keyart: string | null | undefined;
  difficulties: (
    | (NightfallWeek & {
        activity: Activity & {
          modifiers: (ActivityModifiersOnActivity & {
            activityModifier: ActivityModifier;
          })[];
        };
      })
    | undefined
  )[];
  grandmaster:
    | (NightfallWeek & {
        activity: Activity & {
          modifiers: (ActivityModifiersOnActivity & {
            activityModifier: ActivityModifier;
          })[];
        };
      })
    | undefined;
}
