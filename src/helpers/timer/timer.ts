import { StoreHandler } from "../Store";

type TimerSession = {
  id: string;
  startTime: Date;
  endTime?: Date;
};

const TIMER_CACHE_KEY = "timerSessions";

const getTimersFromCache = (): TimerSession[] => {
  const store = StoreHandler();
  const timers = store.get(TIMER_CACHE_KEY) || [];

  return timers.map((timer: any) => ({
    ...timer,
    startTime: new Date(timer.startTime),
    endTime: timer.endTime ? new Date(timer.endTime) : undefined,
  }));
};

export const createTimerManager = () => {
  const store = StoreHandler();
  let sessions: TimerSession[] = getTimersFromCache();
  const start = (id: string): void => {
    // Check of er al een actieve timer met dit ID is om duplicaten te voorkomen
    const existing = sessions.find((s) => s.id === id && !s.endTime);
    if (existing) {
      console.warn(`Timer met id ${id} loopt al.`);
      return;
    }

    const newSession: TimerSession = {
      id,
      startTime: new Date(),
    };

    sessions = [...sessions, newSession];
    store.set(TIMER_CACHE_KEY, sessions);
  };

  const stop = (id: string): void => {
    sessions = sessions.map((session) => {
      if (session.id === id && !session.endTime) {
        return { ...session, endTime: new Date() };
      }
      return session;
    });

    store.set(TIMER_CACHE_KEY, sessions);
  };

  const getSessions = () => [...sessions];

  const clearSessions = () => {
    sessions = [];
    store.set(TIMER_CACHE_KEY, sessions);
  };
  return {
    start,
    stop,
    getSessions,
    clearSessions,
  };
};

const timer = createTimerManager();

export { timer };
