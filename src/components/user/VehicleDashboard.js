import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VEHICLE_TYPES = [
  { id: "ambulance", label: "Ambulance", emoji: "🚑" },
  { id: "cab",       label: "Cab",       emoji: "🚕" },
  { id: "auto",      label: "Auto",      emoji: "🛺" },
  { id: "bike",      label: "Bike",      emoji: "🏍️" },
];

// Mock registered / nearby users per vehicle type
const VEHICLE_USERS = {
  ambulance: [
    { id: 1, name: "Apollo Emergency",    vehicleNo: "TS09 EM 1122", distance: "1.2 km",  eta: "4 min",  status: "Available" },
    { id: 2, name: "City Care Ambulance", vehicleNo: "TS07 AB 3344", distance: "2.8 km",  eta: "9 min",  status: "On Trip"   },
    { id: 3, name: "LifeSaver 24x7",      vehicleNo: "TS05 LS 9988", distance: "3.4 km",  eta: "12 min", status: "Available" },
  ],
  cab: [
    { id: 4, name: "Suresh Kumar",  vehicleNo: "TS08 CB 4455", distance: "0.9 km", eta: "3 min", status: "Available" },
    { id: 5, name: "Anjali Reddy", vehicleNo: "TS10 CB 6677", distance: "2.1 km", eta: "8 min", status: "Available" },
    { id: 6, name: "Ravi Teja",    vehicleNo: "TS06 CB 8899", distance: "4.3 km", eta: "15 min", status: "On Trip" },
  ],
  auto: [
    { id: 7, name: "Mahesh Auto",    vehicleNo: "TS03 AU 2211", distance: "0.6 km", eta: "2 min", status: "Available" },
    { id: 8, name: "Ganesh R",       vehicleNo: "TS09 AU 5544", distance: "1.8 km", eta: "6 min", status: "Available" },
    { id: 9, name: "Sridhar Auto",   vehicleNo: "TS02 AU 7788", distance: "3.0 km", eta: "10 min", status: "Offline" },
  ],
  bike: [
    { id: 10, name: "QuickMed Rider 1", vehicleNo: "TS01 BK 1234", distance: "0.4 km", eta: "2 min", status: "Available" },
    { id: 11, name: "QuickMed Rider 2", vehicleNo: "TS04 BK 5678", distance: "1.5 km", eta: "5 min", status: "On Trip" },
    { id: 12, name: "Rider Partner",    vehicleNo: "TS08 BK 9101", distance: "3.7 km", eta: "13 min", status: "Available" },
  ],
};

// Default color palette (same style as rest of app)
const DEFAULT_COLORS = {
  primary:  "#009688",
  mint:     "#4DB6AC",
  softbg:   "#E0F2F1",
  white:    "#FFFFFF",
  darktext: "#124441",
  softtext: "#4F6F6B",
};

const statusColor = (status, theme) => {
  if (status === "Available") return "#4CAF50";
  if (status === "On Trip")   return "#FF9800";
  if (status === "Offline")   return "#9E9E9E";
  return theme.primary;
};

