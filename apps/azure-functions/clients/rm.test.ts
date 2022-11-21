// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from "dotenv";
import {
  addHostToFrontdoor,
  createAppService,
  createAppServicePlan,
  createBlobContainer,
  createCNAMERecord,
  createCosmosDBContainer,
  createMansionCosmosDB,
  deleteAppService,
  deleteBlobContainer,
  deleteCosmosDBContainer,
  deleteMansionCosmosDB,
  enableHttps,
  isHealthyOfDB,
  isHealthyOfStorage,
} from "./rm";

dotenv.config();

const TestRecordSet = {
  cnameRecord: { cname: "mojito-dev.azurefd.net" },
  etag: "nnn",
  fqdn: "jiang-test-01.mojito.dev.",
  id: "nnn/mojito.dev/CNAME/jiang-test-01",
  name: "jiang-test-01",
  provisioningState: "Succeeded",
  tTL: 3600,
  targetResource: {},
  type: "Microsoft.Network/dnszones/CNAME",
};

jest.mock("@azure/arm-dns", () => ({
  DnsManagementClient: jest.fn().mockImplementation(() => ({
    recordSets: {
      createOrUpdate: jest.fn().mockResolvedValue(TestRecordSet),
      deleteMethod: jest.fn().mockResolvedValue(TestRecordSet),
    },
  })),
}));

jest.mock("@azure/keyvault-secrets", () => ({
  SecretClient: jest.fn().mockImplementation(() => ({
    getSecret: jest.fn().mockResolvedValue({
      properties: {
        id: "fake-keyvault-id",
      },
    }),
  })),
}));

