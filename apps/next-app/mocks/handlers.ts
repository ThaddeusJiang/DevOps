import { rest } from "msw";

import {
  MockAuditLogs,
  MockCustomers,
  MockMansions,
  MockTaskDefinitions,
  MockTasks,
} from "../data/mocks";

const handlers = [
  rest.get("/api/curd/Mansions", (req, res, ctx) => {
    return res(ctx.status(200), ctx.set("Content-Range", "Mansions 0-5/5"), ctx.json(MockMansions));
  }),
  rest.get("/api/curd/Mansions/:mansionId", (req, res, ctx) => {
    const mansionId = req.params.mansionId;
    const mansion = MockMansions.find((mansion) => mansion.id === mansionId);
    return res(ctx.status(200), ctx.json(mansion));
  }),
  rest.get("/api/curd/Customers", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set("Content-Range", "Customers 0-11/11"),
      ctx.json(MockCustomers)
    );
  }),
  rest.get("/api/curd/Customers/:customerId", (req, res, ctx) => {
    const customerId = req.params.customerId;
    const customer = MockCustomers.find((item) => item.id === customerId);
    return res(ctx.status(200), ctx.json(customer));
  }),

  rest.get("/api/curd/TaskDefinitions", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set("Content-Range", "TaskDefinitions 0-11/11"),
      ctx.json(MockTaskDefinitions)
    );
  }),
  rest.get("/api/curd/TaskDefinitions/:taskDefinitionId", (req, res, ctx) => {
    const taskDefinitionId = req.params.taskDefinitionId;
    const taskDefinition = MockCustomers.find((item) => item.id === taskDefinitionId);
    return res(ctx.status(200), ctx.json(taskDefinition));
  }),

  rest.get("/api/curd/Tasks", (req, res, ctx) => {
    return res(ctx.status(200), ctx.set("Content-Range", "Tasks 0-11/11"), ctx.json(MockTasks));
  }),
  rest.get("/api/curd/Tasks/:taskId", (req, res, ctx) => {
    const taskId = req.params.taskId;
    const task = MockTasks.find((item) => item.id === taskId);
    return res(ctx.status(200), ctx.json(task));
  }),

  rest.get("/api/curd/AuditLogs", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set("Content-Range", "AuditLogs 0-11/11"),
      ctx.json(MockAuditLogs)
    );
  }),
  rest.get("/api/curd/AuditLogs/:logId", (req, res, ctx) => {
    const logId = req.params.logId;
    const log = MockAuditLogs.find((item) => item.id === logId);
    return res(ctx.status(200), ctx.json(log));
  }),
];

export default handlers;
