export const sendNotification = async (
  message: string,
  title = "Macro Keyboard",
) => {
  // osascript -e 'display notification "Lijn 1: Belangrijke info\nLijn 2: Meer details\nLijn 3: Nog meer tekst" with title "Meerregelige Notificatie"'
  const script = `display notification "${message}" with title "${title}"`;
  await Bun.spawn(["osascript", "-e", script]);
  console.log(message);
};
