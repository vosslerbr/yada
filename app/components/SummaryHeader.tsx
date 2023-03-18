import React from "react";

const SummaryHeader = (imageUrl: string | null) => {
  return (
    <div
      style={{
        backgroundImage: `url(https://www.bungie.net${imageUrl})`,
      }}>
      SummaryHeader
    </div>
  );
};

export default SummaryHeader;
