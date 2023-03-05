import startUpdate from "../helpers/manifestPopulation/startUpdate";
import prisma from "../lib/prisma";
import axios from "axios";
import genLostSectorSchedule from "./genLostSectorSchedule";
import genNightfallSchedule from "./genNightfallSchedule";

export default async function updateManifest() {
  try {
    console.time("manifest_population");

    const manifestRes = await axios.get(process.env.BUNGIE_MANIFEST_BASE_URL!);

    const { data: manifestResJson } = manifestRes;

    const version: string = manifestResJson.Response.version;

    // if not, delete the old one and create a new one
    await prisma.manifest.deleteMany({});
    await prisma.manifest.create({
      data: {
        version,
      },
    });

    // delete all existing lost sector days, we'll repopulate them later
    await prisma.lostSectorDay.deleteMany({});
    await prisma.nightfallWeek.deleteMany({});

    await startUpdate(manifestResJson);

    // repopulate lost sector days and nightfall weeks
    await genLostSectorSchedule();
    await genNightfallSchedule();

    console.timeEnd("manifest_population");

    console.log("Manifest is updated");
  } catch (error) {
    console.log(error);
  }
}
