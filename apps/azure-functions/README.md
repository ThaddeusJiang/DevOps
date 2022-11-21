# Mojito-Admin Functions

## Setup

```
cp sample.settings.json local.settings.json
```

[local.settings.json](./sample.settings.json)
ask @ThaddeusJiang for the Secrets.

### Setup Tools

```
brew tap azure/functions
brew install azure-functions-core-tools@3
```

## Install

```
yarn install

yarn start
```

## Test

```
yarn test
```

## Before Contributing

- [Airbnb JavaScript Style](https://github.com/airbnb/javascript) or [JavaScript Standard Style](https://standardjs.com/rules-en.html)
- [Understanding the GitHub flow](https://guides.github.com/introduction/flow/)


## Built with

- [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [node-cosmos](https://www.npmjs.com/package/node-cosmos) Azure CosmosDB Client
- [dayjs](https://github.com/iamkun/dayjs/) date-time library
- [axios](https://github.com/axios/axios) HTTP client

## Memo

### npm vs. yarn

其实应该使用 npm，2021 年了，使用 yarn 已经没有明显受益了。
