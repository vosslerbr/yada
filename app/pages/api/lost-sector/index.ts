import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed", success: false });

    return;
  }

  const allLostSectorDays = await prisma.lostSectorDay.findMany();

  if (!allLostSectorDays.length) {
    res.status(500).json({ message: "Lost sector data not found", success: false });

    return;
  }

  // return the data
  res.status(200).json(allLostSectorDays);
}
