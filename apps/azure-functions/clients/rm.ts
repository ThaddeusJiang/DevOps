/* eslint-disable import/no-unresolved */
import {
  AppServicePlan,
  Site,
  WebSiteManagementClient,
} from "@azure/arm-appservice";
import { CosmosDBManagementClient } from "@azure/arm-cosmosdb";
import { DnsManagementClient } from "@azure/arm-dns";
import { FrontDoorManagementClient } from "@azure/arm-frontdoor";
import { SessionAffinityEnabledState } from "@azure/arm-frontdoor/src/models/index";
import { StorageManagementClient } from "@azure/arm-storage";
import { CosmosClient, Database } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { BlobServiceClient } from "@azure/storage-blob";

const creds = new DefaultAzureCredential();

const AZURE_SUBSCRIPTION_ID = process.env?.AZURE_SUBSCRIPTION_ID;

const AZURE_DNS_ZONE_RESOURCE_GROUP =
  process.env?.AZURE_DNS_ZONE_RESOURCE_GROUP;
const AZURE_DNS_ZONE = process.env?.AZURE_DNS_ZONE;
const AZURE_KEYVAULT_CERTIFICATE = process.env?.AZURE_KEYVAULT_CERTIFICATE;

const AZURE_GARDEN_RESOURCE_GROUP = process.env?.AZURE_GARDEN_RESOURCE_GROUP;
const AZURE_DB_RESOURCE_GROUP = process.env?.AZURE_DB_RESOURCE_GROUP;
const AZURE_STORAGE_RESOURCE_GROUP = process.env?.AZURE_STORAGE_RESOURCE_GROUP;

const frontdoorManagementClient = new FrontDoorManagementClient(
  creds,
  AZURE_SUBSCRIPTION_ID
);

const dnsManagementClient = new DnsManagementClient(
  creds,
  AZURE_SUBSCRIPTION_ID
);

const webSiteClient = new WebSiteManagementClient(creds, AZURE_SUBSCRIPTION_ID);

const cosmosDBClient = new CosmosDBManagementClient(
  creds,
  AZURE_SUBSCRIPTION_ID
);
const storageClient = new StorageManagementClient(creds, AZURE_SUBSCRIPTION_ID);

export const createCNAMERecord = async (frontDoorName, cname) => {
  const res = await dnsManagementClient.recordSets.createOrUpdate(
    AZURE_DNS_ZONE_RESOURCE_GROUP,
    AZURE_DNS_ZONE,
    cname,
    "CNAME",
    {
      tTL: 3600,
      cnameRecord: {
        cname: `${frontDoorName}.azurefd.net`,
      },
    }
  );
  return res;
};

export const deleteCNAMERecord = async (cname) => {
  const res = await dnsManagementClient.recordSets.deleteMethod(
    AZURE_DNS_ZONE_RESOURCE_GROUP,
    AZURE_DNS_ZONE,
    cname,
    "CNAME"
  );
  return res;
};

// 未成功
export const getCertificateVaultId = async (keyvaultName: string) => {
  const vaultUrl = `https://${keyvaultName}.vault.azure.net`;

  const client = new SecretClient(vaultUrl, creds);
  const secret = await client.getSecret("certwithpk");

  return secret.properties.id;
};

export const enableHttps = async (frontDoorName, cname) => {
  // const certificateVaultId = await getCertificateVaultId(
  //   AZURE_KEYVAULT_CERTIFICATE
  // );
  await frontdoorManagementClient.frontendEndpoints.enableHttps(
    AZURE_GARDEN_RESOURCE_GROUP,
    frontDoorName,
    cname,
    {
      certificateSource: "AzureKeyVault",
      minimumTlsVersion: "1.2",
      vault: {
        id: AZURE_KEYVAULT_CERTIFICATE,
      },
      secretName: "certwithpk",
    }
  );
};

export const addHostToFrontendEndpoints = async (frontDoorName, cname) => {
  const frontdoor = await frontdoorManagementClient.frontDoors.get(
    AZURE_GARDEN_RESOURCE_GROUP,
    frontDoorName
  );

  const frontendEndpoints = [
    ...frontdoor.frontendEndpoints,
    {
      name: cname,
      hostName: `${cname}.${AZURE_DNS_ZONE}`,
      sessionAffinityEnabledState: "Enabled" as SessionAffinityEnabledState,
    },
  ];
  await frontdoorManagementClient.frontDoors.createOrUpdate(
    AZURE_GARDEN_RESOURCE_GROUP,
    frontDoorName,
    {
      ...frontdoor,
      frontendEndpoints,
    }
  );
  return frontendEndpoints;
};

