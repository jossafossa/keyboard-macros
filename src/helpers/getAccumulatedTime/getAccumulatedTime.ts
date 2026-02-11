import { timer } from "../timer";

type AccumulatedTime = Record<string, number>;

/*
Returns accumulated time per timer ID in seconds
example:
{
  "timer1": 5400,  // 1.5 hours in seconds
  "timer2": 11520  // 3.2 hours in seconds  
}
*/
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

  return accumulated;
};
