import HID from "node-hid";

export const connect = (vendorId: string, productId: string) => {
  try {
    const devices = HID.devices();

    const deviceInfo = devices.find(
      (device) =>
        device.vendorId === parseInt(vendorId) &&
        device.productId === parseInt(productId),
    );

    if (!deviceInfo || !deviceInfo.path) {
      throw new Error("❌ Device not found. Please check your connection.");
    }

    const { path } = deviceInfo;

    const device = new HID.HID(path, { nonExclusive: true });

    return device;
  } catch (e) {
    throw new Error("❌ Failed to connect to device:");
  }
};
