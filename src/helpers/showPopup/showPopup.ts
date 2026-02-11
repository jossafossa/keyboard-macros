import { spawn } from "bun";

export const showPopup = async (
  title: string,
  message: string,
  timeoutSeconds?: number,
) => {
  const safeMessage = message.replace(/"/g, '\\"');
  const safeTitle = title.replace(/"/g, '\\"');

  const appleScript = `
    display dialog "${safeMessage}" ¬
    with title "${safeTitle}" ¬
    buttons {"OK"} ¬
    default button "OK" ¬
    ${timeoutSeconds ? `giving up after ${timeoutSeconds} seconds` : ""}

  `;

  await spawn(["osascript", "-e", appleScript]);
};
