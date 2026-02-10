import HID from "node-hid";
import { EventEmitter } from "events";

interface ConnectOptions {
  onDisconnect?: () => void;
  onConnect?: () => void;
}

const createDevice = (vendorId: string, productId: string): HID.HID => {
  const devices = HID.devices();

  const deviceInfo = devices.find(
    (device) =>
      device.vendorId === parseInt(vendorId) &&
      device.productId === parseInt(productId),
  );

  if (!deviceInfo || !deviceInfo.path) {
    throw new Error("❌ Device not found. Please check your connection.");
  }

  return new HID.HID(deviceInfo.path, { nonExclusive: true });
};

export const connect = (
  vendorId: string,
  productId: string,
  options: ConnectOptions = {},
) => {
  const { onDisconnect, onConnect } = options;
  const wrapper = new EventEmitter();
  let currentDevice: HID.HID | null = null;

  const scheduleReconnect = () => {
    console.log("🔄 Reconnecting in 1s...");

    setTimeout(() => {
      try {
        const newDevice = createDevice(vendorId, productId);
        setupDevice(newDevice);
        onConnect?.(); // Call onConnect callback
        console.log("✅ Device reconnected successfully");
      } catch (error) {
        console.error("❌ Reconnection failed:", error);
        scheduleReconnect();
      }
    }, 1000);
  };

  const setupDevice = (device: HID.HID) => {
    currentDevice = device;

    device.on("error", (err) => {
      console.error("❌ Device error:", err);
      try {
        device.close();
      } catch (e) {
        // Ignore cleanup errors
      }
      currentDevice = null;
      onDisconnect?.(); // Call onDisconnect callback
      scheduleReconnect();
    });

    device.on("close", () => {
      console.log("🔌 Device disconnected");
      currentDevice = null;
      onDisconnect?.(); // Call onDisconnect callback
      scheduleReconnect();
    });

    device.on("data", (data) => {
      wrapper.emit("data", data);
    });
  };

  // Simple method forwarding for the methods you actually use
  (wrapper as any).getDeviceInfo = () => {
    if (!currentDevice) throw new Error("Device not connected");
    return currentDevice.getDeviceInfo();
  };

  (wrapper as any).close = () => {
    if (currentDevice) {
      currentDevice.close();
      currentDevice = null;
    }
  };

  try {
    const device = createDevice(vendorId, productId);
    setupDevice(device);
    onConnect?.(); // Call onConnect for initial connection
    return wrapper as HID.HID;
  } catch (e) {
    throw new Error("❌ Failed to connect to device: " + (e as Error).message);
  }
};
