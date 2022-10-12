# Task 设计

## 需求

关于执行时间，有下面两个要求，目的是为了能够让 batch 错峰执行，多 App Service 和 DB 造成的性能压力减少。

- 好几种 batch(TaskDefinition)的执行的基准时间是不一样的。例如 batch1 1 点， batch2 1 点 10 分， batch3 1 点 30
  - 这个需要留个 markdown 文档，让大家都能看到，便于以后有新 batch 加入的时候方便安排
- 同一个 batch1， 不同的 domain 希望能够错开执行时间。即每一个 domain 带一个偏移量 delta
  - 例如同样一个目标管理进度统计 batch，基准时间是 1 点 10 分。domain1 + delta=5， 1 点 15 分执行。domain2 + delta=10, 1 点 20 分执行

TaskDefinition 数据结构

```json
{
  "id": "aa28f80c-a22f-4e0e-b0e8-2b2f1f4da8f4",
  "description": "時系列処理バッチ",
  "activated": true,
  "type": "http", // http or methodInvoke
  "httpRequest": {
    "body": {
      "api": "/api/members_and_orgs/timeseries",
      "method": "PUT"
    }
  },
  "cronExpression": "0 0 17 * * *"
  // ...
}
```

Host 数据结构

```json
{
  "id": "jiang-demo-1604.mojito.dev",
  "timezone": "Asia/Tokyo"
  // ...
}
```

Task 数据结构

```json
{
  "id": "b64e761b-dbee-4972-923b-a9c4472b3694",
  "name": "AI_RawData接口 dev3.mojito.dev", // definition + host
  "definition": "08f27edf-8607-42fe-83d0-eb0b361d6d7f", // definition
  "host": "dev3.mojito.dev", // host
  "type": "http", // "http" | "methodInvoke"
  "elapsed": 0,
  "retryTimes": 0,
  "state": "scheduled",
  "httpRequest": {
    "body": {
      "url": "https://dev3.mojito.dev/api/ai/rawdata", // https + host + api, TODO: 这里应该修改 SaaS framework 的 /api/tasks/execute 逻辑，
      "method": "PUT"
    }
  },
  "scheduledStartedAt": "2021-10-08T16:00:00.000Z",
  "callbackUrl": "https://mojito-admin-dev.azurewebsites.net/api/callback/tasks/b64e761b-dbee-4972-923b-a9c4472b3694", // callback_baseurl + /task.id
  "_partition": "Tasks",
  "_rid": "5iYEAK4t+gGPOwAAAAAAAA==",
  "_self": "dbs/5iYEAA==/colls/5iYEAK4t+gE=/docs/5iYEAK4t+gGPOwAAAAAAAA==/",
  "_etag": "\"600137de-0000-2300-0000-615f8a0b0000\"",
  "_attachments": "attachments/",
  "_ts": 1633651211
}
```

## [Task 管理说明书](./Manual.md)
