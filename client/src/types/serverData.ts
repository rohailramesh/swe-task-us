//Interface created based on the upscope endpoints given
export interface WorkerStats {
  wait_time: number;
  workers: number;
  waiting: number;
  idle: number;
  time_to_return: number;
  recently_blocked_keys: Array<[string, number, string]>;
  top_keys: Array<[string, number]>;
}

export interface ServerData {
  status: string;
  region: string;
  roles: string[];
  results: {
    services: {
      redis: boolean;
      database: boolean;
    };
    stats: {
      servers_count: number;
      online: number;
      session: number;
      server: {
        active_connections: number;
        wait_time: number;
        workers: Array<[string, WorkerStats]>;
        cpu_load: number;
        timers: number;
      };
    };
  };
  strict: boolean;
  server_issue: string | null;
}
