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
}

export interface Mansion {
  id: string;
  connectionString: string;
  databaseId: string;
  storageConnectionString: string;
  frontDoorName: string;
}

export type HostState = "creating" | "created" | "publishing" | "published" | "confirmed";
export interface Host {
  id: string;
  products?: string[];
  plan?: string;
  selectedFeatures?: string[];
  romuFeatures?: string[];
  kintaiFeatures?: string[];
  kyuyoFeatures?: string[];
  connectionString?: string;
  databaseName?: string;
  collectionName: string;
  storageConnectionString?: string;
  storagePrefix: string;
  xApiToken?: string;
  timezone?: string;
  mansion?: Mansion;
  memo?: string;
  state?: HostState;
  createdAt?: string;
}

export interface TaskDefinition {
  id: string;
  description: string;
  cronExpression: string;
  type?: string;
  httpRequest: {
    body: {
      api: string;
      method: string;
      params?: string;
    };
  };
  activated: boolean;
}

export interface Task {
  id?: string;
  name?: string;
  host?: string;
  taskDefinition?: string;
  startAt?: string;
  endAt?: string;
  status?: string;
  triggeredBy?: string;
  message?: string;

  definitionId?: string;

  type?: string;
  retryTimes?: number;

  state?: string;
  httpRequest?: string;
  callbackUrl?: string;
  scheduledStartedAt?: string;
  start?: string;
  end?: string;
  response?: string;
  failedReason?: string;
}

export interface AuditLog {
  id?: string;
  domain: string;
  startDate: string;
  endDate: string;
  remark?: string;
}

export interface AzureSharedAccessSignaturesObj {
  url: string;
  containerName: string;
  expiresOn: number;
}
