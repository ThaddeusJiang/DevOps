import { rest } from "msw";

import { MockMansions } from "../data/mocks";

const handlers = [
  rest.get("/api/curd/Mansions", (req, res, ctx) => {
    return res(ctx.status(200), ctx.set("Content-Range", "Mansions 0-5/5"), ctx.json(MockMansions));
  }),
  rest.get("/api/curd/Mansions/:mansionId", (req, res, ctx) => {
    const mansionId = req.params.mansionId;
    const mansion = MockMansions.find((mansion) => mansion.id === mansionId);
    return res(ctx.status(200), ctx.set("Content-Range", "Mansions 0-5/5"), ctx.json(mansion));
  }),
];

export default handlers;
