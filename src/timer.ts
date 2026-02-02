type TimerSession = {
  id: string;
  startTime: Date;
  endTime?: Date;
};

export const createTimerManager = () => {
  let sessions: TimerSession[] = [];

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
  };

  const stop = (id: string): void => {
    sessions = sessions.map((session) => {
      if (session.id === id && !session.endTime) {
        return { ...session, endTime: new Date() };
      }
      return session;
    });
  };

  const getSessions = () => [...sessions]; // Return een kopie voor veiligheid

  return {
    start,
    stop,
    getSessions,
  };
};
