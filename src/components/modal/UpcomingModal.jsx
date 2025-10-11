import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function UpcomingModal({ isOpen, onClose, selectedTestItem }) {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!selectedTestItem) return;

    const updateCountdown = () => {
      const now = new Date();
      const sessionTime = new Date(selectedTestItem.session_time);
      const diff = sessionTime - now;

      if (diff <= 0) {
        setCountdown("Started");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [selectedTestItem]);

  if (!selectedTestItem) return null;

  return (
    <Dialog
      header="Upcoming Test"
      visible={isOpen}
      onHide={onClose}
      style={{ width: "350px" }}
      className="rounded-4xl"
    >
      <div className="flex flex-col items-center justify-center text-center p-4">
        <InfoOutlinedIcon sx={{ fontSize: "3rem", color: "#7E848945" }} />
        <h2 className="text-lg font-semibold text-[#2C2E42] mt-4">
          {selectedTestItem.topic_name}
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Starts in: {countdown}
        </p>
      </div>
    </Dialog>
  );
}
