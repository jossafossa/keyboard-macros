import { existsSync, readFileSync } from "node:fs";

type Settings = {
  useOnlyOneTimer: boolean;
  macros: Record<
    string,
    {
      type: "timer";
      value: string;
      character: string;
    }
  >;
};

export const getSettings = () => {
  if (!existsSync("settings.json")) {
    throw new Error(
      "❌ settings.json configuration file not found. Please run `bun run setup` first.",
    );
  }

  let settings: Settings;
  try {
    settings = JSON.parse(readFileSync("settings.json", "utf-8"));
  } catch (error) {
    throw new Error(
      "❌ Failed to parse settings.json. Please check the file format or run `bun run setup` to regenerate it.",
    );
  }
  return settings;
};
