# Mojito App Stater

![GitHub](https://img.shields.io/github/license/thaddeusjiang/mojito-app-starter?style=for-the-badge)
[![Twitter: ThaddeusJiang](https://img.shields.io/twitter/follow/ThaddeusJiang.svg?style=social)](https://twitter.com/ThaddeusJiang)

- [Mojito App Stater](#mojito-app-stater)
  - [Involved content](#involved-content)
  - [Step1: Create Azure Cosmos DB and Function App](#step1-create-azure-cosmos-db-and-function-app)
  - [Step2: Deploy Web App to Vercel and deploy to Azure](#step2-deploy-web-app-to-vercel-and-deploy-to-azure)
  - [File Structure](#file-structure)

> 此项目主要为了演示如何自动化 Fullstack project 的 Infrastructure。

## Involved content

1. Next.js
2. Azure Functions
3. Terraform
4. GitHub Actions

## Step1: Create Azure Cosmos DB and Function App

1. setup `test` environment, see [./infra/azure/test/main.tf](./infra/azure/test/main.tf)

```
cd infra/test
terraform init
terraform plan -out=test
terraform apply "test"
```

2. setup `prod` environment with the same way

## Step2: Deploy Web App to Vercel and deploy to Azure

1. deploy `test` when merge PR into main branch and push commit to main branch, see [./.github/workflows/deploy-test.yml](./.github/workflows/deploy-test.yml)

2. deploy `prod` when publish a release, see [./.github/workflows/deploy-prod.yml](./.github/workflows/deploy-prod.yml)

## File Structure

```
.
├── .github
│   └── workflows
├── .secrets.baseline       // Run Yelp's detect-secrets
├── .vscode
│   ├── extensions.json
│   ├── launch.json         // debug and deploy
│   ├── settings.json
│   └── tasks.json
├── LICENSE
├── README.md
├── apps
│   ├── azure-functions     // api
│   └── next-app            // web
├── infra
│   └── azure               // infra as code
├── packages
│   ├── eslint-config-custom
│   ├── tailwind-config
│   └── tsconfig
└── turbo.json
```
