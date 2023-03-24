/**
 * @description Displays a loading card with a progress bar
 */

import { ProgressBar } from "primereact/progressbar";

export default function CardLoading({ dataName }: { dataName: string }) {
  return (
    <div className="section-card">
      <div className="loading-container">
        <h2>Loading {dataName}...</h2>
        <ProgressBar mode="indeterminate" style={{ height: "6px" }}></ProgressBar>
      </div>
    </div>
  );
}
