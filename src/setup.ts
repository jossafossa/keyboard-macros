import HID from "node-hid";
import {
  writeFileSync,
  existsSync,
  copyFileSync,
  readFileSync,
  appendFileSync,
} from "node:fs";
import { homedir } from "node:os";

// is --debug flag enabled
const isDebug = process.argv.includes("--debug") || process.argv.includes("-d");

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
  isDebug && console.log(filteredDevices);
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
  if (!existsSync("settings.json")) {
    console.log("📝 Creating default macros.json configuration...");
    copyFileSync("settings.example.json", "settings.json");

    console.log(
      "✅ Created macros.json! Edit this file to customize your timer macros.",
    );
  } else {
    console.log(
      "📝 macros.json already exists. Edit it to customize your timer macros.",
    );
  }
}

async function setupAutostart() {
  const zshrcPath = `${homedir()}/.zshrc`;
  const macrosPath = process.cwd();

  // Check if autostart is already configured
  if (existsSync(zshrcPath)) {
    const zshrcContent = readFileSync(zshrcPath, "utf-8");
    if (zshrcContent.includes("MACROS_PID_FILE")) {
      console.log("✅ Autostart is already configured in your .zshrc");
      return;
    }
  }

  console.log("\n🚀 Would you like to enable automatic startup?");
  console.log(
    "   This will start the macros app automatically when you open a new terminal.",
  );
  process.stdout.write("Enable autostart? (y/N): ");

  // Set up stdin to read user input
  process.stdin.setEncoding("utf-8");

  const choice = await new Promise<string>((resolve) => {
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });

  if (choice.toLowerCase() === "y" || choice.toLowerCase() === "yes") {
    const autostartCode = `
# Macros auto-start
MACROS_PID_FILE="${macrosPath}/.macros.pid"
if ! ([[ -f "$MACROS_PID_FILE" ]] && kill -0 "$(cat "$MACROS_PID_FILE")" 2>/dev/null); then
  rm -f "$MACROS_PID_FILE"
  (cd ${macrosPath} && bun --env-file=.env run start >> ./logs/macros.log 2>&1 & echo $! > "$MACROS_PID_FILE")
  echo "🚀 Started macros background process (PID: $(cat "$MACROS_PID_FILE"))"
fi
`;

    appendFileSync(zshrcPath, autostartCode);

    console.log("✅ Added autostart to your .zshrc");
    console.log(`📁 Logs will be saved to: ${macrosPath}/logs/macros.log`);
    console.log(`🛑 To stop manually: kill $(cat ${macrosPath}/.macros.pid)`);
  } else {
    console.log("⏭️  Skipped autostart configuration");
  }

  // Clean up stdin
  process.stdin.pause();
}

async function setup() {
  console.log("🚀 Setting up your macros application...\n");

  await setupDevice();

  setupMacros();

  await setupAutostart();

  console.log(
    "\n🎉 Setup complete! Run 'bun start' to begin using your macros.",
  );
}

setup();
