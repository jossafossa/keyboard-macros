import HID from "node-hid";
import { keyCodeToChar } from "./helpers";

interface ConnectOptions {
  onDisconnect?: () => void;
  onConnect?: () => void;
  onKeyPress?: (character: string) => void;
}

export const connect = (
  vendorId: string,
  productId: string,
  options: ConnectOptions = {},
) => {
  const { onDisconnect, onConnect, onKeyPress } = options;
  let currentDevice: HID.HID | null = null;

  const handleDisconnect = () => {
    currentDevice?.close();
    currentDevice = null;
    onDisconnect?.();
    attemptConnection();
  };

  const attemptConnection = () => {
    setTimeout(() => {
      try {
        const devices = HID.devices();
        const deviceInfo = devices.find(
          (device) =>
            device.vendorId === parseInt(vendorId) &&
            device.productId === parseInt(productId),
        );

        if (!deviceInfo?.path) throw new Error("Device not found");

        currentDevice = new HID.HID(deviceInfo.path, { nonExclusive: true });
        currentDevice.on("error", handleDisconnect);
        currentDevice.on("close", handleDisconnect);
        currentDevice.on("data", (data: Buffer) => {
          if (!onKeyPress) return;

          const character = [data[4], data[3]]
            .map((code) => keyCodeToChar(code))
            .find(Boolean);

          if (character) {
            onKeyPress(character);
          }
        });

        onConnect?.();
        console.log("✅ Device connected successfully");
      } catch (error) {
        attemptConnection();
      }
    }, 1000);
  };

  attemptConnection();

  return {
    getDeviceInfo: () => {
      if (!currentDevice) throw new Error("Device not connected");
      return currentDevice.getDeviceInfo();
    },
    close: () => {
      currentDevice?.close();
      currentDevice = null;
    },
  };
};
