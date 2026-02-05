import { existsSync, readFileSync } from "node:fs";

type MacroValue = {
  type: "timer";
  value: string;
};

export const getMacros = () => {
  if (!existsSync("macros.json")) {
    throw new Error(
      "❌ macros.json configuration file not found. Please run `bun run setup` first.",
    );
  }

  let macrosConfig: Record<string, MacroValue>;
  try {
    macrosConfig = JSON.parse(readFileSync("macros.json", "utf-8"));
  } catch (error) {
    throw new Error(
      "❌ Failed to parse macros.json. Please check the file format or run `bun run setup` to regenerate it.",
    );
  }
  return new Map(Object.entries(macrosConfig));
};
