import { connect } from "./connect";
import {
  getTimerSummary,
  getSettings,
  getTimerOverview,
  Macro,
  playSoundEffect,
  sendNotification,
  showPopup,
  TimerMacro,
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

  const fireAction = (macro: Macro) => {
    switch (macro.type) {
      case "timer":
        fireTimerMacro(macro.value);
        break;
      case "soundEffect":
        playSoundEffect();
        break;
      case "overview":
        sendNotification(getTimerOverview(), "Timer overview");
        break;
      case "clearAll":
        timer.clearSessions();
        sendNotification("All timers cleared");
        break;
      case "stopAll":
        timer.stopAllTimers();
        sendNotification("All timers stopped");
        break;
      case "summary":
        const overview = getTimerSummary();
        showPopup("Accumulated Time", overview);
        break;
    }
  };

  const SETTINGS = getSettings();
  const TIMER_MACROS = SETTINGS.macros;
  const NR_OF_MACROS = Object.keys(TIMER_MACROS).length;

  const device = connect(DEVICE_VENDOR_ID, DEVICE_PRODUCT_ID, {
    onConnect: () => {
      console.log("✅ Connected to", device.getDeviceInfo().product);
      console.log(`✅ Loaded ${NR_OF_MACROS} timer macros from configuration`);
      console.table(TIMER_MACROS);
      sendNotification("Device connected");
    },
    onDisconnect: () => {
      sendNotification("Device disconnected");
    },
    onKeyPress: (character: string) => {
      const customMacro = TIMER_MACROS[character];

      if (customMacro) {
        fireAction(customMacro);
        return;
      }
    },
  });

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

  const { start, stop } = timer;
};

init();
