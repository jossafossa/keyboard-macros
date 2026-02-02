import { HID } from "node-hid";
import { keyCodeToChar } from "../keyCodeToChar";

export const onDeviceKeyPress = (
  device: HID,
  callback: (character: string) => void,
) => {
  device.on("data", (data: Buffer) => {
    const keyCode = data[3];

    const character = keyCodeToChar(keyCode);

    if (!character) return;
    callback(character);
  });
};
