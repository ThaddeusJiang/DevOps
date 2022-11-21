import { nextQuery } from "./url";

describe("utils url", () => {
  test('should be {"host LIKE":"%jiang%"}', () => {
    const query = { filter: '{"host LIKE": "%dev%"}' };
    const next = nextQuery(query, "host", "jiang");

    expect(next).toEqual({ filter: '{"host LIKE":"%jiang%"}' });
  });

  test("nextFilterString should be {}", () => {
    const query = { filter: '{"host LIKE": "%dev%"}' };
    const next = nextQuery(query, "host", "");

    expect(next).toEqual({ filter: "{}" });
  });
});
