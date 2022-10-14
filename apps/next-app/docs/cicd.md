# frontend CI/CD 和 backend CI/CD 对比

- [frontend CI/CD 和 backend CI/CD 对比](#frontend-cicd-和-backend-cicd-对比)
  - [1. frontend](#1-frontend)
  - [2. backend](#2-backend)

对比

|                                | frontend        | backend    |
| ------------------------------ | --------------- | ------------ |
| setup env                      | CI/CD runner    | App runner  |
| build output                   | 各个环境不相同  | 各个环境相同 |
| 更改 env，是否要重新触发 CI/CD | Yes             | No           |
| CI/CD platform                 | GitHub Actions + Vercel | GitHub Actions      |


## 1. frontend

GitHub Actions + Vercel

1. Testing in GitHub Actions
2. GitHub Actions Trigger Vercel deployment

## 2. backend

GitHub Actions

1. Testing in GitHub Actions
1. deployment in GitHub Actions
