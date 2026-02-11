import { getAccumulatedTime } from "../getAccumulatedTime";
import { getSettings } from "../getSettings";
import { secondsToHours } from "../secondsToHours";

/*
example output:
🟢 Meetings: 1.5
🔴 Project Development: 3.2
*/
export const getTimerSummary = (): string => {
  const accumulatedTime = getAccumulatedTime();
  const { macros } = getSettings();

  const lines: string[] = [];

  // Iterate through macros in the order they appear in settings
  for (const [key, macro] of Object.entries(macros)) {
    if (macro.type === "timer" && accumulatedTime[macro.value]) {
      const formattedTime = secondsToHours(accumulatedTime[macro.value]);
      lines.push(
        `${macro.character} (${key}) ${macro.value}: ${formattedTime}`,
      );
    }
  }

  return lines.join("\n");
};
