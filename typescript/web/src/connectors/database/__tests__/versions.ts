import Dexie from "dexie";
import { v4 as uuid } from "uuid";

import { Database } from "../types";
import versions from "../versions";

describe("migrations", () => {
  it("should migrate dataset to having slugs", async () => {
    const firstMigration = versions[0];
    const slugMigration = versions[1];

    const db = new Dexie("labelflow_local") as Database;
    db.version(firstMigration.version).stores(firstMigration.stores);
    const datasetId = uuid();

    // @ts-ignore
    await db.dataset.add({
      id: datasetId,
      name: "Test Project",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await db.close();
    db.version(slugMigration.version)
      .stores(slugMigration.stores)
      .upgrade(slugMigration.upgrade ?? (() => {}));
    await db.open();

    const dataset = await db.dataset.get(datasetId);

    expect(dataset?.slug).toEqual("test-project");
  });
});