export const updateFrontDoorRoutingRules = async (frontDoorName, cname) => {
  const frontdoor = await frontdoorManagementClient.frontDoors.get(
    AZURE_GARDEN_RESOURCE_GROUP,
    frontDoorName
  );

  const frontendEndpoint =
    await frontdoorManagementClient.frontendEndpoints.get(
      AZURE_GARDEN_RESOURCE_GROUP,
      frontDoorName,
      cname
    );

  // only deal: http-redirect-https, mojito-routing, static-cache and sso
  const routingRules = frontdoor.routingRules.map((rule) =>
    [
      "http-to-https-redirect",
      "mojito-routing",
      "static-cache",
      "sso",
    ].includes(rule.name)
      ? {
          ...rule,
          frontendEndpoints: [
            ...rule.frontendEndpoints,
            { id: frontendEndpoint.id },
          ],
        }
      : rule
  );

  await frontdoorManagementClient.frontDoors.createOrUpdate(
    AZURE_GARDEN_RESOURCE_GROUP,
    frontDoorName,
    {
      ...frontdoor,
      routingRules,
    }
  );

  return routingRules;
};

export const createFrontdoor = async (
  gardenName: string,
  mansionNumber: string
): Promise<string> => {
  const name = `mojito-${gardenName}-${mansionNumber}`;
  const poller = await frontdoorManagementClient.frontDoors.beginCreateOrUpdate(
    AZURE_GARDEN_RESOURCE_GROUP,
    name,
    {
      location: "global",
      routingRules: [
        {
          name: "mojito-routing",
          acceptedProtocols: ["Https"],
          patternsToMatch: ["/*"],
          frontendEndpoints: [{ id: "as-mojito" }],
          routeConfiguration: {
            odatatype:
              "#Microsoft.Azure.FrontDoor.Models.FrontdoorForwardingConfiguration",
            forwardingProtocol: "HttpsOnly",
            backendPool: { id: "mojito-backend" },
          },
        },
      ],
      loadBalancingSettings: [
        {
          name: "loadBalancingSettings",
          sampleSize: 4,
          successfulSamplesRequired: 2,
          additionalLatencyMilliseconds: 500,
        },
      ],
      healthProbeSettings: [
        {
          name: "healthProbeSetting",
          enabledState: "Enabled",
          path: "/api/version",
          protocol: "Https",
          healthProbeMethod: "GET",
          intervalInSeconds: 30,
        },
      ],
      frontendEndpoints: [
        {
          name: "as-mojito",
          sessionAffinityEnabledState: "Enabled",
          hostName: `mojito-${gardenName}-${mansionNumber}.azurefd.net`,
        },
      ],
      backendPools: [
        {
          name: "mojito-backend",
          loadBalancingSettings: { id: "loadBalancingSettings" },
          healthProbeSettings: { id: "healthProbeSetting" },
          backends: [
            {
              httpPort: 80,
              httpsPort: 443,
              priority: 1,
              weight: 50,
              address: `as-mojito-${gardenName}-${mansionNumber}.azurewebsites.net`,
              backendHostHeader: `as-mojito-${gardenName}-${mansionNumber}.azurewebsites.net`,
            },
          ],
        },
      ],
      backendPoolsSettings: {
        enforceCertificateNameCheck: "Disabled",
      },
    }
  );
  await poller.pollUntilFinished();
  return name;
};

export const addHostToFrontdoor = async (frontDoorName, cname) => {
  const frontendEndpoints = await addHostToFrontendEndpoints(
    frontDoorName,
    cname
  );

  const routingRules = await updateFrontDoorRoutingRules(frontDoorName, cname);
  // Memo: take long time so don't use await
  enableHttps(frontDoorName, cname);

  return {
    frontendEndpoints,
    routingRules,
  };
};

/**
 * steps:
 * 1. remove host from Routing rules
 * 2. remove host from FrontendEndpoints
 * @param param0
 * @returns
 */
export const removeHostFromFrontdoor = async (frontDoorName, cname) => {
  const originalFrontdoor = await frontdoorManagementClient.frontDoors.get(
    AZURE_GARDEN_RESOURCE_GROUP,
    frontDoorName
  );

  const { frontendEndpoints: originalEndpoints, routingRules: rules } =
    originalFrontdoor;

  const frontendEndpointWillBeRemove =
    await frontdoorManagementClient.frontendEndpoints.get(
      AZURE_GARDEN_RESOURCE_GROUP,
      frontDoorName,
      cname
    );

  const routingRules = rules.map((rule) => {
    const { frontendEndpoints } = rule;
    return {
      ...rule,
      frontendEndpoints: frontendEndpoints.filter(
        (item) => item.id !== frontendEndpointWillBeRemove.id
      ),
    };
  });

  const frontendEndpoints = originalEndpoints.filter(
    (item) => item.name !== frontendEndpointWillBeRemove.name
  );

  await frontdoorManagementClient.frontDoors.createOrUpdate(
    AZURE_GARDEN_RESOURCE_GROUP,
    frontDoorName,
    {
      ...originalFrontdoor,
      frontendEndpoints,
      routingRules,
    }
  );
};

