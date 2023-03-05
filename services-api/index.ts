import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import updateManifest from "./controllers/manifest";
import genLostSectorSchedule from "./controllers/genLostSectorSchedule";
import axios from "axios";
import prisma from "./lib/prisma";
import genNightfallSchedule from "./controllers/genNightfallSchedule";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/manifest", async (req: Request, res: Response) => {
  try {
    const manifestRes = await axios.get(process.env.BUNGIE_MANIFEST_BASE_URL!);

    const { data: manifestResJson } = manifestRes;

    const version: string = manifestResJson.Response.version;

    // check if the manifest record in the db is the same as the one we just fetched
    const manifestRecord = await prisma.manifest.findFirst({
      where: {
        version,
      },
    });

    if (manifestRecord) {
      console.log("Manifest is up to date");

      res.status(200).json({ message: "Manifest is already up to date", success: true });

      return;
    }

    updateManifest();

    res.status(200).json({ message: "Manifest is being updated", success: true });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "failed to update manifest", success: false });
  }
});

app.get("/schedule/lost-sector", async (req: Request, res: Response) => {
  try {
    await genLostSectorSchedule();

    res.status(200).json({ message: "created lost sector days", success: true });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "failed to create lost sector schedule", success: false });
  }
});

app.get("/schedule/nightfall", async (req: Request, res: Response) => {
  try {
    await genNightfallSchedule();

    res.status(200).json({ message: "created nightfall weeks", success: true });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "failed to create nightfall schedule", success: false });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
