const db: { [key: string]: any } = {};

export default {
  setItem: async (key: string, value: any) => {
    db[key] = value;
  },
  getItem: async (key: string) => {
    return db?.[key];
  },
};
