# Playwright
```bash
e2e
├── artifacts // github artifacts
│   └── test-results // 测试后会生成的screenshot对比图片
├── fixtures
│   ├── common.ts // 在开始测试前为 Test定义一些数据和方法（比如读取用户的auth
│   └── get-auth.spec.ts
├── playwright.config.ts // playwright全局配置
├── specs
│   ├── dashboard.spec.ts // 测试case
│   ├── dashboard.spec.ts-snapshots // 每个测试case用来对比的screenshot
│   │   └── dashborad-linux.png
│   ├── hosts.spec.ts
│   ├── hosts.spec.ts-snapshots
│   │   └── host-linux.png
│   ├── mansions.spec.ts
│   └── mansions.spec.ts-snapshots
│       └── mansions-linux.png
└── userdata
    └── state.json // 用户登录信息，通过执行yarn run ui-test:auth生成
```
# Usage

为了减少不同操作系统下的截图误差，需要使用playwright提供的docker来进行对比和更新screenshot

```shell
docker run -v $(pwd):/work/ mcr.microsoft.com/playwright:v1.12.3-focal bash -c 'cd work && yarn build && npx playwright install && yarn run e2e-test'
```
### 执行visual-testing
```
yarn run e2e-test
```
> docker: `docker run -v $(pwd):/work/ mcr.microsoft.com/playwright:v1.12.3-focal bash -c 'cd work && yarn build && npx playwright install && yarn run e2e-test'`

### 生成用户auth json

```
yarn run e2e-test:auth
```

> 目前已存在auth文件，不需要执行 `e2e/userdata/state.json`
### 更新screenshot

```
yarn run e2e-test:update
```
> docker: `docker run -v $(pwd):/work/ mcr.microsoft.com/playwright:v1.12.3-focal bash -c 'cd work && yarn build && npx playwright install && yarn run e2e-test:update'`