jest.mock("@azure/arm-appservice", () => ({
  WebSiteManagementClient: jest.fn().mockImplementation(() => ({
    webApps: {
      beginCreateOrUpdateAndWait: jest.fn().mockImplementation(() => ({
        id: "/subscriptions/ae903ce3-6221-48e0-a5a2-ddea9fbf6162/resourceGroups/application-mojito-dev/providers/Microsoft.Web/sites/AS-mojito-test-0042",
        name: "AS-mojito-test-0042",
        kind: "app,linux",
        location: "Japan East",
        type: "Microsoft.Web/sites",
        state: "Running",
        hostNames: ["as-mojito-test-0042.azurewebsites.net"],
        repositorySiteName: "AS-mojito-test-0042",
        usageState: "Normal",
        enabled: true,
        enabledHostNames: [
          "as-mojito-test-0042.azurewebsites.net",
          "as-mojito-test-0042.scm.azurewebsites.net",
        ],
        availabilityState: "Normal",
        hostNameSslStates: [
          {
            name: "as-mojito-test-0042.azurewebsites.net",
            sslState: "Disabled",
            virtualIP: null,
            thumbprint: null,
            toUpdate: null,
            hostType: "Standard",
            ipBasedSslResult: null,
            toUpdateIpBasedSsl: null,
            ipBasedSslState: "NotConfigured",
          },
          {
            name: "as-mojito-test-0042.scm.azurewebsites.net",
            sslState: "Disabled",
            virtualIP: null,
            thumbprint: null,
            toUpdate: null,
            hostType: "Repository",
            ipBasedSslResult: null,
            toUpdateIpBasedSsl: null,
            ipBasedSslState: "NotConfigured",
          },
        ],
        serverFarmId:
          "/subscriptions/ae903ce3-6221-48e0-a5a2-ddea9fbf6162/resourceGroups/application-mojito-dev/providers/Microsoft.Web/serverfarms/ASP-mojito-test-0042",
        reserved: true,
        isXenon: false,
        hyperV: false,
        lastModifiedTimeUtc: new Date("2022-02-20T11:04:30.220Z"),
        trafficManagerHostNames: null,
        scmSiteAlsoStopped: false,
        targetSwapSlot: null,
        hostingEnvironmentProfile: null,
        clientAffinityEnabled: true,
        clientCertEnabled: false,
        clientCertMode: "Required",
        clientCertExclusionPaths: null,
        hostNamesDisabled: false,
        customDomainVerificationId:
          "3BA9D68D5EF92A491A274C5787D1558FDFEAD120DE8939183791A71E927E6B47",
        outboundIpAddresses: "13.78.9.45,13.78.23.111",
        possibleOutboundIpAddresses:
          "13.73.26.73,13.73.30.113,52.243.32.123,52.243.37.163,13.73.27.207,13.78.9.45,13.78.23.111",
        containerSize: 0,
        dailyMemoryTimeQuota: 0,
        suspendedTill: null,
        maxNumberOfWorkers: null,
        cloningInfo: null,
        resourceGroup: "application-mojito-dev",
        defaultHostName: "as-mojito-test-0042.azurewebsites.net",
        slotSwapStatus: null,
        httpsOnly: false,
        redundancyMode: "None",
        inProgressOperationId: null,
        storageAccountRequired: false,
        keyVaultReferenceIdentity: "SystemAssigned",
        virtualNetworkSubnetId: null,
      })),
    },
    appServicePlans: {
      beginCreateOrUpdateAndWait: jest.fn().mockImplementation(() => ({
        id: "/subscriptions/ae903ce3-6221-48e0-a5a2-ddea9fbf6162/resourceGroups/application-mojito-dev/providers/Microsoft.Web/serverfarms/ASP-mojito-test-0042",
        name: "ASP-mojito-test-0042",
        kind: "linux",
        location: "Japan East",
        type: "Microsoft.Web/serverfarms",
        sku: {
          name: "P1v2",
          tier: "PremiumV2",
          size: "P1v2",
          family: "Pv2",
          capacity: 1,
        },
        workerTierName: null,
        status: "Ready",
        subscription: "ae903ce3-6221-48e0-a5a2-ddea9fbf6162",
        hostingEnvironmentProfile: null,
        maximumNumberOfWorkers: 0,
        geoRegion: "Japan East",
        perSiteScaling: false,
        elasticScaleEnabled: false,
        maximumElasticWorkerCount: 1,
        numberOfSites: 0,
        isSpot: false,
        spotExpirationTime: null,
        freeOfferExpirationTime: null,
        resourceGroup: "application-mojito-dev",
        reserved: true,
        isXenon: false,
        hyperV: false,
        targetWorkerCount: 0,
        targetWorkerSizeId: 0,
        provisioningState: "Succeeded",
        kubeEnvironmentProfile: null,
        zoneRedundant: false,
      })),
    },
  })),
}));

jest.mock("@azure/arm-frontdoor", () => ({
  FrontDoorManagementClient: jest.fn().mockImplementation(() => ({
    frontDoors: {
      get: jest.fn().mockImplementation(() =>
        Promise.resolve({
          frontendEndpoints: [{ id: "mojito-jiang.azurefd.net" }],
          routingRules: [
            {
              name: "http-to-https-redirect",
              frontendEndpoints: [{ id: "mojito-jiang.azurefd.net" }],
            },
            {
              name: "mojito-routing",
              frontendEndpoints: [{ id: "mojito-jiang.azurefd.net" }],
            },
            {
              name: "static-cache",
              frontendEndpoints: [{ id: "mojito-jiang.azurefd.net" }],
            },
            {
              name: "no-support",
              frontendEndpoints: [{ id: "mojito-jiang.azurefd.net" }],
            },
          ],
        })
      ),
      createOrUpdate: jest.fn(),
    },
    frontendEndpoints: {
      get: jest.fn().mockImplementation(() =>
        Promise.resolve({
          id: "frontendEndpointId",
        })
      ),
      enableHttps: jest.fn().mockResolvedValue({
        id: "enableHttps",
      }),
    },
  })),
}));

it("enableHttps", async () => {
  await enableHttps("jiang-test-1108", "mojito-dev");
});

