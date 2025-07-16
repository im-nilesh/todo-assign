import React from "react";

const ActivityLog = ({ logs }) => (
  <div className="activity-log">
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
      }}
    >
      <h4>Activity Log</h4>
    </div>
    <ul>
      {logs.length === 0 ? (
        <li style={{ color: "#888", fontStyle: "italic" }}>No activity yet.</li>
      ) : (
        logs.map((log, i) => (
          <li key={i}>
            {`${log.user} ${log.action} "${log.title}" at ${new Date(
              log.timestamp
            ).toLocaleTimeString()}`}
          </li>
        ))
      )}
    </ul>
  </div>
);

export default ActivityLog;
