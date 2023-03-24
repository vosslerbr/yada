import dayjs from "dayjs";
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import lostSectorOrder from "@/helpers/lostSectorOrderS20";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // only accept a post request
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  console.log("generating lost sector schedule...");
  console.time("lost sector schedule generated");

  // delete all existing lost sector days
  await prisma.lostSectorDay.deleteMany({});

  const armorOrder = [
    "Exotic Chest Armor",
    "Exotic Helmet",
    "Exotic Leg Armor",
    "Exotic Gauntlets",
  ];

  const startDate = dayjs("02/28/2023").startOf("day").add(11, "hour"); // The first day we want to start the schedule
  const lastDayOfSeason = dayjs("05/22/2023 11:00:00", "MM/DD/YYYY HH:mm:ss");

  // this how many resets we have in the season
  const numberOfDays = lastDayOfSeason.diff(startDate, "day");

  // this is the schedule we will build
  const lostSectorDays: Prisma.LostSectorDayCreateInput[] = [];

  let armorIndex = 0;
  let lostSectorIndex = 0;

  // loop through each day of the season
  for (let i = 0; i <= numberOfDays; i++) {
    const firstResetTimestamp =
      dayjs("02/28/2023").startOf("day").add(11, "hour").unix() + 86400 * i;

    // need resetTimestamp as a date
    const reset = dayjs.unix(firstResetTimestamp).toISOString();

    // ends at next reset
    const nextReset = dayjs.unix(firstResetTimestamp + 86400).toISOString();

    // we only have 4 armor types so  we need to loop through them repeatedly
    const rewardName = armorOrder[armorIndex];
    const lostSector = lostSectorOrder[lostSectorIndex];

    // reset armor loop if needed
    if (armorIndex === armorOrder.length - 1) {
      armorIndex = 0;
    } else {
      armorIndex++;
    }

    // reset lost sector loop if needed
    if (lostSectorIndex === lostSectorOrder.length - 1) {
      lostSectorIndex = 0;
    } else {
      lostSectorIndex++;
    }

    const lostSectorDay: Prisma.LostSectorDayCreateInput = {
      activityHash: lostSector.hash,
      startsAt: reset,
      endsAt: nextReset,
      name: lostSector.name,
      rewardType: rewardName,
    };

    lostSectorDays.push(lostSectorDay);
  }

  await prisma.lostSectorDay.createMany({
    data: lostSectorDays,
  });

  console.timeEnd("lost sector schedule generated");
  console.log("lost sector schedule generated");

  res.status(200).json({ success: true, message: "Created lost sector schedule" });
}
