// https://dexie.org/docs/Version/Version.stores()
// First key is set to be the primary key and has to be unique
export default [
  {
    name: "20210527-1424-first version",
    version: 0.1,
    stores: {
      example: "id,createdAt,updatedAt,name",
      image:
        "id,createdAt,updatedAt,url,externalUrl,name,path,mimetype,width,height,projectId",
      label:
        "id,createdAt,updatedAt,imageId,x,y,height,width,labelClassId,geometry",
      labelClass: "id,createdAt,updatedAt,name,color,projectId",
      project: "id,createdAt,updatedAt,&name",
    },
  },
];
