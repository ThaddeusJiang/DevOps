import { Database, Partitions, getDatabase } from "../clients/db";
import {
  addHostToFrontdoor,
  createCNAMERecord,
  createCosmosDBContainer,
  deleteCNAMERecord,
} from "../clients/rm";
import { baseHost, baseMansion, baseTask } from "../test/data";
import { accessHosts, cleanHosts, createHost, deleteHost } from "./host";
import { cleanTasks } from "./task";

let db: Database;

jest.mock("../clients/rm", () => {
  const originalModule = jest.requireActual("../clients/rm");

  return {
    __esModule: true,
    ...originalModule,
    createCosmosDBContainer: jest.fn().mockResolvedValue({
      databaseId: "test",
      containerId: "test",
    }),
    createCNAMERecord: jest.fn(),
    deleteCNAMERecord: jest.fn(),
    addHostToFrontdoor: jest.fn(),
  };
});

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

jest.mock("@azure/arm-frontdoor", () => ({
  FrontDoorManagementClient: jest.fn().mockImplementation(() => ({
    frontDoors: {
      get: jest.fn().mockImplementation(() =>
        Promise.resolve({
          frontendEndpoints: [{ id: "mojito-jiang.azurefd.net" }],
          routingRules: [
            {
              id: "http-to-https-redirect",
              frontendEndpoints: [{ id: "mojito-jiang.azurefd.net" }],
            },
            {
              id: "mojito-routing",
              frontendEndpoints: [{ id: "mojito-jiang.azurefd.net" }],
            },
          ],
        })
      ),
      createOrUpdate: jest
        .fn()
        .mockResolvedValueOnce({
          frontendEndpoints: [
            { id: "mojito-jiang.azurefd.net" },
            { id: "test" },
          ],
          routingRules: [
            {
              id: "http-to-https-redirect",
              frontendEndpoints: [{ id: "mojito-jiang.azurefd.net" }],
            },
            {
              id: "mojito-routing",
              frontendEndpoints: [{ id: "mojito-jiang.azurefd.net" }],
            },
          ],
        })
        .mockResolvedValueOnce({
          frontendEndpoints: [
            { id: "mojito-jiang.azurefd.net" },
            { id: "test" },
          ],
          routingRules: [
            {
              id: "http-to-https-redirect",
              frontendEndpoints: [
                { id: "mojito-jiang.azurefd.net" },
                { id: "test" },
              ],
            },
            {
              id: "mojito-routing",
              frontendEndpoints: [
                { id: "mojito-jiang.azurefd.net" },
                { id: "test" },
              ],
            },
          ],
        }),
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

describe("module host", () => {
  beforeAll(async () => {
    db = await getDatabase();
  });
  beforeEach(async () => {
    await cleanHosts(db);
    await cleanTasks(db);
  });
  it("create a host: should create a host record, call createCosmosDBContainer and createCNAMERecord and addHostToFrontdoor", async () => {
    expect.hasAssertions();
    const mansionId = "test-host-mansion-1";
    try {
      Promise.all([
        db.upsert(Partitions.Mansions, {
          ...baseMansion,
          id: mansionId,
        }),
      ]);
      const cname = "test-001";
      const plan = "TRIAL";
      const romuFeatures = ["DIGITAL_CONTRACT", "MYNUMBER"];
      const kintaiFeatures = ["SHIFT", "MAN_HOUR_MANAGEMENT"];
      const kyuyoFeatures = ["NOT_YET"];

      await createHost(db, {
        mansionId,
        cname,
        plan,
        selectedFeatures: [],
        memo: "test",
        products: ["TALENT"],
        romuFeatures,
        kintaiFeatures,
        kyuyoFeatures,
      });

      const host = await db.read(Partitions.Hosts, "test-001.mojito.dev");
      expect(host.connectionString).toBe("");
      expect(createCosmosDBContainer).toHaveBeenCalled();
      expect(createCNAMERecord).toHaveBeenCalled();
      expect(addHostToFrontdoor).toHaveBeenCalled();
    } catch (error) {
      expect(error.code).toBe(404);
    }
  });

  it("create a host: should import mansion.databaseId", async () => {
    expect.hasAssertions();
    try {
      const mansionId = "test-host-mansion-create-a-host";
      Promise.all([
        db.upsert(Partitions.Mansions, {
          ...baseMansion,
          databaseId: "mojito-test",
          id: mansionId,
        }),
      ]);

      const cname = "test-mansion-databaseId";
      const plan = "TRIAL";
      const romuFeatures = ["DIGITAL_CONTRACT", "MYNUMBER"];
      const kintaiFeatures = ["SHIFT", "MAN_HOUR_MANAGEMENT"];
      const kyuyoFeatures = ["NOT_YET"];

      await createHost(db, {
        mansionId,
        cname,
        plan,
        selectedFeatures: [],
        memo: "test",
        products: ["TALENT"],
        romuFeatures,
        kintaiFeatures,
        kyuyoFeatures,
      });

      const host = await db.read(
        Partitions.Hosts,
        "test-mansion-databaseId.mojito.dev"
      );
      expect(host.databaseName).toBe("mojito-test");
    } catch (error) {
      expect(error.code).toBe(404);
    }
  });

  it("delete a host: should delete host record, delete tasks of host, call deleteCNAMERecord and removeHostFromFrontdoor", async () => {
    expect.hasAssertions();
    // prepare data
    await db.upsert(Partitions.Hosts, {
      ...baseHost,
      id: "delete-host-001.mojito.dev",
    });
    await db.upsert(Partitions.Tasks, {
      ...baseTask,
      id: "task-001",
      host: "delete-host-001.mojito.dev",
    });
    await db.upsert(Partitions.Tasks, {
      ...baseTask,
      id: "task-002",
      host: "delete-host-001.mojito.dev",
    });
    await db.upsert(Partitions.Tasks, {
      ...baseTask,
      id: "task-003",
      host: "delete-host-001.mojito.dev",
    });
    await db.upsert(Partitions.Tasks, {
      ...baseTask,
      id: "task-004",
      host: "delete-host-001.mojito.dev",
    });

    try {
      await deleteHost(db, "delete-host-001.mojito.dev");

      const tasks = await db.find(Partitions.Tasks, {
        filter: {
          host: "delete-host-001.mojito.dev",
        },
      });
      expect(tasks.length).toEqual(0);
      expect(deleteCNAMERecord).toHaveBeenCalled();
      await db.read(Partitions.Hosts, "delete-host-001.mojito.dev");
    } catch (error) {
      expect(error.code).toBe(404);
    }
  });

  test("should find 2 publishing hosts and set 1 host to published, error 1 host", async () => {
    try {
      await Promise.all([
        await db.upsert(Partitions.Hosts, {
          ...baseHost,
          id: "access-hosts-01.mojito.dev",
          state: "publishing",
        }),

        await db.upsert(Partitions.Hosts, {
          ...baseHost,
          id: "dev.mojito.dev",
          state: "publishing",
        }),

        await db.upsert(Partitions.Hosts, {
          ...baseHost,
          id: "mfa.mojito.dev",
          state: "created",
        }),

        await db.upsert(Partitions.Hosts, {
          ...baseHost,
          id: "access-hosts-02.mojito.dev",
          state: "published",
        }),
      ]);

      console.error = jest.fn();

      await accessHosts(db);

      const publishingHost = await db.read(
        Partitions.Hosts,
        "access-hosts-01.mojito.dev"
      );
      expect(publishingHost.state).toBe("publishing");

      const devHost = await db.read(Partitions.Hosts, "dev.mojito.dev");
      expect(devHost.state).toBe("published");

      const mfaHost = await db.read(Partitions.Hosts, "mfa.mojito.dev");
      expect(mfaHost.state).toBe("published");

      expect(console.error).toHaveBeenCalledTimes(1);
    } catch (error) {
      console.error(error);
    }
  });
});
