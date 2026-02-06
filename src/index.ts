import { connect } from "./connect";
import {
  getSettings,
  getTimerOverview,
  onDeviceKeyPress,
  playJolke,
  sendNotification,
} from "./helpers";
import { getAccumulatedTime } from "./helpers/getAccumulatedTime/getAccumulatedTime";
import { showText, timer } from "./helpers";

const init = () => {
  const DEVICE_VENDOR_ID = process.env.DEVICE_VENDOR_ID;
  const DEVICE_PRODUCT_ID = process.env.DEVICE_PRODUCT_ID;

  if (!DEVICE_VENDOR_ID || !DEVICE_PRODUCT_ID) {
    throw new Error(
      "❌ Failed to retrieve device configuration from environment variables. Please run `bun run setup` first.",
    );
  }

  const SETTINGS = getSettings();
  const TIMER_MACROS = SETTINGS.macros;
  const NR_OF_MACROS = Object.keys(TIMER_MACROS).length;

  const device = connect(DEVICE_VENDOR_ID, DEVICE_PRODUCT_ID);
  console.log("✅ Connected to", device.getDeviceInfo().product);
  console.log(`✅ Loaded ${NR_OF_MACROS} timer macros from configuration`);
  console.table(TIMER_MACROS);

  const fireTimerMacro = (macro: string) => {
    const sessions = timer.getSessions();

    const activeSession = sessions.find(
      (session) => session.id === macro && !session.endTime,
    );

    if (activeSession) {
      stop(macro);
      sendNotification(getTimerOverview(), "Timer Stopped");
    }
    if (!activeSession) {
      if (SETTINGS.useOnlyOneTimer) {
        sessions.forEach((session) => {
          if (!session.endTime) {
            stop(session.id);
          }
        });
      }

      start(macro);
      sendNotification(getTimerOverview(), "Timer Started");
    }
  };

  const SPECIAL_MACROS = new Map<string, () => void>([
    [
      "Enter",
      () => {
        const accumulatedTime = getAccumulatedTime();
        const prettyAccumulatedTime = Object.entries(accumulatedTime)
          .map(([id, time]) => `${id}: ${time}`)
          .join("\n");

        console.table(accumulatedTime);
        console.table(getSessions());
        showText(prettyAccumulatedTime);
      },
    ],
    [
      "9",
      () => {
        playJolke();
      },
    ],
    [
      "0",
      () => {
        sendNotification(getTimerOverview(), "Timer overview");
      },
    ],
    [
      "-",
      () => {
        timer.clearSessions();
        sendNotification("All timers cleared");
      },
    ],
  ]);

  const { start, stop, getSessions } = timer;

  onDeviceKeyPress(device, (character: string) => {
    const timerMacro = TIMER_MACROS[character];

    if (timerMacro) {
      fireTimerMacro(timerMacro.value);
    }

    const specialMacro = SPECIAL_MACROS.get(character);
    specialMacro?.();
  });
};

(() => {
  try {
    init();
  } catch (error) {
    console.log(error);
  }
})();
