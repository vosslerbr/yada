import fs from "fs";
import dayjs from "dayjs";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import nightfallOrder from "@/helpers/nightfallOrderS20";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // only accept a post request
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // delete all existing nightfall weeks
  await prisma.nightfallWeek.deleteMany({});

  const startDate = dayjs("02/28/2023").startOf("day").add(11, "hour"); // The first day we want to start the schedule

  const lastDayOfSeason = dayjs("05/22/2023 11:00:00", "MM/DD/YYYY HH:mm:ss");

  // this how many resets we have in the season
  const numberOfWeeks = lastDayOfSeason.diff(startDate, "week");

  const nightfallWeeks: Prisma.NightfallWeekCreateInput[] = [];

  // starting index for nightfall
  let nightfallIndex = 0;

  // loop through each day of the season
  for (let i = 0; i <= numberOfWeeks; i++) {
    const firstResetTimestamp =
      dayjs("02/28/2023").startOf("day").add(11, "hour").unix() + 604800 * i;

    // need resetTimestamp as a date
    const reset = dayjs.unix(firstResetTimestamp).toISOString();

    // ends at next weekly reset
    const nextReset = dayjs.unix(firstResetTimestamp + 604800).toISOString();

    const nightfall = nightfallOrder[nightfallIndex];

    if (nightfallIndex === nightfallOrder.length - 1) {
      nightfallIndex = 0;
    } else {
      nightfallIndex++;
    }

    const difficulties = Object.keys(nightfall.difficulties);

    // create a nightfall week for each difficulty
    difficulties.forEach((difficulty) => {
      const nightfallWeek: Prisma.NightfallWeekCreateInput = {
        startsAt: reset,
        endsAt: nextReset,
        name: nightfall.name,
        difficulty,
        activity: {
          connect: {
            hash: nightfall.difficulties[difficulty],
          },
        },
      };

      nightfallWeeks.push(nightfallWeek);
    });
  }

  // create all the nightfall weeks
  for (const nightfallWeek of nightfallWeeks) {
    await prisma.nightfallWeek.create({
      data: nightfallWeek,
    });
  }
}
