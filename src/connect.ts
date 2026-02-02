import HID from "node-hid";

export const connect = (path: string) => {    
  try {
    const device = new HID.HID(path, { nonExclusive: true });

    return device;
  } catch (e) {
    throw new Error("❌ Failed to connect to device:");
  }
}