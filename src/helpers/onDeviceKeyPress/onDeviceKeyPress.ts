import { HID } from "node-hid";
import { keyCodeToChar } from "../keyCodeToChar";

export const onDeviceKeyPress = (
  device: HID,
  callback: (character: string) => void,
) => {
  device.on("data", (data: Buffer) => {
    const character = [data[4], data[3]]
      .map((code) => keyCodeToChar(code))
      .find(Boolean);

    if (!character) return;

    callback(character);
  });
};
