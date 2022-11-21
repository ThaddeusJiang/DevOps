# Manual

运用手册

- [Manual](#manual)
  - [如果某天 tasks 创建，如何修复？](#如果某天-tasks-创建如何修复)
  - [如果某些 tasks 未成功运行（state: scheduled, queued, failed），如何修复？](#如果某些-tasks-未成功运行state-scheduled-queued-failed如何修复)
  - [TaskDefinitions](#taskdefinitions)
    - [運用中 taskDefinitions](#運用中-taskdefinitions)
  - [Sample Data API](#sample-data-api)

## 如果某天 tasks 创建，如何修复？

请使用任意 HTTP client 工具，调用下面 API

```
GET https://xxx.app/api/manualScheduleTasks/?code=
```

参数：

```
code: Azure Function key，请通过 Azure Portal 获取
```

返回值：

```js
{
  tasks: []string // tasks id 集合
}
```

## 如果某些 tasks 未成功运行（state: scheduled, queued, failed），如何修复？

未提供方法。

TODO:

## TaskDefinitions

### 運用中 taskDefinitions

| No.  | Name                       | Cron         | url                                              | method |
| ---- | -------------------------- | ------------ | ------------------------------------------------ | ------ |
| 1    | Member4Search全量接口      | 0 0 1 * * *  | /api/members/syncmember4search                   | GET    |
| 2    | 目標の進捗集計バッチ       | 0 5 1 * * *  | /api/progress/aggregates                         | PUT    |
| 3    | 目標一覧の統計情報バッチ   | 0 10 1 * * * | /api/member_with_objective_stats                 | PUT    |
| 4    | OrgCacheRebuildバッチ      | 0 15 1 * * * | /api/admin/cachedata/rebuildorgcache             | PUT    |
| 5    | AI_RawDataバッチ           | 0 20 1 * * * | /api/ai/rawdata                                  | PUT    |
| 6    | 毎日の自動計算とバッチ処理 | 0 25 1 * * * | /api/sheetcontents-v2/automaticcalculation/batch | PUT    |
| 7    | 時系列処理バッチ           | 0 0 2 * * *  | /api/members_and_orgs/timeseries                 | PUT    |

##

## Sample Data API

TODO:

1. yy
2. yy
3. yy