const DefaultContainerRequest = {
  partitionKey: {
    paths: ["/_partition"],
  },
  defaultTtl: -1, // Time to Live : On (no default)
  uniqueKeyPolicy: {
    uniqueKeys: [
      { paths: ["/_uniqueKey1"] },
      { paths: ["/_uniqueKey2"] },
      { paths: ["/_uniqueKey3"] },
    ],
  },
  indexingPolicy: {
    indexingMode: "consistent" as "consistent" | "lazy" | "none",
    automatic: true,
    includedPaths: [
      {
        path: "/*",
      },
    ],
    excludedPaths: [
      {
        path: '/"_etag"/?',
      },
    ],
  },
};

export const createMansionCosmosDB = async (
  connectionString: string,
  name: string
): Promise<Database> => {
  const client = new CosmosClient(connectionString);
  const result = await client.databases.createIfNotExists({
    id: name,
  });
  return result.database;
};

export const deleteMansionCosmosDB = async (
  connectionString: string,
  name: string
): Promise<void> => {
  const client = new CosmosClient(connectionString);
  const result = await client.database(name).delete();
};

export const createCosmosDBContainer = async (
  connectionString: string,
  databaseId: string,
  containerId: string
) => {
  const client = new CosmosClient(connectionString);
  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  await database.containers.createIfNotExists({
    id: containerId,
    ...DefaultContainerRequest,
  });

  return { databaseId, containerId };
};

export const deleteCosmosDBContainer = async (
  connectionString: string,
  databaseId: string,
  containerId: string
) => {
  const client = new CosmosClient(connectionString);
  const database = await client.database(databaseId);
  await database.container(containerId).delete();

  return {
    databaseId,
    containerId,
  };
};

export const getDatabaseAccountConnectionString = async (
  accountName: string
) => {
  try {
    const { connectionStrings } =
      await cosmosDBClient.databaseAccounts.listConnectionStrings(
        AZURE_DB_RESOURCE_GROUP,
        accountName
      );
    const connectionString = connectionStrings[0]?.connectionString;

    return connectionString;
  } catch (error) {
    console.error(error);
  }
};

export const getStorageAccountConnectionString = async (
  accountName: string
) => {
  try {
    const { keys } = await storageClient.storageAccounts.listKeys(
      AZURE_STORAGE_RESOURCE_GROUP,
      accountName
    );
    const storageConnectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${keys[0].value};EndpointSuffix=core.windows.net`;

    return storageConnectionString;
  } catch (error) {
    console.error(error);
  }
};

export const createBlobContainer = async (
  connectionString: string,
  containerName: string
) => {
  const client = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = client.getContainerClient(containerName);
  await containerClient.create();

  return {
    containerName,
  };
};

export const deleteBlobContainer = async (
  connectionString: string,
  containerName: string
) => {
  try {
    const client = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = client.getContainerClient(containerName);
    await containerClient.delete();

    return [null, { containerName }];
  } catch (error) {
    return [error];
  }
};

export const isHealthyOfDB = (connectionString) => {
  try {
    const client = new CosmosClient(connectionString);
    return !!client;
  } catch (error) {
    return false;
  }
};

export const isHealthyOfStorage = (connectionString: string) => {
  try {
    const client = BlobServiceClient.fromConnectionString(connectionString);
    return !!client;
  } catch (error) {
    return false;
  }
};

// check DNS
export const isHealthyOfDNS = (): boolean => {
  try {
    return !!dnsManagementClient;
  } catch (error) {
    return false;
  }
};

export const isHealthyOfFrontDoor = (): boolean => {
  try {
    return !!frontdoorManagementClient;
  } catch (error) {
    return false;
  }
};

export type CreateAppServicePlanResult = ReturnType<
  WebSiteManagementClient["appServicePlans"]["beginCreateOrUpdateAndWait"]
>;

export const createAppServicePlan = async (
  name: string,
  location: string,
  resourceGroup: string
): CreateAppServicePlanResult => {
  const parameter: AppServicePlan = {
    kind: "Linux",
    reserved: true,
    location,
    sku: {
      name: "P1V2",
      tier: "PremiumV2",
      size: "P1V2",
    },
  };
  return webSiteClient.appServicePlans.beginCreateOrUpdateAndWait(
    resourceGroup,
    name,
    parameter
  );
};

export const createAppService = async (
  azureSubscriptionId: string,
  resourceGroup: string,
  name: string,
  planName: string,
  location: string
): Promise<Site> => {
  const serverFarmId = `/subscriptions/${azureSubscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Web/serverfarms/${planName}`;

  const parameter: Site = {
    location,
    serverFarmId,
  };
  const app = await webSiteClient.webApps.beginCreateOrUpdateAndWait(
    resourceGroup,
    name,
    parameter
  );
  return app;
};

export const deleteAppService = async (resourceGroup: string, name: string) => {
  webSiteClient.webApps.delete(resourceGroup, name);
};
