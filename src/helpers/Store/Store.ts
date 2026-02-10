import { writeFileSync } from "node:fs";

export const StoreHandler = () => {
  const set = (key: string, value: unknown) => {
    writeFileSync(`./.cache/${key}.json`, JSON.stringify(value, null, 2));
  };

  const get = (key: string): any => {
    try {
      const data = JSON.parse(
        Buffer.from(
          require("node:fs").readFileSync(`./.cache/${key}.json`),
        ).toString(),
      );
      return data;
    } catch {
      console.error(`❌ Failed to read cache for key: ${key}`);
      return null;
    }
  };

  return { set, get };
};
