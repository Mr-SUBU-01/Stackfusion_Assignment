import { createBooking } from "../lib/api";
import { useState, useEffect } from "react";

export default function SlotGrid({ slots, selectedVehicle, fetchSlots }) {
  const [loadingSlot, setLoadingSlot] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Auto remove message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  async function handleBook(slotId) {
    if (!selectedVehicle) {
      setMessage("⚠️ Please enter a vehicle ID");
      return;
    }

    try {
      setLoadingSlot(slotId);
      setMessage("");

      await createBooking({
        vehicle: Number(selectedVehicle),
        slot: slotId
      });

      setMessage("✅ Booking created successfully");
      fetchSlots();

    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoadingSlot(null);
    }
  }

  if (!slots.length) {
    return <p>No slots found.</p>;
  }

  return (
    <div>
      {/* ✅ Message */}
      {message && (
        <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
          {message}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gap: "10px",
          gridTemplateColumns: "repeat(3, 1fr)"
        }}
      >
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => handleBook(slot.id)}
            disabled={slot.is_occupied || loadingSlot === slot.id}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              cursor: slot.is_occupied ? "not-allowed" : "pointer",
              background: slot.is_occupied ? "#ef4444" : "#22c55e",
              color: "white",
              fontWeight: "bold",
              opacity: slot.is_occupied ? 0.6 : 1
            }}
          >
            {loadingSlot === slot.id ? "Booking..." : `Slot ${slot.number}`}
            <br />
            {slot.is_occupied ? "Occupied" : "Free"}
          </button>
        ))}
      </div>
    </div>
  );
}