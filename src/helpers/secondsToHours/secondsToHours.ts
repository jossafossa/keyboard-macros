// convert 5400 seconds to 1.50
// convert 3600 seconds to 1.00
export const secondsToHours = (seconds: number): string => {
  return (seconds / 3600).toFixed(2);
};
