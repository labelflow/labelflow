import slugify from "slugify";
import { Database } from "./types";

// https://dexie.org/docs/Version/Version.stores()
// First key is set to be the primary key and has to be unique
export default [
  {
    name: "20210527-1424-first version",
    version: 0.1,
    stores: {
      example: "id,createdAt,updatedAt,name",
      image:
        "id,createdAt,updatedAt,url,externalUrl,name,path,mimetype,width,height,datasetId",
      label:
        "id,createdAt,updatedAt,imageId,x,y,height,width,labelClassId,geometry",
      labelClass: "id,createdAt,updatedAt,name,color,datasetId",
      dataset: "id,createdAt,updatedAt,&name",
    },
  },
  {
    name: "20210527-1424-first version",
    version: 0.2,
    stores: {
      example: "id,createdAt,updatedAt,name",
      image:
        "id,createdAt,updatedAt,url,externalUrl,name,path,mimetype,width,height,datasetId",
      label:
        "id,createdAt,updatedAt,imageId,x,y,height,width,labelClassId,geometry",
      labelClass: "id,createdAt,updatedAt,name,color,datasetId",
      dataset: "id,createdAt,updatedAt,&name,&slug",
    },
    upgrade: (transaction: Dexie.Transaction) => {
      const db = transaction.db as Database;
      return db.dataset.toCollection().modify((dataset) => {
        if (dataset.slug == null) {
          // eslint-disable-next-line no-param-reassign
          dataset.slug = slugify(dataset.name, { lower: true });
        }
        return dataset;
      });
    },
  },
  {
    name: "20210827-1045-add labelclass indices",
    version: 0.3,
    stores: {
      example: "id,createdAt,updatedAt,name",
      image:
        "id,createdAt,updatedAt,url,externalUrl,name,path,mimetype,width,height,datasetId",
      label:
        "id,createdAt,updatedAt,imageId,x,y,height,width,labelClassId,geometry",
      labelClass: "id,index,createdAt,updatedAt,name,color,datasetId",
      dataset: "id,createdAt,updatedAt,&name,&slug",
    },
    upgrade: async (transaction: Dexie.Transaction) => {
      const db = transaction.db as Database;
      const numberLabelClassesUpdated = await (
        await db.dataset.toArray()
      ).reduce(async (numberLabelClassesUpdatedAcc, dataset) => {
        let indexLabelClass = 0;
        return (
          (await db.labelClass
            .where({ datasetId: dataset.id })
            .modify((labelClass) => {
              if (labelClass.index == null) {
                // eslint-disable-next-line no-param-reassign
                labelClass.index = indexLabelClass;
                indexLabelClass += 1;
              }
              return labelClass;
            })) + (await numberLabelClassesUpdatedAcc)
        );
      }, new Promise<number>((resolve) => resolve(0)));
      return numberLabelClassesUpdated;
    },
  },
];
