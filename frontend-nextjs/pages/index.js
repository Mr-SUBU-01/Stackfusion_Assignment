import { useEffect, useState } from "react";
import SlotGrid from "../components/SlotGrid";
import { fetchAvailableSlots, fetchLots } from "../lib/api";

export default function HomePage() {
  const [lots, setLots] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedLot, setSelectedLot] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLots()
      .then(setLots)
      .catch((err) => setError(err.message));
  }, []);

  async function loadSlots() {
    try {
      setError("");
      if (!selectedLot) {
        setError("Please select a parking lot");
        return;
      }
      const parsed = await fetchAvailableSlots(selectedLot);
      setSlots(parsed);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ background: "#eef2f7", minHeight: "100vh", padding: "30px" }}>
      <main
        style={{
          maxWidth: 700,
          margin: "auto",
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          🚗 Parking Management Dashboard
        </h1>

        <div style={{ marginBottom: 15 }}>
          <label>Parking Lot: </label>
          <select
            value={selectedLot}
            onChange={(e) => setSelectedLot(e.target.value)}
            style={{ padding: "8px", width: "100%", marginTop: "5px" }}
          >
            <option value="">Select lot</option>
            {lots.map((lot) => (
              <option key={lot.id} value={lot.id}>
                {lot.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Vehicle ID: </label>
          <input
            type="number"
            placeholder="Enter vehicle ID (1–4)"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            style={{ padding: "8px", width: "100%", marginTop: "5px" }}
          />
        </div>

        <button
          onClick={loadSlots}
          style={{
            width: "100%",
            padding: "10px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "10px"
          }}
        >
          Load Available Slots
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <h3 style={{ marginTop: 20 }}>Available Slots</h3>

        <SlotGrid
          slots={slots}
          selectedVehicle={selectedVehicle}
          fetchSlots={loadSlots}
        />
      </main>
    </div>
  );
}