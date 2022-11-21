# Mojito Admin

[![Detect Secrets](https://github.com/ThaddeusJiang/mojito-admin/actions/workflows/detect-secrets.yml/badge.svg)](https://github.com/ThaddeusJiang/mojito-admin/actions/workflows/detect-secrets.yml)
[![Test](https://github.com/ThaddeusJiang/mojito-admin/actions/workflows/test.yml/badge.svg)](https://github.com/ThaddeusJiang/mojito-admin/actions/workflows/test.yml)
[![deploy stag](https://github.com/ThaddeusJiang/mojito-admin/actions/workflows/deploy-stag.yml/badge.svg)](https://github.com/ThaddeusJiang/mojito-admin/actions/workflows/deploy-stag.yml)
[![deploy prod](https://github.com/ThaddeusJiang/mojito-admin/actions/workflows/deploy-prod.yml/badge.svg)](https://github.com/ThaddeusJiang/mojito-admin/actions/workflows/deploy-prod.yml)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[![Twitter: ThaddeusJiang](https://img.shields.io/twitter/follow/ThaddeusJiang.svg?style=social)](https://twitter.com/ThaddeusJiang)

Features:

- [x] 顧客一覧
- [x] タスク定義一覧
- [x] タスク一覧
- [x] Access Control (the accounts was managed in Azure Active Directory)
- [x] 環境管理
  - [x] Host Management
  - [x] Link to Datadog or others Dashboard
  - [ ] Storage
- [ ] 多言語対応

## Built with

- [NextJS: the React Framework for Production](https://nextjs.org/docs)
- [Tailwindcss: rapidly build modern websites without ever leaving your HTML](https://tailwindcss.com/)
  - [daisyUI: Tailwind Components](https://github.com/saadeghi/daisyui/)
- [React-hook-form: performance, flexible and extensible forms with easy-to-use validation](https://www.react-hook-form.com/)
- [React-query: performant and powerful data synchronization for React](https://react-query.tanstack.com/)
- [React-table: Lightweight and extensible data tables for React](https://react-table.tanstack.com/)
- [Storybook: build bulletproof UI components faster](https://storybook.js.org)
- [react-testing: simple and complete testing utilities that encourage good testing practices](https://testing-library.com/)
- And other standard tools as [Eslint](https://eslint.org/), [Prettier](https://prettier.io/), [Lint-staged](https://github.com/okonet/lint-staged)

## Install

```sh
yarn install
```

## Usage

Create .env file base on sample.env then run below command

```
cp sample.env .env
```

> About the secret token, ask @ThaddeusJiang

```sh
yarn dev
```

## Run tests

```sh
yarn test
```

## Run storybook

```sh
yarn storybook
```

## Author

- Website: https://ThaddeusJiang.com/
- Twitter: [@ThaddeusJiang](https://twitter.com/ThaddeusJiang)
- Github: [@ThaddeusJiang](https://github.com/ThaddeusJiang)

# Architecture

- Frontend: Next.js
- Backend: Azure Functions + Azure CosmosDB
- Hosting: Vercel + Azure

# Auth Providers

## Azure Active Directory
- Callback URL: `<domain>/api/auth/callback/azure-ad`

# Deployment

- [Auto deploy app to staging](https://github.com/ThaddeusJiang/mojito-admin/actions/workflows/deploy-stag.yml)(dev, test) when main branch was updated.
- [Auto deploy app to production](https://github.com/ThaddeusJiang/mojito-admin/actions/workflows/deploy-prod.yml)(demo, trial, customer) when creating a release.

# Memo

其实我想用 [Ramdajs](https://ramdajs.com/) ，但是我也不是特别熟。
暂时先继续使用 lodash/fp 吧。

关于报表可视化，需要评估 [d3js](https://d3js.org/) ，
目前使用 react-charts 。

# folder structure

```
.
├── client // UI clients
│   └── apis
├── components // UI Components
├── functions // serverless functions (Azure Functions)
├── mocks // UI mock
├── modules
│   ├── customer
│   │   └── apis
│   │   └── components
│   └── task
│   │   └── apis
│       └── components
├── pages
│   ├── api // Auth API, TODO: migrate to Azure Functions
│   │   └── auth
│   ├── customers // UI Pages
│   ├── ...
│   ├── ...
├── public
├── styles
├── types
└── utils
└── tailwind.config.js
```
# repo-visualizer

This diagram of using the [repo-visualizer](https://github.com/githubocto/repo-visualizer) GitHub Action.

![Visualization of this repo](./diagram.svg)
