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
  difficulties: NightfallWeek[];
  grandmaster: NightfallWeek;
}

export interface NightfallWeekData extends NightfallWeek {
  activity: DestinyActivityDefinition | undefined;
  modifiers: (DestinyActivityModifierDefinition | undefined)[];
}

export interface XurItem {
  costs: { hasConditionalVisibility: boolean; itemHash: number; quantity: number }[];
  itemHash: number;
  quantity: number;
  vendorItemIndex: number;
}
export interface XurRes {
  success: boolean;
  data: XurItem[];
}