const VehicleDashboard = ({ setActiveView, addNotification, colors }) => {
  const navigate = useNavigate();

  // Use passed colors or fallback defaults
  const theme = colors || DEFAULT_COLORS;

  // Use passed notification handler or fallback to console.log
  const notify =
    addNotification ||
    ((title, message, type = "info") =>
      console.log(`[${type}] ${title}: ${message}`));

  const [selectedType, setSelectedType] = useState("ambulance");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  const [search, setSearch] = useState("");

  const selectedUsers = VEHICLE_USERS[selectedType] || [];

  const filteredUsers = selectedUsers.filter((u) => {
    if (showOnlyAvailable && u.status !== "Available") return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.vehicleNo.toLowerCase().includes(q)
    );
  });

  const handleTypeClick = (type) => {
    setSelectedType(type.id);
    setSearch("");
    setShowOnlyAvailable(true);
    notify(
      "Vehicle Type Selected",
      `${type.label} vehicles near your location are shown.`,
      "info"
    );
  };

  const handleRequestClick = (user) => {
    notify(
      "Vehicle Request Sent",
      `Request sent to ${user.name} (${user.vehicleNo}). ETA: ${user.eta}`,
      selectedType === "ambulance" ? "emergency" : "order"
    );
    alert(
      `Request sent to ${user.name}\nVehicle: ${user.vehicleNo}\nETA: ${user.eta}`
    );
  };

  // Back button: use dashboard view if provided, else go back one page
  const handleBack = () => {
    if (setActiveView) {
      setActiveView("dashboard");
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      style={{
        padding: "24px 16px 40px",
        maxWidth: "1200px",
        margin: "140px auto 0",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              color: theme.primary,
              fontWeight: "bold",
            }}
          >
            Vehicle Dashboard
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              color: theme.softtext,
              fontSize: "14px",
            }}
          >
            Choose a vehicle type to view registered / available partners near
            your location.
          </p>
        </div>

        <button
          onClick={handleBack}
          style={{
            padding: "8px 16px",
            borderRadius: 20,
            border: "1px solid " + theme.mint,
            background: "#fff",
            color: theme.primary,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Vehicle type selector */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {VEHICLE_TYPES.map((type) => {
          const isActive = selectedType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => handleTypeClick(type)}
              style={{
                borderRadius: 14,
                padding: "14px 12px",
                border: isActive
                  ? `2px solid ${theme.primary}`
                  : `1px solid ${theme.mint}55`,
                backgroundColor: isActive ? theme.primary : "#ffffff",
                color: isActive ? "#ffffff" : theme.darktext,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "all 0.2s ease",
                boxShadow: isActive
                  ? "0 6px 18px rgba(0,0,0,0.15)"
                  : "0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 6 }}>
                {type.emoji}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{type.label}</div>
              <div
                style={{
                  fontSize: 11,
                  marginTop: 4,
                  opacity: 0.8,
                }}
              >
                {type.id === "ambulance"
                  ? "Emergency support"
                  : type.id === "cab"
                  ? "Comfort ride"
                  : type.id === "auto"
                  ? "Short city trips"
                  : "Fast delivery partner"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter + search */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 13, color: theme.softtext }}>
          Showing{" "}
          <strong style={{ color: theme.primary }}>
            {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
          </strong>{" "}
          near you (within 5 km)
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: theme.softtext,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={(e) => setShowOnlyAvailable(e.target.checked)}
            />{" "}
            Only show available
          </label>

          <input
            type="text"
            placeholder="Search by name or vehicle no."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "7px 10px",
              borderRadius: 20,
              border: `1px solid ${theme.mint}77`,
              fontSize: 13,
              minWidth: 220,
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Users list */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 14,
          padding: 16,
          boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
        }}
      >
        {filteredUsers.length === 0 ? (
          <div
            style={{
              padding: "20px 10px",
              textAlign: "center",
              fontSize: 14,
              color: theme.softtext,
            }}
          >
            No {selectedType} partners available with the current filters.
            <br />
            Try removing search or "only available" filter.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
            }}
          >
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                style={{
                  borderRadius: 12,
                  border: `1px solid ${theme.mint}40`,
                  padding: "12px 12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: 14,
                        color: theme.darktext,
                      }}
                    >
                      {user.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: theme.softtext,
                      }}
                    >
                      {user.vehicleNo}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "3px 8px",
                      borderRadius: 12,
                      backgroundColor: statusColor(user.status, theme),
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {user.status}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: theme.softtext,
                  }}
                >
                  <span>Distance: {user.distance}</span>
                  <span>ETA: {user.eta}</span>
                </div>

                <button
                  disabled={user.status !== "Available"}
                  onClick={() => handleRequestClick(user)}
                  style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    borderRadius: 999,
                    border: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor:
                      user.status === "Available" ? "pointer" : "not-allowed",
                    backgroundColor:
                      user.status === "Available"
                        ? theme.primary
                        : "#CCCCCC",
                    color: "#fff",
                  }}
                >
                  {selectedType === "ambulance"
                    ? "Request Ambulance"
                    : "Request Ride"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDashboard;
