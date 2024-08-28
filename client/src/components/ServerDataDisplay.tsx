import React from "react";
import { ServerData } from "../types/serverData";

interface DataProps {
  data: ServerData[];
}

const ServerDataDisplay: React.FC<DataProps> = ({ data }) => {
  return (
    <div className="data-container">
      {data.map((entry, index) => (
        <div key={index} className="data-entry">
          <h1>Region : {entry.region}</h1>
          <p>Status : {entry.status}</p>
          <p>
            Redis : {entry.results.services.database ? "Online" : "Offline"}
          </p>
          <p>
            Database : {entry.results.services.database ? "Online" : "Offline"}
          </p>
          <h2>Stats</h2>
          <p>Servers Count : {entry.results.stats.servers_count}</p>
          <p>Online : {entry.results.stats.online}</p>
          <p>Session : {entry.results.stats.session}</p>
          <p>
            Active Connections : {entry.results.stats.server.active_connections}
          </p>
          <p>CPU Load : {entry.results.stats.server.cpu_load}</p>
          <p>Timers : {entry.results.stats.server.timers}</p>
          <h2>Workers</h2>
          {entry.results.stats.server.workers.map(([type, worker], index) => (
            <div key={index} className="data-entry">
              <h3>Type : {type}</h3>
              <p>Wait Time : {worker.wait_time}</p>
              <p>Workers : {worker.workers}</p>
              <p>Waiting : {worker.waiting}</p>
              <p>Idle : {worker.idle}</p>
              <p>Time To Return : {worker.time_to_return}</p>
              <p>
                Recently Blocked Keys :{" "}
                {JSON.stringify(worker.recently_blocked_keys)}
              </p>
              <p>Top Keys : {JSON.stringify(worker.top_keys)}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ServerDataDisplay;
