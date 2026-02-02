import HID from "node-hid";
import { writeFileSync, existsSync, copyFileSync } from "node:fs";

async function setupDevice() {
  console.log("🔍 Searching for USB devices...");

  const devices = HID.devices();

  const filteredDevices = devices.filter(
    (d, index, self) =>
      d.product &&
      self.findIndex(
        (t) => t.vendorId === d.vendorId && t.productId === d.productId,
      ) === index,
  );

  if (filteredDevices.length === 0) {
    console.log("❌ No devices found. Check your connection.");
    return;
  }

  console.log("\nAvailable devices:");
  filteredDevices.forEach((d, i) => {
    console.log(
      `[${i}] ${d.manufacturer} - ${d.product} (ID: ${d.vendorId}:${d.productId})`,
    );
  });

  // Ask the user to make a choice
  process.stdout.write("\nChoose a number: ");
  for await (const line of console) {
    const choice = parseInt(line);
    const selected = filteredDevices[choice];

    if (selected) {
      const envContent = `DEVICE_VENDOR_ID=${selected.vendorId}\nDEVICE_PRODUCT_ID=${selected.productId}\nDEVICE_NAME="${selected.product}"\nDEVICE_PATH=${selected.path}\n`;

      writeFileSync(".env", envContent);

      console.log(`\n✅ Saved to .env!`);
      console.log(`Device: ${selected.product}`);
      break;
    } else {
      console.log("❌ Invalid choice, please try again.");
    }
  }
}

function setupMacros() {
  if (!existsSync("macros.json")) {
    console.log("📝 Creating default macros.json configuration...");
    // copy from macros.example.json to macros.json
    copyFileSync("macros.example.json", "macros.json");

    console.log(
      "✅ Created macros.json! Edit this file to customize your timer macros.",
    );
  } else {
    console.log(
      "📝 macros.json already exists. Edit it to customize your timer macros.",
    );
  }
}

async function setup() {
  console.log("🚀 Setting up your macros application...\n");

  await setupDevice();

  setupMacros();

  console.log(
    "\n🎉 Setup complete! Run 'bun start' to begin using your macros.",
  );
}

setup();
