import React from "react";

const ActivityLog = ({ logs }) => (
  <div className="activity-log">
    <h4>Activity Log</h4>
    <ul>
      {logs.map((log, i) => (
        <li key={i}>{`${log.user} ${log.action} "${log.title}" at ${new Date(
          log.timestamp
        ).toLocaleTimeString()}`}</li>
      ))}
    </ul>
  </div>
);

export default ActivityLog;
