export const sendNotification = async (
  message: string,
  title = "Macro Controller",
) => {
  const script = `display notification "${message}" with title "${title}"`;
  await Bun.spawn(["osascript", "-e", script]);
};
