import { timer } from "../timer";
import { secondsToHours } from "../secondsToHours";

type AccumulatedTime = Record<string, string>;

export const getAccumulatedTime = (): AccumulatedTime => {
  const sessions = timer.getSessions();
  const accumulated: Record<string, number> = {};

  sessions.forEach((session) => {
    if (session.endTime) {
      const duration =
        (session.endTime.getTime() - session.startTime.getTime()) / 1000; // in seconds
      accumulated[session.id] = (accumulated[session.id] || 0) + duration;
    }
  });

  // Convert accumulated time to "hours:minutes" format
  const formattedAccumulated: AccumulatedTime = {};
  for (const id in accumulated) {
    formattedAccumulated[id] = secondsToHours(accumulated[id]);
  }

  return formattedAccumulated;
};
