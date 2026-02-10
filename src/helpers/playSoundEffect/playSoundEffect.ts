import Audic from "audic";
import { readdirSync } from "fs";

const soundBytes = readdirSync("sound-effects/").map(
  (file) => new Audic(`sound-effects/${file}`),
);

const getSoundEffect = () => {
  const randomIndex = Math.floor(Math.random() * soundBytes.length);
  return soundBytes[randomIndex];
};

export const playSoundEffect = () => {
  getSoundEffect().play();
};
