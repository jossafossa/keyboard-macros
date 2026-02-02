import { connect } from "./connect";
import { getMacros, onDeviceKeyPress, sendNotification } from "./helpers";
import { showText } from "./helpers/showText/showText";
import { createTimerManager } from "./timer";
import { existsSync } from "node:fs";

const DEVICE_PATH = process.env.DEVICE_PATH;
const DEVICE_NAME = process.env.DEVICE_NAME;

if (!DEVICE_PATH || !DEVICE_NAME) {
  throw new Error(
    "❌ Failed to retrieve device configuration from environment variables. Please run `bun run setup` first.",
  );
}

const TIMER_MACROS = getMacros();
const NR_OF_MACROS = Object.keys(TIMER_MACROS).length;

const device = connect(DEVICE_PATH);
console.log("✅ Connected to device at path:", DEVICE_PATH);
console.log(`✅ Loaded ${NR_OF_MACROS} timer macros from configuration`);
console.table(TIMER_MACROS);

const fireTimerMacro = (macro: string) => {
  const sessions = getSessions();

  const activeSession = sessions.find(
    (session) => session.id === macro && !session.endTime,
  );

  if (activeSession) {
    stop(macro);
    sendNotification(`Stopped macro: ${macro}`);
  }
  if (!activeSession) {
    start(macro);
    sendNotification(`Started macro: ${macro}`);
  }
};

const SPECIAL_MACROS = new Map<string, () => void>([
  [
    "Enter",
    () => {
      console.table(getSessions());
      showText(JSON.stringify(getSessions(), null, 2));
    },
  ],
]);

const { start, stop, getSessions } = createTimerManager();

onDeviceKeyPress(device, (character: string) => {
  const timerMacro = TIMER_MACROS.get(character);
  if (timerMacro) {
    fireTimerMacro(timerMacro);
  }

  SPECIAL_MACROS.get(character)?.();
});
