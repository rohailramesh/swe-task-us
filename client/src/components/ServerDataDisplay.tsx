import React from "react";
import {
  Collapse,
  Card,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  List,
  Divider,
} from "antd";
import { ServerData } from "../types/serverData";

const { Panel } = Collapse;
const { Title, Paragraph } = Typography;

// Interface for props
interface DataProps {
  data: ServerData[];
}

// Formatting Functions for different types of data
const formatBlockedKey = (item: [string, number, string]) => {
  if (!item || item.length !== 3) return <div>Invalid blocked key data</div>;

  const [key, count, timestamp] = item;

  return (
    <div>
      <p>
        <strong>Key:</strong> {key}
      </p>
      <p>
        <strong>Count:</strong> {count}
      </p>
      <p>
        <strong>Timestamp:</strong> {new Date(timestamp).toLocaleString()}
      </p>
    </div>
  );
};

const formatTopKey = (item: [string, number]) => {
  if (!item || item.length !== 2) return <div>Invalid top key data</div>;

  const [key, value] = item;

  return (
    <div>
      <p>
        <strong>Key:</strong> {key}
      </p>
      <p>
        <strong>Value:</strong> {value}
      </p>
    </div>
  );
};

// Worker has 4 types so using card to display each type
const WorkerCard: React.FC<{ type: string; worker: any }> = ({
  type,
  worker,
}) => {
  if (!worker)
    return (
      <Card title={`Type: ${type}`} style={{ marginBottom: 16 }}>
        No worker data
      </Card>
    );

  const {
    wait_time,
    workers,
    waiting,
    idle,
    time_to_return,
    recently_blocked_keys = [],
    top_keys = [],
  } = worker;

  return (
    <Card title={`Type: ${type}`} style={{ marginBottom: 16 }}>
      <Paragraph>Wait Time: {wait_time ?? "N/A"}</Paragraph>
      <Paragraph>Workers: {workers ?? "N/A"}</Paragraph>
      <Paragraph>Waiting: {waiting ?? "N/A"}</Paragraph>
      <Paragraph>Idle: {idle ?? "N/A"}</Paragraph>
      <Paragraph>Time To Return: {time_to_return ?? "N/A"}</Paragraph>

      <Divider>Recently Blocked Keys</Divider>
      {recently_blocked_keys.length > 0 ? (
        <List
          dataSource={recently_blocked_keys}
          renderItem={(item) => (
            <List.Item>
              {formatBlockedKey(item as [string, number, string])}
            </List.Item>
          )}
        />
      ) : (
        <Paragraph>No recently blocked keys</Paragraph>
      )}

      <Divider>Top Keys</Divider>
      {top_keys.length > 0 ? (
        <List
          dataSource={top_keys}
          renderItem={(item) => (
            <List.Item>{formatTopKey(item as [string, number])}</List.Item>
          )}
        />
      ) : (
        <Paragraph>No top keys</Paragraph>
      )}
    </Card>
  );
};

// Displaying data in a collapsible format based on the region
const ServerDataDisplay: React.FC<DataProps> = ({ data }) => {
  if (!data || !Array.isArray(data)) return <div>No data available</div>;

  return (
    <Collapse accordion className="data-container">
      {data.map((entry, index) => {
        if (
          !entry ||
          !entry.results ||
          !entry.results.stats ||
          !entry.results.stats.server
        ) {
          return (
            <Panel
              header={
                <Title level={4}>Region: {entry.region || "Unknown"}</Title>
              }
              key={index}
            >
              <Card>No valid data available for this entry</Card>
            </Panel>
          );
        }

        const { region, status, results } = entry;
        const { stats } = results;
        const { server } = stats;

        return (
          <Panel
            header={<Title level={4}>Region: {region || "Unknown"}</Title>}
            key={index}
            extra={
              <>
                <Tag color={status ? "green" : "red"}>
                  Status: {status ? "Online" : "Offline"}
                </Tag>
                <Tag color={results.services.redis ? "green" : "red"}>
                  Redis: {results.services.redis ? "Online" : "Offline"}
                </Tag>
                <Tag color={results.services.database ? "green" : "red"}>
                  Database: {results.services.database ? "Online" : "Offline"}
                </Tag>
              </>
            }
          >
            <Card>
              <Title level={4}>Stats</Title>
              <Row gutter={16}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Servers Count"
                      value={stats.servers_count ?? 0}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic title="Online" value={stats.online ?? 0} />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic title="Session" value={stats.session ?? 0} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Active Connections"
                      value={server.active_connections ?? 0}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="CPU Load"
                      value={server.cpu_load ?? 0}
                      precision={2}
                    />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    <Statistic title="Timers" value={server.timers ?? 0} />
                  </Card>
                </Col>
              </Row>

              <Title level={4}>Workers</Title>
              {server.workers && server.workers.length > 0 ? (
                server.workers.map(([type, worker], index) => (
                  <WorkerCard key={index} type={type} worker={worker} />
                ))
              ) : (
                <Paragraph>No worker data available</Paragraph>
              )}
            </Card>
          </Panel>
        );
      })}
    </Collapse>
  );
};

export default ServerDataDisplay;
