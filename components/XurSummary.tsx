import { useEffect, useState } from "react";
import dayjs from "dayjs";
import XurExotics from "./XurExotics";
import XurQuestExotics from "./XurQuestExotics";
import XurLegendaryWeapons from "./XurLegendaryWeapons";
import XurLegendaryArmor from "./XurLegendaryArmor";
import CardLoading from "./CardLoading";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import axios from "axios";
import { Tooltip } from "primereact/tooltip";
import { XurItem, XurRes } from "@/global";
import { DestinyVendorDefinition } from "bungie-api-ts/destiny2";

dayjs.extend(utc);

const resetTime = dayjs
  .utc()
  .set("hour", 17)
  .set("minute", 0)
  .set("second", 0)
  .local()
  .format("hh:mm a");

export default function XurSummary() {
  const [xurIsHere, setXurIsHere] = useState<boolean>(false);
  const [xurData, setXurData] = useState<XurItem[]>([]);
  const [xurArrival, setXurArrival] = useState<string>("");
  const [xur, setXur] = useState<DestinyVendorDefinition | undefined>(undefined);

  useEffect(() => {
    const getXurData = async () => {
      try {
        console.log("Getting Xur data");

        const { getVendorDef } = await import("@d2api/manifest-web");

        const res = await axios.get("/api/xur");
        const data: XurRes = res.data;

        const xur = getVendorDef(2190858386);

        setXur(xur);

        setXurData(data.data);
      } catch (err) {
        console.error("Error loading Xur summary: ", err);
      }
    };

    // xur is only around from Friday reset to Tuesday reset
    const now = dayjs.utc();

    const friday = 5;
    const tuesday = 2;

    const weekend = [6, 0, 1];

    if (weekend.includes(now.day())) {
      setXurIsHere(true);
      getXurData();

      return;
    }

    if ((now.day() === friday && now.hour() >= 17) || (now.day() === tuesday && now.hour() < 17)) {
      setXurIsHere(true);
      getXurData();

      return;
    }

    const interval = setInterval(() => {
      const diffInDays = dayjs
        .utc()
        .set("day", 5)
        .hour(17)
        .minute(0)
        .second(0)
        .diff(dayjs.utc(), "days", true);

      const days = Math.floor(diffInDays);
      const hours = Math.floor((diffInDays - days) * 24);
      const minutes = Math.floor(((diffInDays - days) * 24 - hours) * 60);
      const seconds = Math.floor((((diffInDays - days) * 24 - hours) * 60 - minutes) * 60);

      const daysPlural = days === 1 ? "" : "s";
      const hoursPlural = hours === 1 ? "" : "s";
      const minutesPlural = minutes === 1 ? "" : "s";
      const secondsPlural = seconds === 1 ? "" : "s";

      const time = `${days} day${daysPlural}, ${hours} hour${hoursPlural}, ${minutes} minute${minutesPlural}, ${seconds} second${secondsPlural}`;

      setXurArrival(time);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {!xurIsHere ? (
        <div className="out-of-session-card">
          <h2>Xur will be back at {resetTime} on Friday</h2>
          <h3>{xurArrival} from now</h3>
        </div>
      ) : xurData.length && xurIsHere ? (
        <div
          className="section-card"
          style={{
            backgroundImage: `url(https://www.bungie.net${xur?.locations[0].backgroundImagePath})`,
          }}>
          <div className="section-card-inner">
            <Tooltip position="bottom" target=".detail-link" />
            <Link href="/xur" className="detail-link" data-pr-tooltip="View details">
              <div>
                <h3>Leaves Tuesday at {resetTime}</h3>
                <h2>{xur?.displayProperties.name}</h2>
              </div>
            </Link>

            <XurExotics items={xurData} />
            <XurQuestExotics items={xurData} />
            <XurLegendaryWeapons items={xurData} />

            <XurLegendaryArmor />
          </div>
        </div>
      ) : (
        // TODO loading component
        <CardLoading dataName="Xur's inventory" />
      )}
    </>
  );
}
