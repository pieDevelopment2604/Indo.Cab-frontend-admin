import React from "react";
import LiveTrackingTab from "./components/LiveTrackingTab";

function TrackingPageComponent() {
  return (
    <div className="flex flex-col w-full h-full relative">
      <LiveTrackingTab />
    </div>
  );
}

export default React.memo(TrackingPageComponent);
