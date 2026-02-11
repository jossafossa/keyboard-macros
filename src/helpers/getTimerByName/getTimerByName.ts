import { getSettings } from "../getSettings";

export const getTimerByName = (name: string) => {
  const { macros } = getSettings();
  const timers = Object.values(macros).filter(
    (macro) => macro.type === "timer",
  );

  return timers.find((timer) => timer.value === name);
};
