import { getTotalFromContentRange } from "./api";

test("should return 117 when Content-Range: items 0-99/107", () => {
  const res = {
    headers: {
      "content-range": "items 0-99/107",
    },
  };
  expect(getTotalFromContentRange(res.headers["content-range"])).toBe(107);
});
