import { spawn } from "bun";

export const showPopup = async (
  title: string,
  message: string,
  timeoutSeconds = 10,
) => {
  const safeMessage = message.replace(/"/g, '\\"');
  const safeTitle = title.replace(/"/g, '\\"');

  const appleScript = `
    display dialog "${safeMessage}" ¬
    with title "${safeTitle}" ¬
    buttons {"OK"} ¬
    default button "OK" ¬
    giving up after ${timeoutSeconds}
  `;

  await spawn(["osascript", "-e", appleScript]);
};
