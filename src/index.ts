import { connect } from "./connect";
import {
  getMacros,
  onDeviceKeyPress,
  playJolke,
  sendNotification,
} from "./helpers";
import { showText } from "./helpers/showText/showText";
import { createTimerManager } from "./timer";

const DEVICE_VENDOR_ID = process.env.DEVICE_VENDOR_ID;
const DEVICE_PRODUCT_ID = process.env.DEVICE_PRODUCT_ID;

if (!DEVICE_VENDOR_ID || !DEVICE_PRODUCT_ID) {
  throw new Error(
    "❌ Failed to retrieve device configuration from environment variables. Please run `bun run setup` first.",
  );
}

const TIMER_MACROS = getMacros();
const NR_OF_MACROS = Object.keys(TIMER_MACROS).length;

const device = connect(DEVICE_VENDOR_ID, DEVICE_PRODUCT_ID);
console.log("✅ Connected to", device.getDeviceInfo().product);
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
  [
    "9",
    () => {
      playJolke();
    },
  ],
]);

const { start, stop, getSessions } = createTimerManager();

onDeviceKeyPress(device, (character: string) => {
  const timerMacro = TIMER_MACROS.get(character);
  if (timerMacro) {
    fireTimerMacro(timerMacro.value);
  }

  const specialMacro = SPECIAL_MACROS.get(character);
  console.log(specialMacro);
  specialMacro?.();
});
