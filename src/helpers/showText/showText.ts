import { $, write } from "bun";

export const showText = async (content: string) => {
  const path = `/tmp/macro_output_${Date.now()}.txt`;
  await write(path, content);
  await $`open ${path}`;
};
