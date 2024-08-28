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

// Using Ant Design components
const { Panel } = Collapse;
const { Title, Paragraph } = Typography;

// Interface for props
interface DataProps {
  data: ServerData[];
}

// Formatting Functions for different types of data
const formatBlockedKey = (item: [string, number, string]) => (
  <div>
    <p>
      <strong>Key:</strong> {item[0]}
    </p>
    <p>
      <strong>Count:</strong> {item[1]}
    </p>
    <p>
      <strong>Timestamp:</strong> {new Date(item[2]).toLocaleString()}
    </p>
  </div>
);

const formatTopKey = (item: [string, number]) => (
  <div>
    <p>
      <strong>Key:</strong> {item[0]}
    </p>
    <p>
      <strong>Value:</strong> {item[1]}
    </p>
  </div>
);

//Worker has 4 types so using card to display each type
const WorkerCard: React.FC<{ type: string; worker: any }> = ({
  type,
  worker,
}) => (
  <Card title={`Type: ${type}`} style={{ marginBottom: 16 }}>
    <Paragraph>Wait Time: {worker.wait_time}</Paragraph>
    <Paragraph>Workers: {worker.workers}</Paragraph>
    <Paragraph>Waiting: {worker.waiting}</Paragraph>
    <Paragraph>Idle: {worker.idle}</Paragraph>
    <Paragraph>Time To Return: {worker.time_to_return}</Paragraph>

    <Divider>Recently Blocked Keys</Divider>
    {worker.recently_blocked_keys.length > 0 ? (
      <List
        dataSource={worker.recently_blocked_keys}
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
    {worker.top_keys.length > 0 ? (
      <List
        dataSource={worker.top_keys}
        renderItem={(item) => (
          <List.Item>{formatTopKey(item as [string, number])}</List.Item>
        )}
      />
    ) : (
      <Paragraph>No top keys</Paragraph>
    )}
  </Card>
);

// Displaying data in a collapsible format based on the region
const ServerDataDisplay: React.FC<DataProps> = ({ data }) => {
  return (
    <Collapse accordion className="data-container">
      {data.map((entry, index) => (
        <Panel
          header={<Title level={4}>Region: {entry.region}</Title>}
          key={index}
          extra={
            <>
              <Tag color={entry.status ? "green" : "red"}>
                Status: {entry.status ? "Online" : "Offline"}
              </Tag>
              <Tag color={entry.results.services.redis ? "green" : "red"}>
                Redis: {entry.results.services.redis ? "Online" : "Offline"}
              </Tag>
              <Tag color={entry.results.services.database ? "green" : "red"}>
                Database:{" "}
                {entry.results.services.database ? "Online" : "Offline"}
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
                    value={entry.results.stats.servers_count}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Online"
                    value={entry.results.stats.online}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Session"
                    value={entry.results.stats.session}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Active Connections"
                    value={entry.results.stats.server.active_connections}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="CPU Load"
                    value={entry.results.stats.server.cpu_load}
                    precision={2}
                  />
                </Card>
              </Col>
              <Col span={24}>
                <Card>
                  <Statistic
                    title="Timers"
                    value={entry.results.stats.server.timers}
                  />
                </Card>
              </Col>
            </Row>

            <Title level={4}>Workers</Title>
            {entry.results.stats.server.workers.map(([type, worker], index) => (
              <WorkerCard key={index} type={type} worker={worker} />
            ))}
          </Card>
        </Panel>
      ))}
    </Collapse>
  );
};

export default ServerDataDisplay;