describe("Front Door", () => {
  it("should create a CNAME record, then config frontdoor Frontend/domains, Routing rules", async () => {
    const cname = "test";
    const frontDoorName = "mojito-dev";

    const record = await createCNAMERecord(frontDoorName, cname);

    expect(record).toBe(TestRecordSet);

    const frontdoor = await addHostToFrontdoor(frontDoorName, cname);
    expect(frontdoor.frontendEndpoints).toHaveLength(2);
    expect(frontdoor.frontendEndpoints[1].sessionAffinityEnabledState).toBe(
      "Enabled"
    );
    expect(frontdoor.routingRules[0]?.frontendEndpoints || []).toHaveLength(2);
    expect(frontdoor.routingRules[1]?.frontendEndpoints || []).toHaveLength(2);
    expect(frontdoor.routingRules[2]?.frontendEndpoints || []).toHaveLength(2);
    expect(frontdoor.routingRules[3]?.frontendEndpoints || []).toHaveLength(1);
  });
});

describe("CosmosDB", () => {
  it("should check if connection string is empty", async () => {
    expect(isHealthyOfDB("")).toBe(false);
    expect(isHealthyOfDB(process.env.DB_CONNECTION_STRING)).toBe(true);
  });
  it("should create a new CosmosDB Container", async () => {
    const connectionString = process.env.DB_CONNECTION_STRING;
    const databaseId = "mojito";
    const containerId = "Data_jiang-test-06";

    const res = await createCosmosDBContainer(
      connectionString,
      databaseId,
      containerId
    );
    expect(res.databaseId).toBe(databaseId);
    expect(res.containerId).toBe(containerId);

    // clean test data
    await deleteCosmosDBContainer(connectionString, databaseId, containerId);
  });
});

const mansionGardenName = "test";
const mansionNumber = "0042";
const AZURE_SUBSCRIPTION_ID = "ae903ce3-6221-48e0-a5a2-ddea9fbf6162";
const APP_SERVICE_RESOURCE_LOCATION = "Japan East";
const AZURE_APP_SERVICE_RESOURCE_GROUP = "application-mojito-dev";

describe("mansion", () => {
  it("should create a new CosmosDB", async () => {
    const connectionString = process.env.DB_CONNECTION_STRING;
    const name = `mojito-${mansionGardenName}-${mansionNumber}`;
    const database = await createMansionCosmosDB(connectionString, name);
    expect(database.id).toBe("mojito-test-0042");
    // clean test data
    await deleteMansionCosmosDB(connectionString, name);
  });

  it("should create mansion plan", async () => {
    const name = `ASP-mojito-${mansionGardenName}-${mansionNumber}`;
    const plan = await createAppServicePlan(
      name,
      APP_SERVICE_RESOURCE_LOCATION,
      AZURE_APP_SERVICE_RESOURCE_GROUP
    );
    expect(plan.name).toBe("ASP-mojito-test-0042");
  });
  it("should create a new app service", async () => {
    const name = `ASP-mojito-${mansionGardenName}-${mansionNumber}`;
    const plan = await createAppServicePlan(
      name,
      APP_SERVICE_RESOURCE_LOCATION,
      AZURE_APP_SERVICE_RESOURCE_GROUP
    );
    const service = await createAppService(
      AZURE_SUBSCRIPTION_ID,
      AZURE_APP_SERVICE_RESOURCE_GROUP,
      name,
      plan.name,
      APP_SERVICE_RESOURCE_LOCATION
    );
    expect(service.name).toBe("AS-mojito-test-0042");
  });
});

describe("BlobStorage", () => {
  it("should check if connection string is empty", async () => {
    expect(isHealthyOfStorage("")).toBe(false);
    expect(isHealthyOfStorage(process.env.STORAGE_CONNECTION_STRING)).toBe(
      true
    );
  });
  it("should create a new Blob Storage Container", async () => {
    const connectionString = process.env.STORAGE_CONNECTION_STRING;
    const containerName = "test-create-container";
    const res = await createBlobContainer(connectionString, containerName);

    await expect(res.containerName).toBe(containerName);
    // clean test data
    await deleteBlobContainer(connectionString, containerName);
  });
});
