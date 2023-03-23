import {
  Activity,
  ActivityModifier,
  ActivityModifiersOnActivity,
  Collectible,
  InventoryItem,
  LostSectorDay,
  NightfallWeek,
} from "@prisma/client";

export interface ClassTypeMap {
  [key: number]: string;
}

export interface LostSectorData extends LostSectorDay {
  activity: Activity;
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
