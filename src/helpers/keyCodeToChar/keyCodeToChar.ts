const NUMPAD_MAP: Record<number, string> = {
  82: "NumLock",
  83: "Clear",
  84: "/",
  85: "*",
  86: "-",
  87: "+",
  88: "Enter",
  89: "1",
  90: "2",
  91: "3",
  92: "4",
  93: "5",
  94: "6",
  95: "7",
  96: "8",
  97: "9",
  98: "0",
  99: ".",
  103: "=",
};

export const keyCodeToChar = (keyCode: number) => NUMPAD_MAP[keyCode];
