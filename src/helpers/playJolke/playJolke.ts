import Audic from "audic";
import { readdirSync } from "fs";

const soundBytes = readdirSync("src/assets/mp3").map(
  (file) => new Audic(`src/assets/mp3/${file}`),
);

const getJolke = () => {
  const randomIndex = Math.floor(Math.random() * soundBytes.length);
  return soundBytes[randomIndex];
};

export const playJolke = () => {
  getJolke().play();
};
