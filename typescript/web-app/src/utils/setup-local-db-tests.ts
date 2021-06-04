import { initMockedDate } from "@labelflow/dev-utils/mockdate";
import { clearGetUrlFromImageIdMem } from "../connectors/apollo-client/resolvers/image";
import { db } from "../connectors/database";
import { client } from "../connectors/apollo-client";

export function setupTestsWithLocalDatabase() {
  beforeAll(() => {
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
    clearGetUrlFromImageIdMem();
    // TODO: Figure out why in images import modal clearStore is undefined
    if (client.clearStore) {
      await client.clearStore();
    }
    initMockedDate();
  });

  // @ts-ignore
  global.Image = class Image extends HTMLElement {
    width: number;

    height: number;

    constructor() {
      super();
      this.width = 42;
      this.height = 36;
      setTimeout(() => {
        this?.onload?.(new Event("onload")); // simulate success
      }, 100);
    }
  };
  // @ts-ignore
  customElements.define("image-custom", global.Image);
}
