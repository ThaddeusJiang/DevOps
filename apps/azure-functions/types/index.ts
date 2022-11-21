// TODO: 我想实现一个类似于 BFF 的内容，实现 Backend 和 Frontend 共用一套 types 的内容

export interface Customer {
  id: string;
  _partition: string;
  companyName: string;
  connectUserName: string;
  connectUserEmail: string;
  type?: string;
  plan?: string;
  appliedAt: string;
  startedAt: string;
  updatedAt: string;
  domain: string;
  createdAt?: string;
}

export interface Mansion {
  id: string;
  connectionString: string;
  storageConnectionString: string;
  databaseId: string;
  frontDoorName: string;
  hostCount?: number;
  createdAt?: string;
  appServices?: {
    name: string;
    host: string;
  }[];
  cosmosDB?: {
    databaseAccount: string;
    databaseName: string;
    connectionString: string;
  };
  storage?: {
    storageAccount: string;
    storageConnectionString: string;
  };
}

export interface MansionExtra extends Mansion {
  hostCount: number;
}

export type HostState = "creating" | "created" | "publishing" | "published" | "confirmed";

export interface Host {
  id: string;
  products?: string[];
  plan?: string;
  connectionString: string;
  databaseName?: string;
  collectionName: string;
  romuFeatures?: string[];
  kintaiFeatures?: string[];
  kyuyoFeatures?: string[];
  storageConnectionString: string;
  storagePrefix: string;
  xApiToken: string;
  timezone?: string;
  mansion?: Mansion;
  memo?: string;
  state?: HostState;
  createdAt?: string;
  selectedFeatures?: string[];
}
export type TaskType = "http" | "methodInvoke";

export interface TaskDefinition {
  id: string;
  description: string;
  cronExpression: string;
  type?: TaskType;
  httpRequest: {
    body: {
      api: string;
      method: string;
      params?: string;
    };
  };
  createdAt?: string;
  activated: boolean;
}

type Method = "GET" | "POST" | "PUT" | "DELETE";
type TaskState = "scheduled" | "queued" | "failed" | "succeeded";

export interface Task {
  name: string;
  definitionId: string;
  host: string;
  elapsed?: number;
  retryTimes?: number;
  state: TaskState;
  type?: TaskType;
  httpRequest: {
    body: {
      api: string;
      method: Method;
      params?: string;
    };
  };
  scheduledStartedAt: string;
  id: string;
  callbackUrl: string;
  start?: string;
  end?: string;
  failedReason?: string;
  message?: string;
  createdAt?: string;
  _partition: "Tasks";
}
