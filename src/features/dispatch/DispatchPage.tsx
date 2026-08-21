import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DispatchTab from "./components/DispatchTab";
import {
  type IncomingBooking,
  SAMPLE_INCOMING_BOOKINGS,
} from "../dashboard/types";

function DispatchPageComponent() {
  const navigate = useNavigate();
  const [incomingBookings, setIncomingBookings] = useState<IncomingBooking[]>(
    SAMPLE_INCOMING_BOOKINGS,
  );

  const handleDeleteBooking = useCallback((id: string) => {
    setIncomingBookings((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleAssignVendorRedirect = useCallback(() => {
    navigate("/vendors");
  }, [navigate]);

  const handleOpenBookingModal = useCallback(() => {
    // Modal logic to be added
  }, []);

  return (
    <div className="flex flex-col w-full h-full relative">
      <DispatchTab
        incomingBookings={incomingBookings}
        onManualBookingClick={handleOpenBookingModal}
        onAssignVendorClick={handleAssignVendorRedirect}
        onDeleteBooking={handleDeleteBooking}
      />
    </div>
  );
}

export default React.memo(DispatchPageComponent);
