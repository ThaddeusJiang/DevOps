import { HostState } from "types";

export const MockHost = {
  id: "mock-host.mojito.dev",
  plan: "CUSTOM",
  selectedFeatures: ["OBJECTIVE"],
  connectionString: "test-connection-string",
  databaseName: "test-database",
  collectionName: "test-collection",
  storageConnectionString: "test-storage-connection-string",
  storagePrefix: "test-storage-prefix",
  xApiToken: "test-x-api-token",
  timezone: "test-timezone",
  mansion: {
    id: "test-mansion",
    connectionString: "",
    databaseId: "",
    storageConnectionString: "",
    frontDoorName: "",
  },
  memo: "",
  state: "published" as HostState,
  createdAt: "2022-01-01T00:00:00.000Z",
};

const trialFeatures = [
  "目標管理",
  "クロス分析",
  "組織図",
  "アンケート",
  "人事評価",
  "ダッシュボード",
];
const silverFeatures = ["目標管理", "組織図"];
const goldFeatures = ["目標管理", "組織図", "アンケート", "人事評価"];
const platinumFeatures = [
  "目標管理",
  "クロス分析",
  "組織図",
  "アンケート",
  "人事評価",
  "ダッシュボード",
];

export { trialFeatures, silverFeatures, goldFeatures, platinumFeatures };

export const MockMansions = [
  {
    "id": "yo-test-del-ok",
    "databaseId": "mojito-yo-test-del-ok",
    "domain": "mojito.dev",
    "frontDoorName": "mojito-yo-test-del-ok",
    "hostCount": 0,
  },
  {
    "id": "dev-hz",
    "databaseId": "mojito-dev-hz",
    "domain": "mojito.dev",
    "frontDoorName": "mojito-dev-hz",
    "hostCount": 0,
  },
  {
    "id": "jiang-dev-01",
    "databaseId": "mojito",
    "domain": "mojito.dev",
    "frontDoorName": "mojito-dev",
    "hostCount": 0,
  },
  {
    "id": "dev",
    "databaseId": "mojito",
    "domain": "mojito.dev",
    "frontDoorName": "mojito-dev",
    "hostCount": 10,
  },
  {
    "id": "dev-01",
    "databaseId": "mojito-01",
    "domain": "mojito.dev",
    "frontDoorName": "mojito-dev",
    "hostCount": 1,
  },
];
