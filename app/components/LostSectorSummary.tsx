import { LostSectorData } from "@/global";
import CardLoading from "./CardLoading";
import Champions from "./Champions";
import Modifiers from "./Modifiers";
import Rewards from "./Rewards";
import Shields from "./Shields";
import Link from "next/link";
import { LinearProgress, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

export default function LostSectorSummary() {
  const [data, setData] = useState<LostSectorData[]>([]);
  const [selectedDay, setSelectedDay] = useState<LostSectorData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [seasonProgress, setSeasonProgress] = useState(0);

  const fetchLostSectors = async () => {
    const { data: lostSectors }: { data: LostSectorData[] } = await axios.get("/api/lost-sector");

    setData(lostSectors);

    // find the index of the current day
    const todaysLostSector = lostSectors.find((lostSectorDay) => {
      const now = dayjs();

      return (
        dayjs(lostSectorDay.startsAt).isBefore(now) && dayjs(lostSectorDay.endsAt).isAfter(now)
      );
    });

    if (todaysLostSector) {
      setSelectedDay(todaysLostSector);

      // find the index of the current day
      const todaysLostSectorIndex = lostSectors.findIndex((lostSectorDay) => {
        const now = dayjs();

        return (
          dayjs(lostSectorDay.startsAt).isBefore(now) && dayjs(lostSectorDay.endsAt).isAfter(now)
        );
      });

      setSelectedIndex(todaysLostSectorIndex);
    }
  };

  const handlePageOverClick = (direction: string) => {
    if (direction === "next") {
      setSelectedIndex((prevState) => {
        if (prevState === data.length - 1) {
          return 0;
        }

        return prevState + 1;
      });
    } else {
      setSelectedIndex((prevState) => {
        if (prevState === 0) {
          return data.length - 1;
        }

        return prevState - 1;
      });
    }
  };

  // when the selected index changes, update the selected day
  useEffect(() => {
    setSelectedDay(data[selectedIndex]);
  }, [selectedIndex]);

  useEffect(() => {
    fetchLostSectors();
  }, []);

  if (!data.length || !selectedDay) {
    return <CardLoading dataName="lost sector" />;
  }

  return (
    <>
      <div
        className="section-card"
        style={{
          backgroundImage: `url(https://www.bungie.net${selectedDay.activity.pgcrImage})`,
        }}>
        <div className="section-card-inner">
          {" "}
          <Tooltip title="View details" placement="left" arrow>
            <Link href={`/lost-sector/${selectedDay.id}`}>
              <div>
                <h3>Today&apos;s Lost Sector is</h3>
                <h2>{selectedDay.name}</h2>
              </div>
            </Link>
          </Tooltip>
          <Rewards rewards={selectedDay.rewards} />
          <Shields modifiers={selectedDay.activity.modifiers} />
          <Champions modifiers={selectedDay.activity.modifiers} />
          <Modifiers modifiers={selectedDay.activity.modifiers} />
          <p className="footnote">Lost sectors change every day at reset.</p>
          <div className="summary-pagination">
            <button
              className="summary-page-over"
              onClick={() => {
                handlePageOverClick("prev");
              }}>
              <ArrowBack fontSize="medium" />
            </button>

            <p>{dayjs(selectedDay.startsAt).format("MM/DD/YYYY")}</p>

            <button
              className="summary-page-over"
              onClick={() => {
                handlePageOverClick("next");
              }}>
              <ArrowForward fontSize="medium" />
            </button>
          </div>
        </div>
      </div>
      {/* <LinearProgress variant="determinate" value={((selectedIndex + 1) / data.length) * 100} /> */}
    </>
  );
}
