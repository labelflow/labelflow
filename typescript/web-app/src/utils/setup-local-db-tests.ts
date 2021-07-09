/* eslint-disable-next-line import/no-extraneous-dependencies */
import { initMockedDate } from "@labelflow/dev-utils/mockdate";

import { db } from "../connectors/database";
import { client } from "../connectors/apollo-client-schema";

export function setupTestsWithLocalDatabase() {
  beforeAll(() => {
    // @ts-ignore
    global.URL.createObjectURL = jest.fn(() => "mockedUrl");
    if (!client.clearStore) {
      console.warn(
        "Be careful clearStore is undefined in these tests for some reason."
      );
    }
  });

  beforeEach(async () => {
    // Warning! The order matters for those 2 lines.
    // Otherwise, there is a failing race condition.
    await Promise.all(db.tables.map((table) => table.clear()));

    // TODO: Figure out why in images import modal clearStore is undefined
    if (client.clearStore) {
      await client.clearStore();
    }
    initMockedDate();
  });
}
