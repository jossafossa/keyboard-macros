import { timer } from "../timer";
import { getSettings } from "../getSettings";

/*
  each macro has a character associated with it.
  each macro has an id which corresponds to a place in the numpad.
  whenever a timer is activated, show the the character at the corresponding place in the numpad, and hide it when the timer is stopped.


  By default it displays this.
  ⚫️ ⚫️ ⚫️
  ⚫️ ⚫️ ⚫️
  ⚫️ ⚫️ ⚫️

  Whenever timer 1 5 and 7 are started it should display this:
  🟤 ⚫️ ⚫️
  ⚫️ ⚪️ ⚫️
  🔴 ⚫️ ⚫️

*/
export const getTimerOverview = (): string => {
  const sessions = timer.getSessions();
  const macros = getSettings().macros;

  // Get active timer values (sessions without endTime)
  const activeTimerValues = sessions
    .filter((session) => !session.endTime)
    .map((session) => session.id);

  // Create a 3x3 grid representing numpad positions
  // Layout: 7 8 9
  //         4 5 6
  //         1 2 3
  const positions = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
  ];

  // Build the visual representation
  const grid = positions
    .map((row) =>
      row
        .map((position) => {
          const macro = macros[position];

          if (!macro) {
            return "⚫️";
          }

          // Check if this macro's value is in the active timers
          const isActive = activeTimerValues.includes(macro.value);

          if (isActive) {
            return macro.character;
          }
          return "⚫️";
        })
        .join(" "),
    )
    .join("\n");

  return `${grid}\n⏱️ ${activeTimerValues.join(", ") || "None"}`;
};
