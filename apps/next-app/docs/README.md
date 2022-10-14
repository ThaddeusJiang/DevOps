# Service 管理 App

- [Service 管理 App](#service-管理-app)
  - [背景](#背景)
  - [期待](#期待)
  - [用户群](#用户群)
  - [功能](#功能)
    - [Host 管理](#host-管理)
    - [TaskDefinition 管理](#taskdefinition-管理)
    - [Task 管理](#task-管理)
    - [Customer 管理（TODO:）](#customer-管理todo)
    - [自动创建 SaaS app 试用账户（不局限于使用环境）（TODO:）](#自动创建-saas-app-试用账户不局限于使用环境todo)
  - [CI/CD (frontend&functions)](#cicd-frontendfunctions)
  - [How to prepare a Garden?](#how-to-prepare-a-garden)
- [How to prepare a Mansion?](#how-to-prepare-a-mansion)
- [How to create a host?](#how-to-create-a-host)
  - [Others Doc](#others-doc)
  - [Spec](#spec)

## 背景

- SaaS app 为了应对不同的客户，需要将客户的数据分离，这是通过 DB 中的 data 实现的。而这些 data 需要管理。
- SaaS app 有一些 batch 处理，需要管理 batch 执行的时间，并监控 batch 是成功还是失败。
- 期待其他部门的同时可以轻松创建 SaaS app 试用账号。
- 等等

## 期待

- [ ] 其他部门的同事可以轻松地创建 SaaS app 试用账号

## 用户群

简单的说，就是我们自己。

1. SaaS DevOps team
2. SaaS 营业 team （或者其他 team）

## 功能

1. Host 管理
2. TaskDefinition 管理
3. Task 管理
4. Customer 管理（TODO:）
5. 自动创建 SaaS app 试用账户（不局限于使用环境）

### Host 管理

核心概念：

- Mansion
- Host

1. 创建 host
   1. 管理 host 信息（CosmosDB，Storage，plan etc.）
2. 提供一个 API，让 SaaS app 可以读取 host 信息
3. - [ ] host plan 管理
   1. 资源使用量

### TaskDefinition 管理

1. 增删改查 Task Definition

### Task 管理

1. 根据 Host 和 TaskDefinition 生成 tasks（每天）
2. 执行 tasks （Service 管理只负责调用，真正执行是在 SaaS app）
3. 提供 webhook 让 SaaS app 可以将 task 的执行结果更新到 Service 管理 app。
4. 提供 tasks 运行结果报表
5. - [ ] 如果 tasks 执行失败，通知相关担当者（via Email, teams etc.）

### Customer 管理（TODO:）

1. 顾客 plan
   1. 对应的 Azure 资源用量

### 自动创建 SaaS app 试用账户（不局限于使用环境）（TODO:）

1. 在添加 host 信息时
   1. 自动配置好 host 需要的 Infra
   2. 可以很方便地插入/不插入 Sample Data

## [CI/CD (frontend&functions)](./cicd.md)

## How to prepare a Garden?

TODO:

# How to prepare a Mansion?

> 前提：每个 Mansion 对应独立的 frontdoor

1. Insert a record in ServiceManagement db

```json
{
  "id": "new mansion",
  "connectionString": "",
  "storageConnectionString": "",
  "databaseId": "mojito",
  "frontDoorName": "mojito-dev"
}
```

2. App Service (backend)
3. DNS record (frontend/endpoint)
4. Prepare Front Door(aka: Load balancing)
   1. frontend/endpoint
   2. backend pool
      1. DR 对应
   3. routing rules
      1. http-to-https
      2. mojito-rules

# How to create a host?

1. create a host via ServiceManagement WebApp
2. config frontdoor via Terraform / Azure Portal

## Others Doc

https://git.nisshin-dev.work/mojito/documents

## Spec

期待：

- [x] 1. 每种不同类型的 batch，中间至少间隔 5 分钟
- [x] 2. task 和 definition 能够一一对应
- [x] 3. 每个 domain（顾客），有一个偏移值，从 0 到 60 分钟
- [x] 4. 上面这套规则，请对 dev/prod/trial/customer 都适用
